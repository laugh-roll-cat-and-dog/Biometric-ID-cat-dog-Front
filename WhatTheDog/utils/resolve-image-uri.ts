import { API_CONFIG } from "@/config/api";

/**
 * Resolve image URI from backend path or filename
 * Converts file:// URIs and backend paths to proper HTTP URLs
 *
 * @param path - The image path from backend (file:// URI or relative path)
 * @param filename - Optional filename if path is not provided
 * @returns Full HTTP URI ready for Image component
 */
export const resolveImageUri = (path?: string, filename?: string): string => {
  if (!path && !filename) {
    return "";
  }

  const imagePath = path || filename || "";

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  const extractFilename = (value: string): string => {
    const clean = value.split("?")[0].split("#")[0];
    const raw = clean.split("/").pop() || "";
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  };

  if (imagePath.startsWith("file://")) {
    const name = extractFilename(imagePath);
    return `${API_CONFIG.BASE_URL}/images/${encodeURIComponent(name)}`;
  }

  const normalizedPath = imagePath.replace(/^\/+|\/+$/g, "");
  if (normalizedPath.includes("/")) {
    return `${API_CONFIG.BASE_URL}/${normalizedPath}`;
  }

  return `${API_CONFIG.BASE_URL}/images/${encodeURIComponent(normalizedPath)}`;
};
