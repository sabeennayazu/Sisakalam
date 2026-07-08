import { apiFetch } from "./client";

/**
 * Likes a story for the authenticated user.
 *
 * @param storyId The story identifier.
 * @returns The like response from the backend.
 * @requiresAuthentication true
 */
export const likeStory = async (storyId: string | number) => {
  return apiFetch(`/interactions/stories/${storyId}/like/`, { method: "POST" });
};

/**
 * Removes a like from a story for the authenticated user.
 *
 * @param storyId The story identifier.
 * @returns The unlike response from the backend.
 * @requiresAuthentication true
 */
export const unlikeStory = async (storyId: string | number) => {
  return apiFetch(`/interactions/stories/${storyId}/unlike/`, { method: "POST" });
};

/**
 * Likes a poem for the authenticated user.
 *
 * @param poemId The poem identifier.
 * @returns The like response from the backend.
 * @requiresAuthentication true
 */
export const likePoem = async (poemId: string | number) => {
  // TODO: Backend endpoint pending for poem likes.
  return apiFetch(`/interactions/poems/${poemId}/like/`, { method: "POST" });
};

/**
 * Removes a like from a poem for the authenticated user.
 *
 * @param poemId The poem identifier.
 * @returns The unlike response from the backend.
 * @requiresAuthentication true
 */
export const unlikePoem = async (poemId: string | number) => {
  // TODO: Backend endpoint pending for poem likes.
  return apiFetch(`/interactions/poems/${poemId}/unlike/`, { method: "POST" });
};

/**
 * Saves a story to the authenticated user's bookmarks.
 *
 * @param storyId The story identifier.
 * @returns The bookmark response from the backend.
 * @requiresAuthentication true
 */
export const bookmarkStory = async (storyId: string | number) => {
  return apiFetch(`/interactions/stories/${storyId}/bookmark/`, { method: "POST" });
};

/**
 * Removes a story bookmark for the authenticated user.
 *
 * @param storyId The story identifier.
 * @returns The unbookmark response from the backend.
 * @requiresAuthentication true
 */
export const removeStoryBookmark = async (storyId: string | number) => {
  return apiFetch(`/interactions/stories/${storyId}/unbookmark/`, { method: "POST" });
};

/**
 * Saves a poem to the authenticated user's bookmarks.
 *
 * @param poemId The poem identifier.
 * @returns The bookmark response from the backend.
 * @requiresAuthentication true
 */
export const bookmarkPoem = async (poemId: string | number) => {
  // TODO: Backend endpoint pending for poem bookmarks.
  return apiFetch(`/interactions/poems/${poemId}/bookmark/`, { method: "POST" });
};

/**
 * Removes a poem bookmark for the authenticated user.
 *
 * @param poemId The poem identifier.
 * @returns The unbookmark response from the backend.
 * @requiresAuthentication true
 */
export const removePoemBookmark = async (poemId: string | number) => {
  // TODO: Backend endpoint pending for poem bookmarks.
  return apiFetch(`/interactions/poems/${poemId}/unbookmark/`, { method: "POST" });
};

/**
 * Fetches the authenticated user's bookmarked stories and poems.
 *
 * @returns The list of bookmarks.
 * @requiresAuthentication true
 */
export const getBookmarks = async () => {
  // TODO: Backend endpoint pending for aggregated bookmarks.
  return apiFetch("/interactions/bookmarks/");
};

/**
 * Creates a comment on a story or poem.
 *
 * @param payload The comment payload containing the target and body.
 * @returns The created comment record.
 * @requiresAuthentication true
 */
export const createComment = async (payload: Record<string, unknown>) => {
  // TODO: Backend endpoint pending for comment creation.
  return apiFetch("/interactions/comments/", { method: "POST", body: payload });
};

/**
 * Updates an existing comment.
 *
 * @param commentId The comment identifier.
 * @param payload The updated comment body.
 * @returns The updated comment record.
 * @requiresAuthentication true
 */
export const updateComment = async (commentId: string | number, payload: Record<string, unknown>) => {
  // TODO: Backend endpoint pending for comment updates.
  return apiFetch(`/interactions/comments/${commentId}/`, { method: "PATCH", body: payload });
};

/**
 * Deletes a comment.
 *
 * @param commentId The comment identifier.
 * @returns An empty response on success.
 * @requiresAuthentication true
 */
export const deleteComment = async (commentId: string | number) => {
  // TODO: Backend endpoint pending for comment deletion.
  return apiFetch(`/interactions/comments/${commentId}/`, { method: "DELETE" });
};

/**
 * Fetches comments for a story or poem.
 *
 * @param targetType The target type, typically story or poem.
 * @param targetId The target identifier.
 * @returns A list of comments.
 * @requiresAuthentication false
 */
export const getComments = async (targetType: string, targetId: string | number) => {
  // TODO: Backend endpoint pending for comment listing.
  return apiFetch("/interactions/comments/", { query: { target_type: targetType, target_id: targetId } });
};

/**
 * Replies to an existing comment.
 *
 * @param commentId The parent comment identifier.
 * @param payload The reply body.
 * @returns The created reply comment record.
 * @requiresAuthentication true
 */
export const replyToComment = async (commentId: string | number, payload: Record<string, unknown>) => {
  // TODO: Backend endpoint pending for comment replies.
  return apiFetch(`/interactions/comments/${commentId}/reply/`, { method: "POST", body: payload });
};

/**
 * Likes a comment.
 *
 * @param commentId The comment identifier.
 * @returns The like response from the backend.
 * @requiresAuthentication true
 */
export const likeComment = async (commentId: string | number) => {
  // TODO: Backend endpoint pending for comment likes.
  return apiFetch(`/interactions/comments/${commentId}/like/`, { method: "POST" });
};

/**
 * Removes a like from a comment.
 *
 * @param commentId The comment identifier.
 * @returns The unlike response from the backend.
 * @requiresAuthentication true
 */
export const unlikeComment = async (commentId: string | number) => {
  // TODO: Backend endpoint pending for comment likes.
  return apiFetch(`/interactions/comments/${commentId}/unlike/`, { method: "POST" });
};

/**
 * Reports a comment for moderation.
 *
 * @param commentId The comment identifier.
 * @param reason The report reason.
 * @returns The moderation response from the backend.
 * @requiresAuthentication true
 */
export const reportComment = async (commentId: string | number, reason: string) => {
  // TODO: Backend endpoint pending for comment reports.
  return apiFetch(`/interactions/comments/${commentId}/report/`, { method: "POST", body: { reason } });
};