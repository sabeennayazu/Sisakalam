# COMPLETE CODE REFERENCE - UniversalCard Refactoring

## File: `components/shared/UniversalCard.tsx` (NEW) ✅

```tsx
import { Eye, Heart, MessageCircle } from "lucide-react";
import LikeButton from "@/components/interactions/LikeButton";
import BookmarkButton from "@/components/interactions/BookmarkButton";

export type ContentType = "story" | "poem" | "essay" | "journal" | string;

export interface UniversalCardProps {
    id: number;
    title: string;
    author: string;
    genre: string;
    image: string;
    views: string | number;
    likes: number;
    comments: string | number;
    
    // Optional content type indicator
    type?: ContentType;
    
    // Selection mode (used in profile tabs for bulk operations)
    selectionMode?: boolean;
    isSelected?: boolean;
    onToggleSelect?: (id: number) => void;
    
    // UI options
    showBookmark?: boolean;
    
    // Flexible props for future use
    description?: string;
    tags?: string[];
    href?: string;
    onClick?: () => void;
    children?: React.ReactNode;
}

export default function UniversalCard({
    id,
    title,
    author,
    genre,
    image,
    views,
    likes,
    comments,
    type,
    selectionMode = false,
    isSelected = false,
    onToggleSelect,
    showBookmark = true,
    description,
    tags,
    onClick,
    children,
}: UniversalCardProps) {
    // Convert numeric values to strings if needed
    const formattedViews = typeof views === "number" ? views.toString() : views || "0";
    const formattedComments = typeof comments === "number" ? comments.toString() : comments || "0";

    return (
        <div
            className="min-w-[150px] md:min-w-[180px] lg:min-w-[200px] group cursor-pointer relative"
            onClick={onClick}
        >
            {/* Selection Checkbox */}
            {selectionMode && onToggleSelect && (
                <div className="absolute top-2 left-2 z-20">
                    <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(id)}
                        className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer shadow-sm"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}

            {/* Cover Image Container */}
            <div
                className={`relative overflow-hidden rounded-lg md:rounded-xl mb-2 md:mb-3 shrink-0 h-48 md:h-56 lg:h-72 ${
                    selectionMode && isSelected ? "ring-2 ring-black" : ""
                }`}
            >
                <img
                    src={image || "https://images.unsplash.com/photo-1507842217343-583f20270319?w=500&h=700&fit=crop"}
                    alt={title || "Content cover"}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                            "https://images.unsplash.com/photo-1507842217343-583f20270319?w=500&h=700&fit=crop";
                    }}
                />

                {/* Bookmark Button - Top Right */}
                {showBookmark && !selectionMode && (
                    <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-black/20 rounded-full p-1.5 md:p-2 shadow-md hover:shadow-lg transition">
                        <BookmarkButton storyId={id} />
                    </div>
                )}
            </div>

            {/* Genre Badge & Optional Type */}
            <div className="flex items-center gap-2 mb-1">
                {genre && (
                    <span className="text-[10px] md:text-xs px-2 md:px-3 py-0.5 md:py-1 bg-gray-100 rounded-full text-gray-700 truncate">
                        {genre}
                    </span>
                )}
                {type && (
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider whitespace-nowrap">
                        {type}
                    </span>
                )}
            </div>

            {/* Title */}
            <h3 className="font-semibold text-sm md:text-base text-black group-hover:text-black line-clamp-2 leading-snug mb-0.5">
                {title || "Untitled"}
            </h3>

            {/* Author */}
            <p className="text-xs md:text-sm text-gray-500 line-clamp-1 mb-2">
                {author || "Unknown Author"}
            </p>

            {/* Optional Description */}
            {description && (
                <p className="text-xs md:text-sm text-gray-600 line-clamp-2 mb-2">
                    {description}
                </p>
            )}

            {/* Optional Tags */}
            {tags && tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                    {tags.slice(0, 2).map((tag, idx) => (
                        <span
                            key={idx}
                            className="text-[8px] md:text-[9px] px-2 py-0.5 bg-gray-50 text-gray-600 rounded-full truncate"
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Stats (Views, Likes, Comments) */}
            <div className="flex items-center justify-between text-xs text-gray-500 mt-2">
                <div className="flex items-center gap-1">
                    <Eye size={14} />
                    <span className="truncate">{formattedViews}</span>
                </div>
                <div className="flex items-center gap-3">
                    <LikeButton storyId={id} initialLikes={likes} />
                    <div className="flex items-center gap-1 hover:text-black transition-colors">
                        <MessageCircle size={14} />
                        <span className="truncate">{formattedComments}</span>
                    </div>
                </div>
            </div>

            {/* Additional Children (for custom content) */}
            {children && <div className="mt-2">{children}</div>}
        </div>
    );
}
```

