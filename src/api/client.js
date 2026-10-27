const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

export class ApiError extends Error {
  constructor(message, status, errors = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errors = errors && typeof errors === "object" ? errors : {};
  }
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
      credentials: "include",
    });
  } catch {
    throw new ApiError("Unable to reach the server. Check your connection and try again.", 0);
  }

  let result;
  try {
    result = await response.json();
  } catch {
    throw new ApiError("The server returned an invalid response.", response.status);
  }

  if (!response.ok || result.success === false) {
    throw new ApiError(
      result.message || "The request could not be completed.",
      response.status,
      result.errors,
    );
  }

  return result;
}
