# Card Component Refactoring - Complete Guide

## Overview
Successfully refactored the React/Next.js project to use a single unified `UniversalCard` component instead of separate card components for poems and stories.

## Changes Made

### 1. **Created `UniversalCard.tsx`**
- **Location**: [components/shared/UniversalCard.tsx](components/shared/UniversalCard.tsx)
- **Replaces**: `ProfileCard.tsx` (removed)
- **Features**:
  - Supports any content type (poem, story, essay, journal, etc.)
  - Graceful handling of missing data with fallbacks
  - Selection mode for bulk operations (profile tabs)
  - Bookmark functionality
  - Like and comment stats
  - Views tracking  
  - Optional description and tags support
  - Flexible `onClick`, `href`, and `children` props for extensibility

### 2. **Updated Files**
All imports have been updated from `ProfileCard` to `UniversalCard`:

- [components/Profile/PoemsTab.tsx](components/Profile/PoemsTab.tsx)
- [components/Profile/StoriesTab.tsx](components/Profile/StoriesTab.tsx)
- [components/Profile/SavedTab.tsx](components/Profile/SavedTab.tsx)
- [components/Profile/LikedTab.tsx](components/Profile/LikedTab.tsx)

### 3. **Deleted**
- `components/Profile/ProfileCard.tsx` (deprecated, functionality moved to UniversalCard)

---

## Usage Examples

### Basic Story Card
```tsx
<UniversalCard
  id={1}
  title="The Last Librarian"
  author="Marcus Thorne"
  genre="Sci-Fi"
  image="/images/covers/cover7.jpg"
  views="15M"
  likes={2100}
  comments="1.2K"
  type="story"
/>
```

### Basic Poem Card
```tsx
<UniversalCard
  id={2}
  title="Echoes of Silence"
  author="Clara M. Thorne"
  genre="Romanticism"
  image="/images/covers/cover1.jpg"
  views="45M"
  likes={1200}
  comments="1.2K"
  type="poem"
/>
```

### Card with Bookmark & Selection Mode
```tsx
<UniversalCard
  id={3}
  title="The Unseen Thread"
  author="S. J. Sterling"
  genre="Free Verse"
  image="/images/covers/cover3.jpg"
  views="8.4M"
  likes={1200}
  comments="1.2K"
  type="poem"
  showBookmark={true}
  selectionMode={true}
  isSelected={false}
  onToggleSelect={(id) => console.log('Selected:', id)}
/>
```

### Card with Optional Description & Tags
```tsx
<UniversalCard
  id={4}
  title="Coffee and Rain"
  author="Aries"
  genre="Romance"
  image="/images/covers/cover2.jpg"
  views="12M"
  likes={1100}
  comments="450"
  type="story"
  description="A heartwarming tale of unexpected meetings..."
  tags={["romance", "coffee", "rainy-day"]}
/>
```

### Card with Custom Click Handler
```tsx
<UniversalCard
  id={5}
  title="Wanderlust Excerpts"
  author="Clara Thorne"
  genre="Travel"
  image="/images/covers/cover4.jpg"
  views="500K"
  likes={450}
  comments="89"
  type="journal"
  onClick={() => router.push(`/journals/5`)}
/>
```

---

## Component API

### Props Interface
```typescript
interface UniversalCardProps {
  // Required
  id: number;
  title: string;
  author: string;
  genre: string;
  image: string;
  views: string | number;
  likes: number;
  comments: string | number;
  
  // Optional - Content Type
  type?: "story" | "poem" | "essay" | "journal" | string;
  
  // Optional - Selection Mode (for profile tabs)
  selectionMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: (id: number) => void;
  
  // Optional - UI Controls
  showBookmark?: boolean;
  
  // Optional - Extended Features
  description?: string;
  tags?: string[];
  href?: string;
  onClick?: () => void;
  children?: React.ReactNode;
}
```

### Default Values
- `selectionMode`: `false`
- `isSelected`: `false`
- `showBookmark`: `true`

---

## Features

### 1. **Image Handling**
- Adaptive image loading with fallback
- Automatic error handling with placeholder
- Hover scale animation
- Responsive sizing (h-48, md:h-56, lg:h-72)

### 2. **Genre & Type Badges**
- Genre badge with gray background
- Optional type indicator (poem, story, essay, etc.)
- Truncated text overflow handling

### 3. **Content Information**
- Title with line clamping (2 lines max)
- Author name with truncation
- Optional description support
- Optional tags display (up to 2 shown)

### 4. **Stats Section**
- Eye icon + view count
- Heart icon + like button (interactive)
- Comment icon + comment count
- All stats responsive and truncated

### 5. **Bookmark Button**
- Appears in top-right corner
- Hidden in selection mode
- Hover effects and transitions

### 6. **Selection Mode**
- Checkbox in top-left corner
- Visual ring when selected
- Selection callback support
- No interaction with other controls

### 7. **Extensibility**
- Optional `onClick` handler
- Optional `href` prop for links
- Optional `children` for custom content
- Flexible enough for future use cases

---

## Updated Component Examples

### PoemsTab.tsx
```tsx
"use client";

import UniversalCard from "@/components/shared/UniversalCard";

const poems = [
  { 
    id: 1, 
    title: "Echoes of Silence", 
    author: "Clara M. Thorne", 
    genre: "Romanticism", 
    views: "45M", 
    likes: 1200, 
    comments: "1.2K", 
    image: "/images/covers/cover1.jpg" 
  },
  // ... more poems
];

export default function PoemsTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
        <h2 className="font-serif font-bold text-xl text-black">All Poems</h2>
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          {poems.length} Works
        </span>
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

### StoriesTab.tsx
```tsx
"use client";

