import { API_CONFIG } from "@/config/api";
import {
  DogSearchResult,
  DogUploadData,
  SearchResponse,
  UploadResponse,
} from "@/types";
import { toUserErrorMessage } from "@/utils/user-error";
import axios, { AxiosInstance } from "axios";
import { Platform } from "react-native";

const api: AxiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
});

// Add request interceptor for debugging
api.interceptors.request.use(
  (config) => {
    console.log("[API Request]", config.method?.toUpperCase(), config.url);
    console.log("[API Request] Full URL:", (config.baseURL || "") + config.url);
    return config;
  },
  (error) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  },
);

// Add response interceptor for debugging
api.interceptors.response.use(
  (response) => {
    console.log("[API Response]", response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error("[API Response Error]", error.message);
    if (error.response) {
      console.error("[API Response Error] Status:", error.response.status);
      console.error("[API Response Error] Data:", error.response.data);
    } else if (error.request) {
      console.error("[API Response Error] No response received");
      console.error("[API Response Error] Request:", error.request);
    }
    return Promise.reject(error);
  },
);

/**
 * Test API connection
 */
export const testConnection = async (): Promise<boolean> => {
  try {
    console.log(
      "[Connection Test] Testing connection to:",
      API_CONFIG.BASE_URL,
    );
    const response = await api.get("/health");
    console.log("[Connection Test] Success:", response.data);
    return true;
  } catch (error) {
    console.error("[Connection Test] Failed:", error);
    return false;
  }
};

const fetchWithAbortTimeout = async <T>(
  url: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<T> => {
  const controller = new AbortController();
  const timeoutHandle = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...init,
      signal: controller.signal,
    });

    const rawText = await response.text();
    const parsed = rawText ? JSON.parse(rawText) : null;

    if (!response.ok) {
      throw new Error(
        parsed?.detail || parsed?.message || `HTTP ${response.status}`,
      );
    }

    return parsed as T;
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(API_CONFIG.ERROR_MESSAGES.TIMEOUT_ERROR);
    }
    throw error;
  } finally {
    clearTimeout(timeoutHandle);
  }
};

/**
 * Search for dogs by text query
 * @param query - Search text (breed name, dog name, etc.)
 * @param searchMode - Search mode ('name' or 'id')
 */
