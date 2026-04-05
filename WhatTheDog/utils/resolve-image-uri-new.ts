import { API_CONFIG } from "@/config/api";

/**
 * Resolve image URI from backend path or filename
 * Handles file:// URIs and converts them to accessible HTTP(S) endpoints
 */
export const resolveImageUri = (path?: string, filename?: string): string => {
  if (!path && !filename) {
    console.log("[Image URI] No path or filename provided");
    return "";
  }

  const imagePath = path || filename || "";
  console.log(`[Image URI] Raw input: ${imagePath}`);

  // Already HTTP(S) - return as-is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    console.log(`[Image URI] Already HTTP: ${imagePath}`);
    return imagePath;
  }

  // Handle file:// URIs from backend
  if (imagePath.startsWith("file://")) {
    console.log(`[Image URI] Detected file:// URI, attempting conversion...`);

    // Parse the file path
    // Example: file:///Volumes/server-storage/whatthedog/Dogs%20image/dog_54/31ec5243a8ce452fa64d5be8d571b867.jpeg

    // Extract everything after "whatthedog/"
    const whattheDogIndex = imagePath.indexOf("whatthedog/");
    let relativePath = "";

    if (whattheDogIndex !== -1) {
      relativePath = imagePath.substring(
        whattheDogIndex + "whatthedog/".length,
      );
      console.log(`[Image URI] Extracted relative path: ${relativePath}`);
    } else {
      // Fallback: just use the last two path components (dog_id/filename)
      const parts = imagePath.split("/");
      relativePath = parts.slice(-2).join("/");
      console.log(
        `[Image URI] Fallback - extracted last 2 segments: ${relativePath}`,
      );
    }

    // Try multiple URL patterns
    const filename_only = imagePath.split("/").pop() || "";

    const urls = [
      // Try path directly after /static/
      `${API_CONFIG.BASE_URL}/static/${relativePath}`,
      // Try without static
      `${API_CONFIG.BASE_URL}/${relativePath}`,
      // Try with /images/ prefix (filename only)
      `${API_CONFIG.BASE_URL}/images/${filename_only}`,
      // Try full reconstructed static path
      `${API_CONFIG.BASE_URL}/Dogs%20image/${relativePath.split("/").slice(1).join("/")}`,
    ].filter(Boolean);

    console.log("[Image URI] Candidates:", urls);

    // For now return the first candidate
    const selectedUrl = urls[0];
    console.log(`[Image URI] Selected: ${selectedUrl}`);
    return selectedUrl;
  }

  // Handle regular paths
  const normalizedPath = imagePath.replace(/^\/+|\/+$/g, "");
  return `${API_CONFIG.BASE_URL}/${normalizedPath}`;
};
