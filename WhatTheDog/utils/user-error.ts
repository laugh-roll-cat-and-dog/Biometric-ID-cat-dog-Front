import API_CONFIG from "@/config/api";

type ErrorContext =
  | "search"
  | "imageSearch"
  | "upload"
  | "camera"
  | "gallery"
  | "general";

export const USER_MESSAGES = {
  SEARCH_QUERY_REQUIRED: "Please enter a name or ID to search.",
  SEARCH_NO_RESULTS: "No dogs matched your search.",
  IMAGE_REQUIRED: "Please select an image first.",
  DOG_NAME_REQUIRED: "Please enter the dog's name.",
  UPLOAD_IMAGE_REQUIRED: "Please select at least one image.",
  UPLOAD_SUCCESS_TITLE: "Upload complete",
  UPLOAD_SUCCESS_BODY: "Dog photo(s) uploaded successfully.",
  GENERIC_ERROR: "Something went wrong. Please try again.",
};

const includesAny = (text: string, terms: string[]): boolean =>
  terms.some((term) => text.includes(term));

const toRawMessage = (error: unknown): string => {
  if (typeof error === "string") {
    return error;
  }
  if (error instanceof Error) {
    return error.message || "";
  }
  try {
    return JSON.stringify(error);
  } catch {
    return "";
  }
};

export const toUserErrorMessage = (
  error: unknown,
  context: ErrorContext = "general",
): string => {
  const raw = toRawMessage(error).toLowerCase();

  if (!raw) {
    return USER_MESSAGES.GENERIC_ERROR;
  }

  if (includesAny(raw, ["permission denied", "not granted"])) {
    if (context === "camera") {
      return "Camera permission is required to take photos.";
    }
    if (context === "gallery") {
      return "Gallery permission is required to select images.";
    }
    return "Permission is required to continue this action.";
  }

  if (includesAny(raw, ["timeout", "aborterror", "econnaborted"])) {
    return API_CONFIG.ERROR_MESSAGES.TIMEOUT_ERROR;
  }

  if (
    includesAny(raw, [
      "network error",
      "failed to fetch",
      "enotfound",
      "econnrefused",
    ])
  ) {
    return API_CONFIG.ERROR_MESSAGES.NETWORK_ERROR;
  }

  if (includesAny(raw, ["no images provided"])) {
    return USER_MESSAGES.UPLOAD_IMAGE_REQUIRED;
  }

  if (includesAny(raw, ["query must be an integer"])) {
    return "Please enter a valid numeric ID.";
  }

  if (includesAny(raw, ["http 404", "code=404"])) {
    if (context === "search" || context === "imageSearch") {
      return USER_MESSAGES.SEARCH_NO_RESULTS;
    }
    return "The requested item was not found.";
  }

  if (includesAny(raw, ["http 500", "database query failed", "server error"])) {
    return API_CONFIG.ERROR_MESSAGES.SERVER_ERROR;
  }

  if (context === "search" || context === "imageSearch") {
    return API_CONFIG.ERROR_MESSAGES.SEARCH_FAILED;
  }

  if (context === "upload") {
    return API_CONFIG.ERROR_MESSAGES.UPLOAD_FAILED;
  }

  return USER_MESSAGES.GENERIC_ERROR;
};