export const searchDogByText = async (
  query: string,
  searchMode: "name" | "id" = "name",
): Promise<SearchResponse> => {
  try {
    // Use fetch on Android for better compatibility with ngrok tunnel
    if (Platform.OS === "android") {
      return await fetchWithAbortTimeout<SearchResponse>(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SEARCH_TEXT}`,
        {
          method: "POST",
          headers: API_CONFIG.DEFAULT_HEADERS,
          body: JSON.stringify({
            query: query,
            search_mode: searchMode,
          }),
        },
        API_CONFIG.SEARCH_TIMEOUT,
      );
    }

    const response = await api.post<SearchResponse>(
      API_CONFIG.ENDPOINTS.SEARCH_TEXT,
      {
        query: query,
        search_mode: searchMode,
      },
      { timeout: API_CONFIG.SEARCH_TIMEOUT },
    );
    return response.data;
  } catch (error) {
    throw new Error(toUserErrorMessage(error, "search"));
  }
};

/**
 * Search for dogs by image
 * @param imageUri - URI of the image file
 * @param imageType - MIME type of the image
 */
export const searchDogByImage = async (
  imageUri: string,
  imageType: string = "image/jpeg",
): Promise<SearchResponse> => {
  try {
    const formData = new FormData();

    const filename = imageUri.split("/").pop() || `image_${Date.now()}.jpg`;
    const lowerName = filename.toLowerCase();
    const mimeType =
      imageType && imageType.startsWith("image/")
        ? imageType
        : lowerName.endsWith(".png")
          ? "image/png"
          : lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")
            ? "image/jpeg"
            : "image/jpeg";

    formData.append("image", {
      uri: imageUri,
      name: filename,
      type: mimeType,
    } as any);

    // Use fetch on Android for better compatibility with ngrok tunnel
    if (Platform.OS === "android") {
      return await fetchWithAbortTimeout<SearchResponse>(
        `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SEARCH_IMAGE}`,
        {
          method: "POST",
          body: formData,
        },
        API_CONFIG.SEARCH_TIMEOUT,
      );
    }

    const response = await api.post<SearchResponse>(
      API_CONFIG.ENDPOINTS.SEARCH_IMAGE,
      formData,
      { timeout: API_CONFIG.SEARCH_TIMEOUT },
    );

    return response.data;
  } catch (error) {
    throw new Error(toUserErrorMessage(error, "imageSearch"));
  }
};

/**
 * Upload a dog image to the database
 * @param imageUri - URI of the image file
 * @param dogData - Dog information (name, breed, etc.)
 */
export const uploadDogImage = async (
  imageUri: string,
  dogData: DogUploadData,
): Promise<UploadResponse> => {
  try {
    console.log("[Upload] Starting single image upload");
    console.log("[Upload] Image URI:", imageUri);
    console.log("[Upload] Dog data:", dogData);
    console.log("[Upload] API Base URL:", API_CONFIG.BASE_URL);
    console.log("[Upload] Upload endpoint:", API_CONFIG.ENDPOINTS.UPLOAD_DOG);
    console.log("[Upload] Platform:", Platform.OS);

    const filename = imageUri.split("/").pop() || `dog_${Date.now()}.jpg`;
    const lowerName = filename.toLowerCase();
    const mimeType = lowerName.endsWith(".png")
      ? "image/png"
      : lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")
        ? "image/jpeg"
        : "image/jpeg";

    // Create FormData (React Native expects a file object with uri)
    const formData = new FormData();

    // On Android, ensure proper file URI handling
    const fileUri =
      Platform.OS === "android" && imageUri.startsWith("/")
        ? `file://${imageUri}`
        : imageUri;

    formData.append("images", {
      uri: fileUri,
      name: filename,
      type: mimeType,
    } as any);
    formData.append("name", dogData.name);
    formData.append("breed", dogData.breed);
    formData.append("age", String(dogData.age || 0));
    formData.append("description", dogData.description || "");

    console.log("[Upload] FormData prepared, sending request...");

    // Use fetch on Android for better ngrok tunnel compatibility
    if (Platform.OS === "android") {
      const uploadUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UPLOAD_DOG}`;
      console.log("[Upload Android] Upload URL:", uploadUrl);

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
        // Don't set Content-Type header - let the platform handle it for FormData
      });

      const rawText = await response.text();
      console.log("[Upload Android] Response status:", response.status);
      console.log("[Upload Android] Response text:", rawText);

      const parsed = rawText ? JSON.parse(rawText) : null;

      if (!response.ok) {
        throw new Error(
          parsed?.detail || parsed?.message || `HTTP ${response.status}`,
        );
      }

      console.log("[Upload] Upload successful:", parsed);

      return {
        success: true,
        message: parsed?.message || "Upload successful",
      };
    } else {
      // Use axios for iOS
      const uploadResponse = await api.post<{
        message: string;
        filename: string;
        bytes: number;
        path: string;
        pet_info: {
          name: string;
          breed: string;
          age: number;
          description: string;
        };
      }>(API_CONFIG.ENDPOINTS.UPLOAD_DOG, formData);

      console.log("[Upload] Upload successful:", uploadResponse.data);

      return {
        success: true,
        message: uploadResponse.data.message,
      };
    }
  } catch (error: any) {
    console.error("[Upload] Error occurred:", error);
    console.error("[Upload] Error message:", error.message);
    console.error("[Upload] Error response:", error.response);
    console.error("[Upload] Error request:", error.request);

    const errorMessage =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      (error instanceof Error ? error.message : JSON.stringify(error));
    console.error("Upload error details:", errorMessage);
    console.error("Full error response:", error.response?.data);
    throw new Error(toUserErrorMessage(errorMessage, "upload"));
  }
};

/**
 * Upload multiple dog images to the database
 * @param imageUris - Array of image URIs
 * @param dogData - Dog information (name, breed, etc.) - same for all images
 */
export const uploadMultipleDogImages = async (
  imageUris: string[],
  dogData: DogUploadData,
): Promise<UploadResponse> => {
  if (imageUris.length === 0) {
    throw new Error(
      toUserErrorMessage("No images provided for upload", "upload"),
    );
  }

  try {
    console.log("[Batch Upload] Starting multiple image upload");
    console.log("[Batch Upload] Number of images:", imageUris.length);
    console.log("[Batch Upload] Platform:", Platform.OS);

    const formData = new FormData();

    // Read files and append to FormData
    for (let i = 0; i < imageUris.length; i++) {
      const imageUri = imageUris[i];
      const filename =
        imageUri.split("/").pop() || `dog_${i}_${Date.now()}.jpg`;
      const lowerName = filename.toLowerCase();
      const mimeType = lowerName.endsWith(".png")
        ? "image/png"
        : lowerName.endsWith(".jpg") || lowerName.endsWith(".jpeg")
          ? "image/jpeg"
          : "image/jpeg";

      // On Android, ensure proper file URI handling
      const fileUri =
        Platform.OS === "android" && imageUri.startsWith("/")
          ? `file://${imageUri}`
          : imageUri;

      formData.append("images", {
        uri: fileUri,
        name: filename,
        type: mimeType,
      } as any);
    }

    formData.append("name", dogData.name);
    formData.append("breed", dogData.breed);
    formData.append("age", String(dogData.age || 0));
    formData.append("description", dogData.description || "");

    console.log("[Batch Upload] FormData prepared, sending request...");

    // Use fetch on Android for better ngrok tunnel compatibility
    if (Platform.OS === "android") {
      const uploadUrl = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.UPLOAD_DOG}`;
      console.log("[Batch Upload Android] Upload URL:", uploadUrl);

      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
        // Don't set Content-Type header - let the platform handle it for FormData
      });

      const rawText = await response.text();
      console.log("[Batch Upload Android] Response status:", response.status);
      console.log("[Batch Upload Android] Response text:", rawText);

      const parsed = rawText ? JSON.parse(rawText) : null;

      if (!response.ok) {
        throw new Error(
          parsed?.detail || parsed?.message || `HTTP ${response.status}`,
        );
      }

      console.log("[Batch Upload] Upload successful");
      return {
        success: true,
        message: `Successfully uploaded ${imageUris.length} image${imageUris.length > 1 ? "s" : ""}`,
      };
    } else {
      // Use axios for iOS
      await api.post(API_CONFIG.ENDPOINTS.UPLOAD_DOG, formData);

      console.log("[Batch Upload] Upload successful");
      return {
        success: true,
        message: `Successfully uploaded ${imageUris.length} image${imageUris.length > 1 ? "s" : ""}`,
      };
    }
  } catch (error: any) {
    console.error("[Batch Upload] Error occurred:", error);
    console.error("[Batch Upload] Error message:", error.message);
    console.error("[Batch Upload] Error response:", error.response);
    console.error("[Batch Upload] Error request:", error.request);

    const errorMessage =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      (error instanceof Error ? error.message : JSON.stringify(error));
    console.error("Batch upload error details:", errorMessage);
    throw new Error(toUserErrorMessage(errorMessage, "upload"));
  }
};

/**
 * Get all dogs from database
 */
export const getAllDogs = async (): Promise<SearchResponse> => {
  try {
    const response = await api.get<SearchResponse>(
      API_CONFIG.ENDPOINTS.GET_ALL_DOGS,
    );
    return response.data;
  } catch (error) {
    throw new Error(toUserErrorMessage(error, "general"));
  }
};

/**
 * Export search result type for use in components
 */
export type { DogSearchResult, DogUploadData, SearchResponse, UploadResponse };

export default api;
