/**
 * API Utility Functions for Django REST Framework
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

// --- Token Management ---

/**
 * Stores tokens in localStorage
 */
export const setToken = (accessToken: string, refreshToken: string): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("access_token", accessToken);
    localStorage.setItem("refresh_token", refreshToken);
  }
};

/**
 * Retrieves the access token from localStorage
 */
export const getToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("access_token");
  }
  return null;
};

/**
 * Clears tokens from localStorage
 */
export const clearTokens = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  }
};

// --- Error Handling ---

/**
 * Standardized error handler for fetch responses
 */
const handleResponse = async (response: Response) => {
  const data = await response.json();

  if (!response.ok) {
    // If it's a validation error (DRF usually returns an object), stringify it
    // so it can be parsed by the UI components.
    if (typeof data === "object") {
      throw new Error(JSON.stringify(data));
    }
    throw new Error(data.detail || data.message || "An unexpected error occurred");
  }

  return data;
};

// --- API Functions ---

/**
 * Calls the login endpoint
 */
export const loginApi = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/accounts/login/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  return handleResponse(response);
};

/**
 * Calls the registration endpoint
 */
export const signupApi = async (
  username: string,
  email: string,
  password: string,
  passwordConfirm: string
) => {
  const response = await fetch(`${API_BASE_URL}/accounts/register/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      password,
      password_confirm: passwordConfirm, // Django usually expects snake_case
    }),
  });

  return handleResponse(response);
};

/**
 * Token Refresh Utility (Optional but useful for full implementation)
 */
export const refreshTokenApi = async () => {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) throw new Error("No refresh token found");

  const response = await fetch(`${API_BASE_URL}/accounts/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  return handleResponse(response);
};

/**
 * Calls the logout endpoint to blacklist the refresh token
 */
export const logoutApi = async () => {
  const accessToken = getToken();
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) return;

  await fetch(`${API_BASE_URL}/accounts/logout/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });
};
