# Reading System Documentation

Complete guide for testing and using the webnovel-style reading system with mock data.

## 📁 Project Structure

```
frontend/
├── mock/
│   ├── stories.ts           # Story data definitions
│   ├── chapters.ts          # Chapter data for all stories
│   └── comments.ts          # Comment data
│
├── lib/
│   └── mock-api/
│       └── index.ts         # API helper functions
│
├── app/
│   └── stories/
│       ├── page.tsx         # Stories listing page
│       ├── [id]/
│       │   └── page.tsx     # Story detail page
│       └── [storyId]/
│           └── [chapterSlug]/
│               └── page.tsx # Chapter reading page
│
└── components/
    ├── reading/             # Reading components
    └── sidebar/             # Sidebar panels
```

## 🚀 Quick Start

### URL Structure

The reading system uses the following URL patterns:

```
/stories                                  # List all stories
/stories/5                                # Story detail page (ID=5)
/stories/5/the-changing-world            # Reading page (Story ID=5, Chapter slug)
/stories/7/chronicles-of-the-fallen-star # Different story
/stories/7/the-night-sky-changes         # Chapter from story 7
```

### Example URLs to Test

**Story 5: "The Beginning of the End"**
- Story page: `http://localhost:3000/stories/5`
- Chapter 1: `http://localhost:3000/stories/5/the-changing-world`
- Chapter 2: `http://localhost:3000/stories/5/lyra-and-the-marketplace`
- Chapter 3: `http://localhost:3000/stories/5/the-scholar`
- Chapter 4: `http://localhost:3000/stories/5/secrets-revealed`
- Chapter 5: `http://localhost:3000/stories/5/the-great-journey-begins`
- Chapter 6: `http://localhost:3000/stories/5/allies-in-darkness`
- Chapter 7: `http://localhost:3000/stories/5/the-final-stand`
- Chapter 8: `http://localhost:3000/stories/5/the-path-forward`

**Story 7: "Chronicles of the Fallen Star"**
- Story page: `http://localhost:3000/stories/7`
- Chapter 1: `http://localhost:3000/stories/7/the-night-sky-changes`
- Chapter 2: `http://localhost:3000/stories/7/the-journey-to-the-peak`
- Chapter 3: `http://localhost:3000/stories/7/the-revelation`

**Story 9: "Echoes of the Lost Kingdom"**
- Story page: `http://localhost:3000/stories/9`

## 📖 Testing the Reading System

### Step 1: View Story Details
1. Open `http://localhost:3000/stories/5`
2. You should see:
   - Story cover image
   - Title, author, and description
   - Genre and tags
   - Stats (views, likes, chapters, bookmarks)
   - "Read Now" and "Add to Library" buttons
   - List of all chapters as interactive tiles

### Step 2: Start Reading
1. Click the "Read Now" button OR click on any chapter
2. You'll be taken to the first chapter's reading page
3. URL will be: `http://localhost:3000/stories/5/the-changing-world`

### Step 3: Explore Reading Features

#### Bottom Action Buttons
At the end of each chapter, you'll see three interactive buttons:
- **COMMENT**: Opens the comments panel (shows existing comments)
- **VOTE**: For chapter rating (UI ready for implementation)
- **SEND GIFT**: For supporting the author (UI ready for implementation)

#### Right Sidebar (Desktop)
Three floating buttons on the right side:

1. **Blue Book Icon** (Chapters)
   - Opens chapter list panel
   - Shows all chapters of the current story
   - Current chapter is highlighted
   - Click any chapter to jump to it

2. **Gray Settings Icon** (Reader Settings)
   - **Background Colors**: Default, Sepia, Dark, Eye Comfort
   - **Font Families**: Serif, Sans-serif, Dyslexic-friendly
   - **Font Sizes**: Small, Medium, Large, Extra Large
   - Settings persist in localStorage
   - "Reset" button to restore defaults

3. **Green Comment Icon** (Comments)
   - Shows all chapter comments
   - Display user avatars, names, and timestamps
   - Like count for each comment
   - Comment input field (UI ready for backend)

#### Navigation Controls
- **Previous Button**: Go to previous chapter (disabled if on first chapter)
- **Chapter Info**: Shows "Chapter X of Y"
- **Next Button**: Go to next chapter (disabled if on last chapter)

#### Progress Bar
- Bottom of page shows reading progress
- Fills from left to right as user progresses through the chapter list

### Step 4: Test Reader Settings
1. Click the gray Settings icon on the right
2. Try different background colors:
   - Default (white)
   - Sepia (warm tone)
   - Dark (dark mode)
   - Eye Comfort (green tint)
3. Try different fonts:
   - Serif (traditional)
   - Sans-serif (modern)
   - Dyslexic-friendly (improved letter distinctiveness)
4. Adjust font size with A-, size indicator, A+
5. Click "Reset" to restore defaults
6. Close settings and reload the page - settings persist!

### Step 5: Test Chapter Navigation
1. Click the blue Book icon to open chapters panel
2. You'll see all chapters listed
   - Chapter number and title
   - Current chapter is highlighted in blue
3. Click different chapters to jump around
4. Notice the URL updates automatically
5. Header shows correct chapter title

