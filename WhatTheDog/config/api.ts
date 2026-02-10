/**
 * API Configuration
 *
 * This file centralizes all API-related configuration.
 * Update the API_BASE_URL according to your backend setup.
 */

import Constants from "expo-constants";

const getDevHost = (): string => {
  const hostUri =
    Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;
  if (!hostUri) {
    return "localhost";
  }
  return hostUri.split(":")[0];
};

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000";

console.log("[API Config] Base URL:", BASE_URL);
console.log("[API Config] Dev mode:", __DEV__);

export const API_CONFIG = {
  // Base URL for API requests - Update this based on your environment
  BASE_URL,

  // Timeout for requests (in milliseconds)
  TIMEOUT: 30000,

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
    SERVER_ERROR: "Server error. Please try again later.",
    INVALID_IMAGE: "Invalid image format. Please use JPEG or PNG.",
    IMAGE_TOO_LARGE: "Image is too large. Maximum size is 10MB.",
    UPLOAD_FAILED: "Upload failed. Please try again.",
    SEARCH_FAILED: "Search failed. Please try again.",
  },
};

export default API_CONFIG;
