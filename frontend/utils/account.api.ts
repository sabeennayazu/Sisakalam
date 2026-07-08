import { apiFetch } from "./client";

/**
 * Fetches the currently authenticated user's profile information.
 *
 * @returns The current user's profile data.
 * @requiresAuthentication true
 */
export const getCurrentUser = async () => {
  return apiFetch("/accounts/me/");
};

/**
 * Updates the authenticated user's profile fields.
 *
 * @param payload Profile fields to update.
 * @returns The updated profile data.
 * @requiresAuthentication true
 */
export const updateProfile = async (payload: Record<string, unknown>) => {
  // TODO: Backend endpoint pending for profile updates.
  return apiFetch("/accounts/me/", { method: "PATCH", body: payload });
};

/**
 * Uploads a profile image for the authenticated user.
 *
 * @param file The image file to upload.
 * @returns The updated profile data.
 * @requiresAuthentication true
 */
export const uploadProfileImage = async (file: File) => {
  // TODO: Backend endpoint pending for profile image uploads.
  const formData = new FormData();
  formData.append("profile_picture", file);
  return apiFetch("/accounts/me/avatar/", { method: "POST", body: formData });
};

/**
 * Changes the authenticated user's password.
 *
 * @param payload The current and new password values.
 * @returns A success response from the backend.
 * @requiresAuthentication true
 */
export const changePassword = async (payload: Record<string, unknown>) => {
  // TODO: Backend endpoint pending for password changes.
  return apiFetch("/accounts/change-password/", { method: "POST", body: payload });
};

/**
 * Requests a password reset email.
 *
 * @param email The email address associated with the account.
 * @returns A success response from the backend.
 * @requiresAuthentication false
 */
export const forgotPassword = async (email: string) => {
  // TODO: Backend endpoint pending for password reset requests.
  return apiFetch("/accounts/forgot-password/", { method: "POST", body: { email } });
};

/**
 * Resets a password using a validation token.
 *
 * @param payload The reset token and new password values.
 * @returns A success response from the backend.
 * @requiresAuthentication false
 */
export const resetPassword = async (payload: Record<string, unknown>) => {
  // TODO: Backend endpoint pending for password resets.
  return apiFetch("/accounts/reset-password/", { method: "POST", body: payload });
};

/**
 * Verifies a user's email address.
 *
 * @param token The email verification token.
 * @returns A success response from the backend.
 * @requiresAuthentication false
 */
export const verifyEmail = async (token: string) => {
  // TODO: Backend endpoint pending for email verification.
  return apiFetch("/accounts/verify-email/", { method: "POST", body: { token } });
};

/**
 * Resends an email verification message.
 *
 * @returns A success response from the backend.
 * @requiresAuthentication true
 */
export const resendVerification = async () => {
  // TODO: Backend endpoint pending for resending verification emails.
  return apiFetch("/accounts/resend-verification/", { method: "POST" });
};

/**
 * Searches for users by query text.
 *
 * @param query The search string.
 * @returns Matching user profiles.
 * @requiresAuthentication false
 */
export const searchUsers = async (query: string) => {
  // TODO: Backend endpoint pending for user search.
  return apiFetch("/accounts/search/", { query: { q: query } });
};

/**
 * Retrieves a public profile for a specific user.
 *
 * @param userId The user identifier.
 * @returns The public profile data for the requested user.
 * @requiresAuthentication false
 */
export const getUserProfile = async (userId: string | number) => {
  // TODO: Backend endpoint pending for public profile lookup.
  return apiFetch(`/accounts/users/${userId}/`);
};

/**
 * Follows a user.
 *
 * @param userId The user identifier to follow.
 * @returns The follow operation result.
 * @requiresAuthentication true
 */
export const followUser = async (userId: string | number) => {
  // TODO: Backend endpoint pending for follow actions.
  return apiFetch(`/accounts/users/${userId}/follow/`, { method: "POST" });
};

/**
 * Unfollows a user.
 *
 * @param userId The user identifier to unfollow.
 * @returns The unfollow operation result.
 * @requiresAuthentication true
 */
export const unfollowUser = async (userId: string | number) => {
  // TODO: Backend endpoint pending for follow actions.
  return apiFetch(`/accounts/users/${userId}/unfollow/`, { method: "POST" });
};

/**
 * Fetches the followers of a user.
 *
 * @param userId The user identifier.
 * @returns A list of follower profiles.
 * @requiresAuthentication false
 */
export const getFollowers = async (userId: string | number) => {
  // TODO: Backend endpoint pending for follower listing.
  return apiFetch(`/accounts/users/${userId}/followers/`);
};

/**
 * Fetches the users that a user is following.
 *
 * @param userId The user identifier.
 * @returns A list of followed profiles.
 * @requiresAuthentication false
 */
export const getFollowing = async (userId: string | number) => {
  // TODO: Backend endpoint pending for following listing.
  return apiFetch(`/accounts/users/${userId}/following/`);
};
