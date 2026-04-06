/**
 * API Configuration
 *
 * This file centralizes all API-related configuration.
 * Update the API_BASE_URL according to your backend setup.
 */


const DEFAULT_REMOTE_API_URL =
"PASTE_YOUR_NGROK_URL_HERE"; // e.g. "https://my-api-server.com/api"

const normalizeBaseUrl = (url: string): string => url.replace(/\/+$/, "");

const getBaseUrl = (): string => {
  const envBaseUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (envBaseUrl) {
    return normalizeBaseUrl(envBaseUrl);
  }

  return normalizeBaseUrl(DEFAULT_REMOTE_API_URL);
};

const BASE_URL = getBaseUrl();

console.log("[API Config] Base URL:", BASE_URL);
console.log("[API Config] Dev mode:", __DEV__);

export const API_CONFIG = {
  // Base URL for API requests - Update this based on your environment
  BASE_URL,

  // Timeout for requests (in milliseconds)
  TIMEOUT: 0,

  // Shorter search timeout to prevent indefinite freezing on Android
  SEARCH_TIMEOUT: 12000,

  // Upload requests may require long backend processing; 0 means no client timeout
  UPLOAD_TIMEOUT: 0,

  // API Endpoints
  ENDPOINTS: {
    // Search endpoints
    SEARCH_TEXT: "/search",
    SEARCH_IMAGE: "/searchByImage",

    // Upload endpoints
    UPLOAD_DOG: "/upload/photo",

    // Retrieve endpoints
    GET_ALL_DOGS: "/dogs",
    GET_DOG_BY_ID: (id: string) => `/dogs/${id}`,
  },

  // Headers
  DEFAULT_HEADERS: {
    "Content-Type": "application/json",
  },

  // Error messages
  ERROR_MESSAGES: {
    NETWORK_ERROR: "Network error. Please check your connection.",
    TIMEOUT_ERROR: "Request timed out. Please try again.",
    UPLOAD_TIMEOUT_UNCERTAIN:
      "Upload is taking longer than expected. It may still have completed on the server. Please check your uploaded dog list before retrying.",
    SERVER_ERROR: "Server error. Please try again later.",
    INVALID_IMAGE: "Invalid image format. Please use JPEG or PNG.",
    IMAGE_TOO_LARGE: "Image is too large. Maximum size is 10MB.",
    UPLOAD_FAILED: "Upload failed. Please try again.",
    SEARCH_FAILED: "Search failed. Please try again.",
  },
};

export default API_CONFIG;
