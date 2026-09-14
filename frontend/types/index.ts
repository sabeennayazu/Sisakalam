export interface Author {
  id: string;
  name: string;
  profile_image: string;
}

export interface Chapter {
  chapter_id: string;
  chapter_title: string;
  chapter_number: number;
  content: string;
  created_at: string;
}

export interface Story {
  id: string;
  title: string;
  image: string;
  author: Author;
  genre: string;
  tags: string[];
  synopsis: string;
  likes: number;
  comments: number;
  views: number;
  bookmarks: number;
  created_at: string;
  updated_at: string;
  chapters: Chapter[];
}

export interface ContentApiRecord {
  id: number;
  title: string;
  author: number;
  author_name: string | null;
  genre: number | null;
  genre_name: string | null;
  image: string | null;
  is_mature: boolean;
  status: "draft" | "published" | string;
  published_at: string | null;
  views: number;
  likes: number;
  comments_count: number;
  favorites_count: number;
  created_at: string;
  updated_at: string;
  tag_names: string[];
}

export interface StoryApiRecord extends ContentApiRecord {
  synopsis: string;
  chapter_count: number;
}

export interface PoemApiRecord extends ContentApiRecord {
  content: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface ChapterApiRecord {
  id: number;
  story: number;
  title: string;
  slug: string;
  chapter_number: number;
  content: string;
  order: number;
  created_at: string;
  updated_at: string;
}
