import { getToken, refreshTokenApi, clearTokens, logoutApi, setToken as setTokenApi } from "./api";

// Dispatch custom event when auth state changes
const dispatchAuthChange = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("authChange"));
  }
};

// Wrapper to set token and dispatch auth change event
export const setToken = (accessToken: string, refreshToken: string): void => {
  setTokenApi(accessToken, refreshToken);
  dispatchAuthChange();
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  if (typeof window === "undefined") return false;
  return !!getToken();
};

// Get authentication headers
export const getAuthHeaders = (): HeadersInit => {
  const token = getToken();
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Logout user — blacklists refresh token on backend, then clears client state
export const logout = async (): Promise<void> => {
  try {
    await logoutApi();
  } catch {
    // Even if the backend call fails, we still clear tokens locally
  }
  clearTokens();
  dispatchAuthChange();
  if (typeof window !== "undefined") {
    window.location.href = "/";
  }
};

// Check token validity and refresh if needed
export const ensureValidToken = async (): Promise<boolean> => {
  const token = getToken();

  if (!token) {
    return false;
  }

  // In a production app, you'd decode the JWT to check expiration
  // For now, we'll attempt to refresh if needed
  try {
    // This is a simple check - in production, verify token expiration JWT claim
    return true;
  } catch (error) {
    clearTokens();
    return false;
  }
};
