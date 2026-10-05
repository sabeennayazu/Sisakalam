import { apiFetch } from "./client";

const announceUnreadCountChange = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("sisakalam:notifications-updated"));
  }
};

export interface NotificationItem {
  id: number;
  type: string;
  message: string;
  is_read: boolean;
  created_at: string;
  actor: { id: number; username: string; avatar: string | null } | null;
  target_type: string | null;
  target_id: number | null;
  target_title: string | null;
  target_url: string | null;
  target_image: string | null;
}

export interface NotificationPage {
  count: number;
  next: string | null;
  previous: string | null;
  results: NotificationItem[];
}

/**
 * Fetches the authenticated user's notifications.
 *
 * @returns A list of notifications.
 * @requiresAuthentication true
 */
export const getNotifications = async (page = 1) => {
  return apiFetch<NotificationPage>("/notifications/", { query: { page } });
};

export const getRecentNotifications = async () => {
  return apiFetch<NotificationItem[]>("/notifications/recent/");
};

/**
 * Fetches unread notifications for the authenticated user.
 *
 * @returns A list of unread notifications.
 * @requiresAuthentication true
 */
export const getUnreadNotifications = async () => {
  return apiFetch<NotificationPage>("/notifications/", { query: { unread: 1 } });
};

/**
 * Fetches the unread notification count for the authenticated user.
 *
 * @returns The unread notification count payload.
 * @requiresAuthentication true
 */
export const getUnreadCount = async () => {
  return apiFetch<{ unread_count: number }>("/notifications/unread-count/");
};

/**
 * Marks a notification as read.
 *
 * @param notificationId The notification identifier.
 * @returns A success response from the backend.
 * @requiresAuthentication true
 */
export const markNotificationRead = async (notificationId: string | number) => {
  const response = await apiFetch(`/notifications/${notificationId}/read/`, { method: "POST" });
  announceUnreadCountChange();
  return response;
};

/**
 * Marks all notifications as read for the authenticated user.
 *
 * @returns A success response from the backend.
 * @requiresAuthentication true
 */
export const markAllNotificationsRead = async () => {
  const response = await apiFetch("/notifications/mark-all-read/", { method: "POST" });
  announceUnreadCountChange();
  return response;
};

/**
 * Deletes a notification.
 *
 * @param notificationId The notification identifier.
 * @returns An empty response on success.
 * @requiresAuthentication true
 */
export const deleteNotification = async (notificationId: string | number) => {
  const response = await apiFetch(`/notifications/${notificationId}/`, { method: "DELETE" });
  announceUnreadCountChange();
  return response;
};

/**
 * Clears all notifications for the authenticated user.
 *
 * @returns A success response from the backend.
 * @requiresAuthentication true
 */
export const clearNotifications = async () => {
  const response = await apiFetch("/notifications/clear/", { method: "POST" });
  announceUnreadCountChange();
  return response;
};

/**
 * Fetches the authenticated user's notification preferences.
 *
 * @returns The notification preferences payload.
 * @requiresAuthentication true
 */
export const getNotificationPreferences = async () => {
  return apiFetch<NotificationPreferences>("/notifications/preferences/");
};

export interface NotificationPreferences {
  new_followers: boolean;
  story_likes: boolean;
  poem_likes: boolean;
  story_bookmarks: boolean;
  poem_bookmarks: boolean;
  comments: boolean;
  replies: boolean;
  followed_updates: boolean;
  email_digest_frequency: "instant" | "daily" | "weekly" | "disabled";
}

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