export interface Comment {
  id: string;
  chapter_id: string;
  user: string;
  avatar: string;
  comment: string;
  created_at: string;
  likes: number;
}

export const comments: Comment[] = [
  // Chapter 1 - Story 5
  {
    id: "c1",
    chapter_id: "ch1",
    user: "Reader123",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    comment:
      "Amazing start to the story! The worldbuilding is incredible. I can't wait to learn more about what's happening to the sun.",
    created_at: "2024-01-02",
    likes: 45,
  },
  {
    id: "c2",
    chapter_id: "ch1",
    user: "FantasyLover",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    comment:
      "This is exactly the kind of epic narrative I've been looking for. The pacing is perfect.",
    created_at: "2024-01-02",
    likes: 38,
  },
  {
    id: "c3",
    chapter_id: "ch1",
    user: "StoryStalker",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    comment: "The atmosphere is breathtaking. I felt like I was there experiencing the world's transformation.",
    created_at: "2024-01-03",
    likes: 52,
  },

  // Chapter 2 - Story 5
  {
    id: "c4",
    chapter_id: "ch2",
    user: "LyraStanClub",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
    comment: "Lyra is such a compelling protagonist! I love her intelligence and resourcefulness.",
    created_at: "2024-01-03",
    likes: 67,
  },
  {
    id: "c5",
    chapter_id: "ch2",
    user: "MysteryHunter",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    comment: "The marketplace scene was so vivid. I could smell the spices and hear the merchants calling out.",
    created_at: "2024-01-03",
    likes: 41,
  },

  // Chapter 3 - Story 5
  {
    id: "c6",
    chapter_id: "ch3",
    user: "ScholarSeeker",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    comment: "The Scholar is mysterious and intriguing! This is where the story gets really interesting.",
    created_at: "2024-01-04",
    likes: 55,
  },
  {
    id: "c7",
    chapter_id: "ch3",
    user: "ArtifactAddict",
    avatar: "https://images.unsplash.com/photo-1517849845537-1d51a20414de?w=150&h=150&fit=crop",
    comment:
      "The underground chamber description was absolutely epic! Ancient artifacts and secrets galore!",
    created_at: "2024-01-04",
    likes: 73,
  },

  // Chapter 4 - Story 5
  {
    id: "c8",
    chapter_id: "ch4",
    user: "WorldBuilder",
    avatar: "https://images.unsplash.com/photo-1506268039623-140550078848?w=150&h=150&fit=crop",
    comment:
      "This is brilliant worldbuilding! The concept of a dying sun and its cycle is fascinating.",
    created_at: "2024-01-05",
    likes: 89,
  },
  {
    id: "c9",
    chapter_id: "ch4",
    user: "MagicalMinds",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    comment:
      "Lyra being chosen feels earned and natural. Not contrived at all. Excellent narrative technique!",
    created_at: "2024-01-05",
    likes: 61,
  },

  // Chapter 1 - Story 7
  {
    id: "c10",
    chapter_id: "s7ch1",
    user: "AstronomyNerd",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    comment:
      "As someone who studies astronomy, I find this premise absolutely captivating! A falling star? Brilliant concept!",
    created_at: "2024-01-03",
    likes: 78,
  },
  {
    id: "c11",
    chapter_id: "s7ch1",
    user: "CosmicFan",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    comment:
      "The mystery of the robed figures is intriguing. Who are they? What do they want? Can't wait to find out!",
    created_at: "2024-01-03",
    likes: 54,
  },

  // Chapter 2 - Story 7
  {
    id: "c12",
    chapter_id: "s7ch2",
    user: "MountainClimber",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    comment: "The mountain climbing sequence was thrilling! Elena is a badass character.",
    created_at: "2024-01-04",
    likes: 66,
  },
  {
    id: "c13",
    chapter_id: "s7ch2",
    user: "SciFiFanatic",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&h=150&fit=crop",
    comment:
      "The artifact's design description is so cool! It feels both alien and familiar at the same time.",
    created_at: "2024-01-04",
    likes: 45,
  },

  // Chapter 3 - Story 7
  {
    id: "c14",
    chapter_id: "s7ch3",
    user: "PlotTwistHunter",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop",
    comment:
      "WHAT WHAT WHAT?? Ancient civilizations? Cycles of destruction? This just became SO MUCH MORE than I expected!",
    created_at: "2024-01-05",
    likes: 92,
  },
  {
    id: "c15",
    chapter_id: "s7ch3",
    user: "TimeyCyclical",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    comment:
      "The connection between Lyra and Marcus's stories intrigues me. Are they happening at the same time? Will they meet?",
    created_at: "2024-01-05",
    likes: 71,
  },
];
