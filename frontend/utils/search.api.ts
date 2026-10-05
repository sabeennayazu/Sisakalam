import { apiFetch } from "./client";

export interface SearchContentResult {
  id: number;
  type: "story" | "poem";
  title: string;
  author: string;
  author_id: number;
  author_profile_picture: string | null;
  genre: string;
  image: string | null;
  description: string;
  views: number;
  likes: number;
  comments: number;
  is_mature: boolean;
  tags: string[];
  created_at: string;
}

export interface SearchUserResult {
  id: number;
  username: string;
  profile_picture: string | null;
}

export interface SearchResponse {
  query: string;
  stories: SearchContentResult[];
  poems: SearchContentResult[];
  users: SearchUserResult[];
  total: number;
  counts: { stories: number; poems: number; users: number };
  page: number;
  limit: number;
  has_more: { stories: boolean; poems: boolean; users: boolean };
}

export const searchContent = async (
  query: string,
  options: { page?: number; limit?: number; signal?: AbortSignal } = {},
) => {
  const normalizedQuery = query.trim();
  if (!normalizedQuery) {
    return {
      query: "",
      stories: [],
      poems: [],
      users: [],
      total: 0,
      counts: { stories: 0, poems: 0, users: 0 },
      page: 1,
      limit: options.limit ?? 3,
      has_more: { stories: false, poems: false, users: false },
    } satisfies SearchResponse;
  }

  return apiFetch<SearchResponse>("/search/", {
    query: {
      q: normalizedQuery,
      page: options.page ?? 1,
      limit: options.limit ?? 3,
    },
    signal: options.signal,
  });
};