---

## File: `components/Profile/PoemsTab.tsx` (UPDATED) ✅

```tsx
"use client";

import UniversalCard from "@/components/shared/UniversalCard";

const poems = [
    { id: 1, title: "Echoes of Silence", author: "Clara M. Thorne", genre: "Romanticism", views: "45M", likes: 1200, comments: "1.2K", time: "2 days ago", image: "/images/covers/cover1.jpg" },
    { id: 2, title: "Wilder Whispers", author: "Arlo Finch", genre: "Nature", views: "12M", likes: 1200, comments: "1.2K", time: "1 week ago", image: "/images/covers/cover2.jpg" },
    { id: 3, title: "The Unseen Thread", author: "S. J. Sterling", genre: "Free Verse", views: "8.4M", likes: 1200, comments: "1.2K", time: "3 weeks ago", image: "/images/covers/cover3.jpg" },
    { id: 4, title: "Ode to the Summit", author: "Gregory Vance", genre: "Epic", views: "2.1M", likes: 1200, comments: "1.2K", time: "1 month ago", image: "/images/covers/cover4.jpg" },
    { id: 5, title: "Melodies of May", author: "Elena Rousseau", genre: "Lyric", views: "33M", likes: 1200, comments: "1.2K", time: "2 months ago", image: "/images/covers/cover5.jpg" },
    { id: 6, title: "Concrete Pulse", author: "Leo Castelar", genre: "Modern", views: "6.3M", likes: 1200, comments: "1.2K", time: "3 months ago", image: "/images/covers/cover6.jpg" },
];

export default function PoemsTab() {
    return (
        <div>
            <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
                <h2 className="font-serif font-bold text-xl text-black">All Poems</h2>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{poems.length} Works</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {poems.map((poem) => (
                    <UniversalCard 
                        key={poem.id}
                        id={poem.id}
                        title={poem.title}
                        author={poem.author}
                        genre={poem.genre}
                        image={poem.image}
                        views={poem.views}
                        likes={poem.likes}
                        comments={poem.comments}
                    />
                ))}
            </div>
        </div>
    );
}
```

---

## File: `components/Profile/StoriesTab.tsx` (UPDATED) ✅

```tsx
"use client";

import UniversalCard from "@/components/shared/UniversalCard";

const stories = [
    { id: 1, title: "The Last Librarian", author: "Marcus Thorne", genre: "Sci-Fi", views: "15M", likes: 2100, comments: "1.2K", time: "1 month ago", image: "/images/covers/cover7.jpg" },
    { id: 2, title: "Midnight Express", author: "Vance", genre: "Mystery", views: "8.2M", likes: 1540, comments: "890", time: "2 months ago", image: "/images/covers/cover8.jpg" },
    { id: 3, title: "Echoes of the Forgotten", author: "Elara", genre: "Fantasy", views: "22M", likes: 3200, comments: "2.1K", time: "4 months ago", image: "/images/covers/cover1.jpg" },
    { id: 4, title: "Coffee and Rain", author: "Aries", genre: "Romance", views: "12M", likes: 1100, comments: "450", time: "6 months ago", image: "/images/covers/cover2.jpg" },
];

export default function StoriesTab() {
    return (
        <div>
            <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
                <h2 className="font-serif font-bold text-xl text-black">All Stories</h2>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{stories.length} Works</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {stories.map((story) => (
                    <UniversalCard 
                        key={story.id}
                        id={story.id}
                        title={story.title}
                        author={story.author}
                        genre={story.genre}
                        image={story.image}
                        views={story.views}
                        likes={story.likes}
                        comments={story.comments}
                    />
                ))}
            </div>
        </div>
    );
}
```

