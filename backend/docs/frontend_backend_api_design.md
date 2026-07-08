# Frontend Backend API Design

## Scope
This document defines the backend API surface needed by the existing frontend pages and components for stories, poems, library, notifications, and analytics.

## Design principles
- Keep the API surface minimal and aligned with the current UI.
- Use RESTful endpoints for resources and explicit routes for custom actions.
- Public read endpoints are open; write and user-specific endpoints require authentication.
- Keep the implementation modular and avoid redundant endpoints.

## Stories

### 1. List / search / filter stories
- Why needed: story listing pages, home feed, browse pages, search, genre filtering, tag filtering.
- Method: GET
- URL: /api/stories/
- Query params: q, genre, tag, author, status, page, page_size
- Response: paginated list of stories
- Auth: Public for published stories; authenticated for drafts/mine.
- View type: ViewSet (list/retrieve/create/update/delete) with custom actions for feed-specific behavior.

### 2. Retrieve a story
- Why needed: story detail page and reading page.
- Method: GET
- URL: /api/stories/<id>/
- Response: story detail payload with author, genre, tags, chapter count, stats.
- Auth: Public for published stories.
- View type: ViewSet retrieve.

### 3. Create a story draft
- Why needed: writing flow and draft creation.
- Method: POST
- URL: /api/stories/
- Body: title, synopsis, genre, tags, image, is_mature, status
- Response: created story
- Auth: Required.
- View type: ViewSet create.

### 4. Update a story
- Why needed: editing existing drafts and metadata updates.
- Method: PATCH
- URL: /api/stories/<id>/
- Body: partial story fields
- Response: updated story
- Auth: Required; owner only.
- View type: ViewSet partial_update.

### 5. Delete a story
- Why needed: delete drafts or unpublished content.
- Method: DELETE
- URL: /api/stories/<id>/
- Response: 204
- Auth: Required; owner only.
- View type: ViewSet destroy.

### 6. Publish / unpublish story
- Why needed: writing workflow and publishing controls.
- Method: POST
- URL: /api/stories/<id>/publish/ and /api/stories/<id>/unpublish/
- Response: story payload with updated status
- Auth: Required; owner only.
- View type: ViewSet custom actions.

### 7. User drafts / authored stories
- Why needed: profile pages and author dashboards.
- Method: GET
- URL: /api/stories/mine/ and /api/stories/authors/<author_id>/stories/
- Response: list of stories for the current user or an author
- Auth: Mine requires authentication; author list public.
- View type: ViewSet custom actions / explicit API view.

### 8. Trending / latest / popular / featured / recommendations
- Why needed: home page sections and recommendation surfaces.
- Method: GET
- URLs:
  - /api/stories/trending/
  - /api/stories/latest/
  - /api/stories/popular/
  - /api/stories/featured/
  - /api/stories/recommendations/
- Response: paginated list of stories
- Auth: Public.
- View type: ViewSet custom actions.

### 9. Chapter CRUD and reading endpoint
- Why needed: chapter-based reading experience and chapter management.
- Method: GET/POST/PATCH/DELETE
- URLs:
  - /api/stories/<story_id>/chapters/
  - /api/stories/<story_id>/chapters/<chapter_id>/
- Response: chapter list/detail payload
- Auth: Read public for published stories; write owner only.
- View type: explicit API views for nested chapter resources.

### 10. Continue reading
- Why needed: reading progression entry points.
- Method: GET
- URL: /api/stories/continue-reading/
- Response: most recently read story/chapter context
- Auth: Required.
- View type: ViewSet custom action.

## Poems

### 1. List / search / filter poems
- Why needed: poem listing pages, browse pages, search, genre/tag filtering.
- Method: GET
- URL: /api/poems/
- Query params: q, genre, tag, author, status, page, page_size
- Response: paginated list of poems
- Auth: Public for published poems; authenticated for drafts/mine.
- View type: ViewSet.

### 2. Retrieve a poem
- Why needed: poem detail page.
- Method: GET
- URL: /api/poems/<id>/
- Response: poem detail payload
- Auth: Public for published poems.
- View type: ViewSet retrieve.

