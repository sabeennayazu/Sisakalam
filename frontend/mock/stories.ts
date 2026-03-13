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
    id: 1,
    title: "My Fake Boyfriend",
    slug: "my-fake-boyfriend",
    author: "Sofia Lane",
    cover_image: "/images/covers/cover13.jpg",
    description:
      "When college sophomore Aria Blake needs a fake relationship to get her ex off her back, she strikes a deal with the most annoyingly attractive man on campus — Ethan Cole. What starts as a perfectly choreographed lie quickly spirals into something neither of them planned for.",
    genre: "Romance",
    tags: ["romance", "college", "fake dating", "friends to lovers", "comedy"],
    total_chapters: 3,
    created_at: "2025-09-10",
    views: 87400,
    likes: 14200,
    bookmarks: 5100,
  },
  {
    id: 3,
    title: "Torment",
    slug: "torment",
    author: "Marcus Vale",
    cover_image: "/images/covers/cover3.jpg",
    description:
      "Decades after a brutal civil war, the land of Varek is scarred and silent. Former soldier Kira Ashveil returns to the village she once burned to the ground — haunted by the faces she cannot forget. A gripping dark fantasy that asks if redemption is ever truly possible.",
    genre: "Dark Fantasy",
    tags: ["dark fantasy", "redemption", "war", "guilt", "revenge"],
    total_chapters: 3,
    created_at: "2025-11-02",
    views: 62300,
    likes: 9800,
    bookmarks: 3400,
  },
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