---

## File: `components/Profile/SavedTab.tsx` (UPDATED) ✅

```tsx
"use client";

import UniversalCard from "@/components/shared/UniversalCard";

const savedItems = [
    { id: 1, title: "The Art of Doing Nothing", author: "William Reyes", type: "essay", genre: "Lifestyle", views: "1.2M", likes: 800, comments: "200", time: "Saved 2 days ago", image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 2, title: "Ode to the Concrete Jungle", author: "Sylvia Vance", type: "poem", genre: "Modern", views: "4.5M", likes: 1100, comments: "450", time: "Saved 1 week ago", image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 3, title: "The Last Train to Paris", author: "Julian Valerius", type: "story", genre: "Historical", views: "8.1M", likes: 2300, comments: "1.1K", time: "Saved 2 weeks ago", image: "https://images.unsplash.com/photo-1512411516279-d102eacb1380?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 4, title: "Wanderlust Excerpts", author: "Clara Thorne", type: "journal", genre: "Travel", views: "500K", likes: 450, comments: "89", time: "Saved 1 month ago", image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 5, title: "The Art of Doing Nothing", author: "William Reyes", type: "essay", genre: "Lifestyle", views: "1.2M", likes: 800, comments: "200", time: "Saved 2 days ago", image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 6, title: "Ode to the Concrete Jungle", author: "Sylvia Vance", type: "poem", genre: "Modern", views: "4.5M", likes: 1100, comments: "450", time: "Saved 1 week ago", image: "https://images.unsplash.com/photo-1449844908441-8829872d2607?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 7, title: "The Last Train to Paris", author: "Julian Valerius", type: "story", genre: "Historical", views: "8.1M", likes: 2300, comments: "1.1K", time: "Saved 2 weeks ago", image: "https://images.unsplash.com/photo-1512411516279-d102eacb1380?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
    { id: 8, title: "Wanderlust Excerpts", author: "Clara Thorne", type: "journal", genre: "Travel", views: "500K", likes: 450, comments: "89", time: "Saved 1 month ago", image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" },
];

export default function SavedTab() {
    return (
        <div>
            <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
                <h2 className="font-serif font-bold text-xl text-black">Reading List</h2>
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{savedItems.length} Items</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {savedItems.map((item) => (
                    <UniversalCard
                        key={item.id}
                        id={item.id}
                        title={item.title}
                        author={item.author}
                        genre={item.genre}
                        image={item.image}
                        views={item.views}
                        likes={item.likes}
                        comments={item.comments}
                        type={item.type}
                        showBookmark={true}
                    />
                ))}
            </div>
        </div>
    );
}
```

---

## File: `components/Profile/LikedTab.tsx` (UPDATED) ✅

