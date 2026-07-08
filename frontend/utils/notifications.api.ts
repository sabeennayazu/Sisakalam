import { apiFetch } from "./client";

/**
 * Fetches the authenticated user's notifications.
 *
 * @returns A list of notifications.
 * @requiresAuthentication true
 */
export const getNotifications = async () => {
  return apiFetch("/notifications/");
};

/**
 * Fetches unread notifications for the authenticated user.
 *
 * @returns A list of unread notifications.
 * @requiresAuthentication true
 */
export const getUnreadNotifications = async () => {
  return apiFetch("/notifications/", { query: { unread: 1 } });
};

/**
 * Fetches the unread notification count for the authenticated user.
 *
 * @returns The unread notification count payload.
 * @requiresAuthentication true
 */
export const getUnreadCount = async () => {
  return apiFetch("/notifications/unread-count/");
};

/**
 * Marks a notification as read.
 *
 * @param notificationId The notification identifier.
 * @returns A success response from the backend.
 * @requiresAuthentication true
 */
export const markNotificationRead = async (notificationId: string | number) => {
  return apiFetch(`/notifications/${notificationId}/read/`, { method: "POST" });
};

/**
 * Marks all notifications as read for the authenticated user.
 *
 * @returns A success response from the backend.
 * @requiresAuthentication true
 */
export const markAllNotificationsRead = async () => {
  return apiFetch("/notifications/mark-all-read/", { method: "POST" });
};

/**
 * Deletes a notification.
 *
 * @param notificationId The notification identifier.
 * @returns An empty response on success.
 * @requiresAuthentication true
 */
export const deleteNotification = async (notificationId: string | number) => {
  return apiFetch(`/notifications/${notificationId}/`, { method: "DELETE" });
};

/**
 * Clears all notifications for the authenticated user.
 *
 * @returns A success response from the backend.
 * @requiresAuthentication true
 */
export const clearNotifications = async () => {
  // TODO: Backend endpoint pending for clearing all notifications.
  return apiFetch("/notifications/clear/", { method: "POST" });
};

/**
 * Fetches the authenticated user's notification preferences.
 *
 * @returns The notification preferences payload.
 * @requiresAuthentication true
 */
export const getNotificationPreferences = async () => {
  return apiFetch("/notifications/preferences/");
};

/**
 * Updates the authenticated user's notification preferences.
 *
 * @param payload Partial notification preference values.
 * @returns A success response from the backend.
 * @requiresAuthentication true
 */
export const updateNotificationPreferences = async (payload: Record<string, unknown>) => {
  return apiFetch("/notifications/preferences/", { method: "PATCH", body: payload });
};