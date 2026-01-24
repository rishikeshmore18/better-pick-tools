/**
 * Whitelist of allowed redirect paths after authentication.
 * This prevents open redirect attacks where attackers could
 * craft malicious URLs to redirect users to external phishing sites.
 */
const ALLOWED_REDIRECT_PATHS = [
  "/",
  "/choose-plan",
  "/members",
  "/subscribe",
  "/success",
  "/cancel",
];

/**
 * Sanitizes a redirect URL to prevent open redirect attacks.
 * Only allows internal paths that are in the whitelist.
 * 
 * @param url - The URL to sanitize (from query params)
 * @param defaultPath - Fallback path if URL is invalid (default: "/choose-plan")
 * @returns A safe internal path
 */
export function sanitizeRedirectUrl(url: string | null, defaultPath: string = "/choose-plan"): string {
  if (!url) return defaultPath;
  
  // Must start with "/" to be an internal path
  if (!url.startsWith("/")) return defaultPath;
  
  // Block any attempt to use protocol handlers (e.g., //evil.com, javascript:, etc.)
  if (url.startsWith("//") || url.includes("://")) return defaultPath;
  
  // Extract the path without query params for validation
  const pathOnly = url.split("?")[0];
  
  // Check if the base path is in our whitelist
  if (ALLOWED_REDIRECT_PATHS.includes(pathOnly)) {
    return url; // Return full URL including query params
  }
  
  // For /subscribe, allow with query params (e.g., /subscribe?plan=annual)
  if (pathOnly === "/subscribe") {
    return url;
  }
  
  return defaultPath;
}
