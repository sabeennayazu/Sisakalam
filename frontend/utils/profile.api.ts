import { API_BASE_URL } from "./api";
import { getBookmarks, getLikedContent } from "./interactions.api";
import { getPoems } from "./poems.api";
import { getStories } from "./stories.api";
import { deletePoem, updatePoem } from "./poems.api";
import { deleteStory, updateStory } from "./stories.api";

export type ProfileContentType = "poem" | "story";

export interface ProfileContent {
  id: number;
  authorId?: number;
  authorImage: string;
  chapterSlug?: string | null;
  type: ProfileContentType;
  title: string;
  author: string;
  genre: string;
  image: string;
  views: number;
  likes: number;
  comments: number;
  isLiked: boolean;
  isBookmarked: boolean;
  isMature: boolean;
  isPrivate: boolean;
}

interface CollectionResponse<T> {
  results: T[];
}

interface ContentRecord {
  id: number;
  author: number;
  first_chapter_slug?: string | null;
  title: string;
  author_name: string | null;
  author_profile_picture: string | null;
  author_id?: number;
  genre_name: string | null;
  image: string | null;
  views: number;
  likes: number;
  comments_count: number;
  is_liked: boolean;
  is_bookmarked: boolean;
  is_mature: boolean;
  is_private?: boolean;
}

interface InteractionContentRecord {
  content_id: number;
  content_type: ProfileContentType;
  author_id?: number;
  chapter_slug?: string | null;
  title: string;
  author_name: string | null;
  author_profile_picture?: string | null;
  genre_name: string | null;
  image: string | null;
  views: number;
  likes: number;
  comments_count: number;
  is_liked: boolean;
  is_bookmarked: boolean;
  is_mature: boolean;
  is_private?: boolean;
}

const asCollection = <T>(response: T[] | CollectionResponse<T>): T[] => {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response.results)) {
    return response.results;
  }

  throw new Error("The server returned an invalid content collection.");
};

const absoluteImageUrl = (image: string | null): string => {
  if (!image) {
    return "";
  }

  return image.startsWith("http") ? image : `${API_BASE_URL}${image.startsWith("/") ? image : `/${image}`}`;
};

const mapContent = (item: ContentRecord, type: ProfileContentType): ProfileContent => ({
  id: item.id,
  authorId: item.author,
  chapterSlug: item.first_chapter_slug,
  type,
  title: item.title,
  author: item.author_name ?? "Unknown author",
  authorImage: absoluteImageUrl(item.author_profile_picture),
  genre: item.genre_name ?? "",
  image: absoluteImageUrl(item.image),
  views: item.views,
  likes: item.likes,
  comments: item.comments_count,
  isLiked: item.is_liked,
  isBookmarked: item.is_bookmarked,
  isMature: item.is_mature,
  isPrivate: item.is_private ?? false,
});

const mapInteractionContent = (item: InteractionContentRecord): ProfileContent => ({
  id: item.content_id,
  authorId: item.author_id,
  chapterSlug: item.chapter_slug,
  type: item.content_type,
  title: item.title,
  author: item.author_name ?? "Unknown author",
  authorImage: absoluteImageUrl(item.author_profile_picture ?? null),
  genre: item.genre_name ?? "",
  image: absoluteImageUrl(item.image),
  views: item.views,
  likes: item.likes,
  comments: item.comments_count,
  isLiked: item.is_liked,
  isBookmarked: item.is_bookmarked,
  isMature: item.is_mature,
  isPrivate: item.is_private ?? false,
});

export const getMyPoems = async (): Promise<ProfileContent[]> => {
  const response = await getPoems<ContentRecord[]>({ mine: 1 });
  return asCollection(response).map((item) => mapContent(item, "poem"));
};

export const getMyStories = async (): Promise<ProfileContent[]> => {
  const response = await getStories<ContentRecord[]>({ mine: 1 });
  return asCollection(response).map((item) => mapContent(item, "story"));
};

export const getUserPoems = async (userId: string | number): Promise<ProfileContent[]> => {
  const response = await getPoems<ContentRecord[]>({ author: userId });
  return asCollection(response).map((item) => mapContent(item, "poem"));
};

export const getUserStories = async (userId: string | number): Promise<ProfileContent[]> => {
  const response = await getStories<ContentRecord[]>({ author: userId });
  return asCollection(response).map((item) => mapContent(item, "story"));
};

export const getBookmarkedProfileContent = async (): Promise<ProfileContent[]> => {
  const response = await getBookmarks();
  return asCollection(response as InteractionContentRecord[]).map(mapInteractionContent);
};

export const getLikedProfileContent = async (): Promise<ProfileContent[]> => {
  const response = await getLikedContent();
  return asCollection(response as InteractionContentRecord[]).map(mapInteractionContent);
};

export const deleteProfileContent = async (item: ProfileContent) => {
  if (item.type === "poem") await deletePoem(item.id);
  else await deleteStory(item.id);
};

export const toggleProfileContentPrivacy = async (item: ProfileContent) => {
  const payload = { is_private: !item.isPrivate };
  if (item.type === "poem") await updatePoem(item.id, payload);
  else await updateStory(item.id, payload);
};