### Step 6: Test Comments
1. Click the green Comment icon
2. You'll see existing comments from readers
3. Each comment shows:
   - User avatar (profile image)
   - Username
   - Comment text
   - Creation date
   - Like count (shown in mock data)
4. To post a comment (UI structure ready):
   - Type in the text area
   - Click "Post" button
   - (Backend integration needed)

## 📊 Mock Data Overview

### Stories
3 stories with rich metadata:
- **Story 5**: "The Beginning of the End" - 8 chapters
- **Story 7**: "Chronicles of the Fallen Star" - 3 chapters
- **Story 9**: "Echoes of the Lost Kingdom" - (setup ready)

### Chapters
Each chapter includes:
- Unique ID and story reference
- Chapter number and title
- URL-friendly slug
- Long, realistic narrative content (multiple paragraphs)
- Previous/next chapter references
- Creation timestamp

### Comments
Mock comments with:
- User profiles (name, avatar)
- Comment text
- Timestamps
- Like counts

## 🔧 API Helper Functions

Located in `/lib/mock-api/index.ts`:

```typescript
// Core functions
getStories()                    // Get all stories
getStoryById(id)               // Get story by ID
getChaptersByStory(storyId)    // Get all chapters for a story
getChapterBySlug(storyId, slug) // Get specific chapter
getChapterComments(chapterId)   // Get comments for chapter

// Navigation
getNextChapter(storyId, chapterId)      // Get next chapter
getPreviousChapter(storyId, chapterId)  // Get previous chapter
getFirstChapter(storyId)                // Get first chapter

// Utilities
getChapterList(storyId)        // Get chapter list with minimal data
searchChapters(storyId, keyword) // Search chapters by title/content
getChapterByNumber(storyId, num) // Get chapter by number
```

## 🔄 Component Flow

```
Story List Page (/stories)
         ↓
    Story Detail (/stories/[id])
    - Shows chapters list
         ↓
Reading Page (/stories/[storyId]/[chapterSlug])
    - Chapter Header
    - Chapter Content
    - Action Buttons (Comment/Vote/Gift)
    - Navigation (Prev/Next)
    - Sidebar Panels
      - Chapters List
      - Reader Settings
      - Comments
```

## 🎨 UI Features Implemented

✅ **Story Page**
- Hero section with cover image
- Author information
- Story stats
- Chapter list with navigation
- Genre and tags display

✅ **Reading Page**
- Clean chapter display
- Responsive design (mobile-friendly)
- Reading progress bar
- Action buttons (Comment/Vote/Gift)
- Previous/Next navigation

✅ **Reader Settings**
- Background color options (4 themes)
- Font family selection (3 options)
- Font size adjustment (4 sizes)
- Settings persistence with localStorage
- CSS variables for dynamic application

✅ **Sidebar Panels**
- Floating buttons on desktop (hidden on mobile)
- Smooth slide-in animations
- Semi-transparent backdrop
- Chapter list with current indicator
- Settings panel with reset option
- Comments panel with user avatars

✅ **Comments System**
- Display existing comments
- User profiles with avatars
- Timestamps and like counts
- Comment input (UI structure ready)

## 🔌 Backend Integration Points

All functions are ready for real backend integration:

### Chapter Loading
Replace mock data with API calls:
```typescript
async function getChapterBySlug(storyId, slug) {
  const response = await fetch(`/api/stories/${storyId}/chapters/${slug}`);
  return response.json();
}
```

### Comments Fetching & Posting
```typescript
async function fetchComments(chapterId) {
  const response = await fetch(`/api/chapters/${chapterId}/comments`);
  return response.json();
}

async function postComment(chapterId, content) {
  const response = await fetch(`/api/chapters/${chapterId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
  return response.json();
}
```

## 📱 Responsive Design

- **Desktop**: Full 4-column layout with floating sidebar
- **Tablet**: Optimized spacing and touch targets
- **Mobile**: Single column, sidebar hidden (accessible via tap)

## 🧪 Testing Checklist

- [ ] Story list page loads correctly
- [ ] Story detail page shows all information
- [ ] Chapter list displays all chapters
- [ ] Clicking chapter link navigates correctly
- [ ] URL updates when navigating chapters
- [ ] Reader settings save and persist
- [ ] Different background colors apply
- [ ] Different fonts apply correctly
- [ ] Font size adjustments work
- [ ] Settings reset to defaults
- [ ] Comments panel shows existing comments
- [ ] Progress bar fills as you scroll
- [ ] Previous/Next buttons work
- [ ] Chapter sidebar updates current chapter
- [ ] Mobile experience works smoothly

## 🚀 Performance Notes

- Mock data is loaded synchronously (instant)
- All settings are stored in localStorage
- Components use React hooks for efficient rendering
- No external API calls needed for testing
- Lightweight CSS with Tailwind

## 📝 Notes

- All mock data is stored locally in `/mock/` directory
- No database required for testing
- Comments system is ready for backend integration
- The system supports unlimited chapters per story
- URL slugs are auto-generated from titles in lowercase with hyphens

## 🎯 Next Steps for Production

1. Replace `/mock/` API calls with real backend endpoints
2. Implement user authentication for commenting
3. Add chapter ratings and upvoting
4. Implement gift/donation system
5. Add reading history tracking
6. Implement bookmarks persistence
7. Add chapter notifications
8. Analytics and tracking
