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
