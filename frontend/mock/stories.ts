export interface Story {
  id: number;
  title: string;
  slug: string;
  author: string;
  cover_image: string;
  description: string;
  genre: string;
  tags: string[];
  total_chapters: number;
  created_at: string;
  views: number;
  likes: number;
  bookmarks: number;
}

export const stories: Story[] = [
  {
    id: 5,
    title: "The Beginning of the End",
    slug: "the-beginning-of-the-end",
    author: "Sabeen",
    cover_image: "/images/covers/cover1.jpg",
    description:
      "A young warrior discovers the truth behind a collapsing world. When the sun begins to fade and darkness consumes the realm, one hero must rise to prevent the apocalypse.",
    genre: "Fantasy",
    tags: ["magic", "adventure", "kingdom", "mystery"],
    total_chapters: 8,
    created_at: "2024-01-01",
    views: 156000,
    likes: 12450,
    bookmarks: 3200,
  },
  {
    id: 7,
    title: "Chronicles of the Fallen Star",
    slug: "chronicles-of-the-fallen-star",
    author: "Sabeen",
    cover_image: "/images/covers/cover2.jpg",
    description:
      "When a mysterious star falls from the sky onto the world's highest peak, it unleashes ancient powers. A group of unlikely heroes must journey across treacherous lands to uncover the secrets of the fallen celestial body before darkness takes over the realm.",
    genre: "Adventure",
    tags: ["destiny", "mystery", "celestial", "journey"],
    total_chapters: 10,
    created_at: "2024-01-02",
    views: 234500,
    likes: 18900,
    bookmarks: 5100,
  },
  {
    id: 9,
    title: "Echoes of the Lost Kingdom",
    slug: "echoes-of-the-lost-kingdom",
    author: "Maya Winters",
    cover_image: "/images/covers/cover3.jpg",
    description:
      "In a world where magic has been forgotten for centuries, a young archaeologist discovers ancient ruins that reveal the truth about a powerful civilization. As she uncovers artifacts of immense power, dark forces emerge from the shadows seeking the same treasures.",
    genre: "Fantasy",
    tags: ["ancient", "magic", "archaeology", "power"],
    total_chapters: 9,
    created_at: "2024-01-15",
    views: 189200,
    likes: 15600,
    bookmarks: 4300,
  },
];