import UniversalCard from "@/components/shared/UniversalCard";

const stories = [
  { 
    id: 1, 
    title: "The Last Librarian", 
    author: "Marcus Thorne", 
    genre: "Sci-Fi", 
    views: "15M", 
    likes: 2100, 
    comments: "1.2K", 
    image: "/images/covers/cover7.jpg" 
  },
  // ... more stories
];

export default function StoriesTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
        <h2 className="font-serif font-bold text-xl text-black">All Stories</h2>
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          {stories.length} Works
        </span>
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

### SavedTab.tsx
```tsx
"use client";

import UniversalCard from "@/components/shared/UniversalCard";

const savedItems = [
  { 
    id: 1, 
    title: "The Art of Doing Nothing", 
    author: "William Reyes", 
    type: "essay", 
    genre: "Lifestyle", 
    views: "1.2M", 
    likes: 800, 
    comments: "200", 
    image: "https://images.unsplash.com/..." 
  },
  // ... more items with mixed types (poem, story, essay, journal)
];

export default function SavedTab() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
        <h2 className="font-serif font-bold text-xl text-black">Reading List</h2>
        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          {savedItems.length} Items
        </span>
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

### LikedTab.tsx (Selection Mode Example)
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
    // ... items data
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
      {/* Controls Panel */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="border text-sm px-3 py-2 rounded-md">
            <option value="newest">Newest → Oldest</option>
            <option value="oldest">Oldest → Newest</option>
          </select>

          <select value={filter} onChange={(e) => setFilter(e.target.value as any)} className="border text-sm px-3 py-2 rounded-md">
            <option value="all">All Content</option>
            <option value="story">Stories</option>
            <option value="poem">Poems</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          {!selectionMode && (
            <button onClick={() => setSelectionMode(true)} className="text-sm border px-4 py-2 rounded-md hover:bg-gray-50">
              Select
            </button>
          )}

          {selectionMode && (
            <>
              <button onClick={selectAll} className="text-sm border px-4 py-2 rounded-md">
                Select All
              </button>

              {selected.length > 0 && (
                <button onClick={deleteSelected} className="flex items-center gap-2 text-sm px-4 py-2 bg-black text-white rounded-md">
                  <Trash2 size={16} />
                  Delete ({selected.length})
                </button>
              )}

              <button onClick={clearSelection} className="text-sm px-3 py-2 text-gray-500">
                Cancel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Cards Grid */}
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

## Styling & Responsiveness

### Breakpoints
- **Mobile**: 2 columns, min-width 150px
- **Tablet (md)**: 3 columns, min-width 180px
- **Desktop (lg)**: 4 columns, min-width 200px
- **Wide (xl)**: 5 columns, min-width 200px

### Image Dimensions
- **Mobile**: 192px (h-48)
- **Tablet**: 224px (md:h-56)
- **Desktop**: 288px (lg:h-72)

### Spacing
- Gap between cards: 24px (gap-6)
- Image margin bottom: 8px (md:12px)
- Overall responsive padding

---

## Graceful Fallbacks

The component has built-in fallbacks:

```tsx
// Missing data handling
- Missing title → "Untitled"
- Missing author → "Unknown Author"
- Missing image → Unsplash fallback placeholder
- Image load failure → Placeholder image
- Numeric views/comments → Formatted as strings
```

---

## TypeScript Support

All components are fully typed with TypeScript:

```tsx
export type ContentType = "story" | "poem" | "essay" | "journal" | string;

export interface UniversalCardProps {
  // Full type definitions
  id: number;
  title: string;
  // ... etc
}
```

---

## Migration Guide

If you have other components using `ProfileCard`, update them like this:

**Before:**
```tsx
import ProfileCard from "@/components/Profile/ProfileCard";

<ProfileCard {...props} />
```

**After:**
```tsx
import UniversalCard from "@/components/shared/UniversalCard";

<UniversalCard {...props} />
```

No prop changes needed - the interface is 100% compatible!

---

## Testing Checklist

- [x] Component renders without errors
- [x] All TypeScript types are correct
- [x] Profile tabs (Poems, Stories, Saved, Liked) work correctly
- [x] Bookmark button functions in all contexts
- [x] Like button integrates properly
- [x] Selection mode works in LikedTab
- [x] Images load and have fallbacks
- [x] Responsive grid displays correctly
- [x] Type badges display for mixed content
- [x] Stats show correctly

---

## File Structure

```
frontend/
├── components/
│   ├── shared/
│   │   └── UniversalCard.tsx [NEW]
│   ├── Profile/
│   │   ├── ProfileCard.tsx [DELETED]
│   │   ├── PoemsTab.tsx [UPDATED]
│   │   ├── StoriesTab.tsx [UPDATED]
│   │   ├── SavedTab.tsx [UPDATED]
│   │   ├── LikedTab.tsx [UPDATED]
│   │   └── ... (other components unchanged)
│   ├── interactions/
│   │   ├── LikeButton.tsx (used by UniversalCard)
│   │   └── BookmarkButton.tsx (used by UniversalCard)
│   └── ... (other components)
└── ...
```

---

## Summary

✅ **Refactoring Complete!**

- Single unified `UniversalCard.tsx` component replaces separate card components
- All existing functionality preserved (bookmarks, likes, selection mode)
- Full TypeScript support with proper types
- Responsive design maintained
- Graceful fallbacks for missing data
- Ready for future extensions
- Zero breaking changes to existing code
- All TypeScript errors resolved