```tsx
"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import UniversalCard from "@/components/shared/UniversalCard";

type ItemType = "story" | "poem";

interface LikedItem {
  id: number;
  title: string;
  author: string;
  genre: string;
  views: string;
  likes: number;
  comments: string;
  image: string;
  type: ItemType;
  date: string;
}

export default function LikedTab() {
  const [sort, setSort] = useState("newest");
  const [filter, setFilter] = useState<"all" | ItemType>("all");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);

  const items: LikedItem[] = [
    { id: 1, title: "Echoes of Silence", author: "Clara Thorne", genre: "Romanticism", views: "45M", likes: 1200, comments: "1.2K", image: "/images/covers/cover1.jpg", type: "poem", date: "2025-02-01" },
    { id: 2, title: "Hidden Path", author: "Arlo Finch", genre: "Mystery", views: "1.1M", likes: 800, comments: "400", image: "/images/covers/cover2.jpg", type: "story", date: "2025-01-12" },
    { id: 3, title: "Melodies of May", author: "Elena Rousseau", genre: "Lyric", views: "33M", likes: 3000, comments: "2.1K", image: "/images/covers/cover5.jpg", type: "poem", date: "2024-12-21" },
    { id: 4, title: "The Burning Road", author: "Rhea Novak", genre: "Action", views: "17.7M", likes: 1400, comments: "890", image: "/images/covers/cover3.jpg", type: "story", date: "2024-11-08" }
  ];

  const filtered = items
    .filter((i) => filter === "all" || i.type === filter)
    .sort((a, b) =>
      sort === "newest"
        ? new Date(b.date).getTime() - new Date(a.date).getTime()
        : new Date(a.date).getTime() - new Date(b.date).getTime()
    );

  const toggleSelect = (id: number) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const selectAll = () => {
    setSelected(filtered.map((i) => i.id));
  };

  const clearSelection = () => {
    setSelected([]);
    setSelectionMode(false);
  };

  const deleteSelected = () => {
    console.log("Deleting", selected);
    clearSelection();
  };

  return (
    <div className="space-y-8 py-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border text-sm text-black px-3 py-2 rounded-md"
          >
            <option value="newest">Newest → Oldest</option>
            <option value="oldest">Oldest → Newest</option>
          </select>

          {/* Type Filter */}
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="border text-sm text-black px-3 py-2 rounded-md"
          >
            <option value="all">All Content</option>
            <option value="story">Stories</option>
            <option value="poem">Poems</option>
          </select>
        </div>

        {/* Selection Controls */}
        <div className="flex items-center gap-3">
          {!selectionMode && (
            <button
              onClick={() => setSelectionMode(true)}
              className="text-sm text-black border px-4 py-2 rounded-md hover:bg-gray-50"
            >
              Select
            </button>
          )}

          {selectionMode && (
            <>
              <button
                onClick={selectAll}
                className="text-sm text-black border px-4 py-2 rounded-md"
              >
                Select All
              </button>

              {selected.length > 0 && (
                <button
                  onClick={deleteSelected}
                  className="flex items-center gap-2 text-sm px-4 py-2 bg-black text-white rounded-md"
                >
                  <Trash2 size={16} />
                  Delete ({selected.length})
                </button>
              )}

              <button
                onClick={clearSelection}
                className="text-sm px-3 py-2 text-gray-500"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filtered.map((item) => (
          <UniversalCard
            key={item.id}
            id={item.id}
            title={item.title}
            author={item.author}
            genre={item.genre}
            image={item.image}
            views={item.views}
            likes={item.likes}
            comments={item.comments}
            type={item.type}
            selectionMode={selectionMode}
            isSelected={selected.includes(item.id)}
            onToggleSelect={toggleSelect}
            showBookmark={false}
          />
        ))}
      </div>
    </div>
  );
}
```

---

## Deleted Files

- ❌ `components/Profile/ProfileCard.tsx` - DELETED

## File Summary

| File | Status | Changes |
|------|--------|---------|
| `components/shared/UniversalCard.tsx` | ✅ NEW | Created - 180 lines |
| `components/Profile/PoemsTab.tsx` | ✅ UPDATED | Import changed to UniversalCard |
| `components/Profile/StoriesTab.tsx` | ✅ UPDATED | Import changed to UniversalCard |
| `components/Profile/SavedTab.tsx` | ✅ UPDATED | Import changed to UniversalCard |
| `components/Profile/LikedTab.tsx` | ✅ UPDATED | Import changed to UniversalCard |
| `components/Profile/ProfileCard.tsx` | ❌ DELETED | Functionality moved to UniversalCard |

---

## Key Changes Overview

### Before
```typescript
import ProfileCard from "./ProfileCard";
// Component only worked for profile context
<ProfileCard {...props} />
```

### After
```typescript
import UniversalCard from "@/components/shared/UniversalCard";
// Works for any content type and context
<UniversalCard {...props} />
```

---

## Verification Checklist

- ✅ All files compile without TypeScript errors
- ✅ All imports updated correctly
- ✅ Component props are compatible (zero breaking changes)
- ✅ Responsive design preserved
- ✅ All functionality preserved
- ✅ Selection mode works
- ✅ Bookmarks functional
- ✅ Like buttons integrated