### 3. Create / update / delete poems
- Why needed: writing flow and profile content management.
- Method: POST/PATCH/DELETE
- URL: /api/poems/
- Auth: Required; owner only for updates/deletes.
- View type: ViewSet.

### 4. Publish / unpublish poem
- Why needed: writing workflow.
- Method: POST
- URL: /api/poems/<id>/publish/ and /api/poems/<id>/unpublish/
- Auth: Required; owner only.
- View type: ViewSet custom actions.

### 5. Author poems / drafts / trending / latest / recommendations
- Why needed: profile and home page related sections.
- Method: GET
- URLs:
  - /api/poems/mine/
  - /api/poems/authors/<author_id>/poems/
  - /api/poems/trending/
  - /api/poems/latest/
  - /api/poems/recommendations/
- Auth: Public for published poems; mine requires authentication.
- View type: ViewSet custom actions.

## Library

### 1. Reading history list and progress update
- Why needed: library history and reading progress tracking.
- Method: GET/POST/PATCH
- URL: /api/library/history/
- Response: list of history entries and updated progress
- Auth: Required.
- View type: APIView / explicit endpoints.

### 2. Continue reading
- Why needed: continue reading shortcuts.
- Method: GET
- URL: /api/library/continue-reading/
- Auth: Required.
- View type: APIView.

### 3. Collections CRUD
- Why needed: saved collections in the library.
- Method: GET/POST/PATCH/DELETE
- URL: /api/library/collections/ and /api/library/collections/<id>/
- Auth: Required; owner only.
- View type: ViewSet.

### 4. Collection items CRUD
- Why needed: adding/removing/reordering content inside collections.
- Method: POST/DELETE
- URL: /api/library/collections/<collection_id>/items/ and /api/library/collections/items/<item_id>/
- Auth: Required; owner only.
- View type: APIView.

### 5. Bookmarks / saved content
- Why needed: saved stories and poems.
- Method: GET/POST/DELETE
- URL: /api/library/bookmarks/
- Response: list of bookmarked content
- Auth: Required.
- View type: APIView.

## Notifications

### 1. Notification list and unread count
- Why needed: notifications panel and badge counts.
- Method: GET
- URL: /api/notifications/ and /api/notifications/unread-count/
- Auth: Required.
- View type: APIView.

### 2. Mark as read / mark all as read
- Why needed: interaction with notification center.
- Method: POST
- URL: /api/notifications/<id>/read/ and /api/notifications/mark-all-read/
- Auth: Required; recipient only.
- View type: APIView.

### 3. Delete notification
- Why needed: clear items from the list.
- Method: DELETE
- URL: /api/notifications/<id>/
- Auth: Required; recipient only.
- View type: APIView.

### 4. Recent notifications
- Why needed: compact notification feed on the UI.
- Method: GET
- URL: /api/notifications/recent/
- Auth: Required.
- View type: APIView.

### 5. Notification preferences
- Why needed: settings/preferences pages.
- Method: GET/PATCH
- URL: /api/notifications/preferences/
- Auth: Required.
- View type: APIView.

## Analytics

### 1. Record story / poem views
- Why needed: content analytics and popularity ranking.
- Method: POST
- URL: /api/analytics/stories/<id>/views/ and /api/analytics/poems/<id>/views/
- Auth: Optional for anonymous traffic; authenticated for user-specific events.
- View type: APIView.

### 2. Record reading duration
- Why needed: reading engagement metrics.
- Method: POST
- URL: /api/analytics/reading-duration/
- Body: target_type, target_id, duration_seconds
- Auth: Optional.
- View type: APIView.

### 3. Recommendation interaction events
- Why needed: tracking clicks from recommendation sections.
- Method: POST
- URL: /api/analytics/recommendation-clicks/
- Body: source, target_type, target_id
- Auth: Optional.
- View type: APIView.

### 4. Dashboard / author / popular content statistics
- Why needed: profile analytics, admin dashboards, and popularity surfaces.
- Method: GET
- URLs:
  - /api/analytics/stats/
  - /api/analytics/author-stats/
  - /api/analytics/popular-genres/
  - /api/analytics/popular-stories/
  - /api/analytics/popular-poems/
- Auth: Required for user stats; public for aggregate metrics.
- View type: APIView.
