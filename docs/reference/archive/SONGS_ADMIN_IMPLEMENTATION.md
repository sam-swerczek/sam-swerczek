# Songs Admin UI Implementation

## Overview

A comprehensive admin interface for managing songs in the database. This system allows you to add, edit, delete, and organize music tracks that feed into the YouTube player system.

## File Structure

```
/Users/samswerczek/Projects/Personal_Page/
├── lib/
│   ├── supabase/
│   │   └── mutations.ts              # Database mutations for songs (NEW)
│   └── utils/
│       └── youtube.ts                # YouTube utilities (NEW)
├── app/
│   ├── admin/
│   │   └── songs/
│   │       ├── page.tsx              # Server component for admin songs page (NEW)
│   │       └── SongsAdminClient.tsx  # Client component with interactive features (NEW)
│   └── api/
│       └── songs/
│           └── route.ts              # API routes for CRUD operations (NEW)
└── components/
    └── admin/
        └── SongForm.tsx              # Form component for creating/editing songs (NEW)
```

## Features

### 1. Songs List View
- Sortable table displaying all songs (active and inactive)
- Columns: Order, Thumbnail, Title/Artist, Content Type, Duration, Status, Actions
- Filter options: All, Active, Inactive, Audio, Video, Featured
- Drag-and-drop reordering using display_order
- Real-time status badges (Active/Inactive, Featured)

### 2. Create/Edit Song Form
- **Required Fields:**
  - Title
  - Artist
  - YouTube Video ID (with URL parsing)

- **Optional Fields:**
  - Content Type (audio/video)
  - Album Cover URL (falls back to YouTube thumbnail)
  - Display Order
  - Duration (seconds)
  - Release Date
  - Description
  - Tags (comma-separated)
  - Spotify URL
  - Apple Music URL

- **Status Controls:**
  - Is Active (checkbox)
  - Is Featured (checkbox - only one song can be featured at a time)

### 3. YouTube Integration
- Paste any YouTube URL format or just the video ID
- Automatic video ID extraction
- Fetches metadata (title, artist, thumbnail) using YouTube oEmbed API
- Real-time video thumbnail preview
- Validation of video ID format

### 4. Interactive Features
- Move songs up/down in display order
- Set/unset featured song
- Soft delete (sets is_active to false)
- Edit existing songs
- Success/error toast notifications
- Loading states during operations
- Confirmation dialogs before delete

## API Endpoints

### GET /api/songs
List all songs (requires authentication)
```typescript
Response: { data: Song[] }
```

### POST /api/songs
Create a new song (requires authentication)
```typescript
Request: CreateSongData
Response: { data: Song, message: string }
```

### PUT /api/songs
Update an existing song (requires authentication)
```typescript
Request: { id: string, ...UpdateSongData }
Response: { data: Song, message: string }
```

### DELETE /api/songs?id={id}
Soft delete a song (requires authentication)
```typescript
Response: { message: string }
```

### PATCH /api/songs
Reorder songs or set featured song (requires authentication)

**Reorder:**
```typescript
Request: { action: 'reorder', orders: [{id: string, display_order: number}] }
Response: { message: string }
```

**Set Featured:**
```typescript
Request: { action: 'set_featured', id: string }
Response: { data: Song, message: string }
```

## Database Mutations

Located in `/Users/samswerczek/Projects/Personal_Page/lib/supabase/mutations.ts`

### Available Functions:

```typescript
// Query
getAllSongs(): Promise<Song[]>

// Create
createSong(songData: CreateSongData): Promise<Song>

// Update
updateSong(id: string, songData: UpdateSongData): Promise<Song>

// Delete
deleteSong(id: string): Promise<boolean>
permanentlyDeleteSong(id: string): Promise<boolean>

// Reorder
reorderSongs(orders: {id: string, display_order: number}[]): Promise<boolean>

// Featured
setFeaturedSong(id: string): Promise<Song>

// Toggle
toggleSongActive(id: string, currentStatus: boolean): Promise<Song>
```

## YouTube Utilities

Located in `/Users/samswerczek/Projects/Personal_Page/lib/utils/youtube.ts`

### Available Functions:

```typescript
// Extract video ID from various URL formats
extractYouTubeVideoId(input: string): string | null

// Validate video ID format
isValidYouTubeVideoId(videoId: string): boolean

// Generate thumbnail URL
getYouTubeThumbnailUrl(videoId: string, quality: 'default' | 'medium' | 'high' | 'maxres'): string

// Generate embed URL
getYouTubeEmbedUrl(videoId: string, autoplay?: boolean): string

// Generate watch URL
getYouTubeWatchUrl(videoId: string): string

// Fetch metadata using oEmbed API (no API key required)
fetchYouTubeMetadata(videoId: string): Promise<{title, author_name, thumbnail_url} | null>

// Validate video exists
validateYouTubeVideo(videoId: string): Promise<boolean>

// Format duration
formatDuration(seconds: number | null): string
```

## Design Patterns

### Authentication
- All API routes verify authentication using server-side Supabase client
- Middleware handles authentication at the route level
- Returns 401 Unauthorized if not authenticated

### Data Flow
1. **Server Component** (`page.tsx`) fetches initial data using server actions
2. **Client Component** (`SongsAdminClient.tsx`) handles all interactive features
3. **Form Component** (`SongForm.tsx`) manages form state and validation
4. **API Routes** handle mutations and return updated data
5. **Mutations** use server-side client with service role key for full access

### Error Handling
- Try-catch blocks around all async operations
- User-friendly error messages displayed in alerts
- Console logging for debugging
- Validation before API calls

### Optimistic UI
- Loading states during operations
- Immediate feedback to user actions
- Refresh data after successful operations

### Featured Song Logic
- When setting a song as featured, all other songs are automatically unfeatured
- Handled at the database layer to ensure consistency
- Only one song can be featured at a time

## Usage Instructions

### Accessing the Admin UI
1. Navigate to `/admin/songs` (requires authentication)
2. You'll see a list of all songs with filters

### Adding a New Song
1. Click "Add New Song" button
2. Paste a YouTube URL or video ID
3. Metadata will be auto-filled (title, artist, thumbnail)
4. Fill in any additional fields
5. Set status (Active/Featured)
6. Click "Create Song"

### Editing a Song
1. Click "Edit" button on any song in the list
2. Modify any fields
3. Click "Update Song"

### Reordering Songs
1. Use the up/down arrow buttons next to each song
2. Order is reflected in the display_order field
3. Changes are saved immediately

### Setting Featured Song
1. Click "Feature" button on any song
2. All other songs will be automatically unfeatured
3. Only one song can be featured at a time

### Deleting a Song
1. Click "Delete" button
2. Confirm the deletion
3. Song is soft deleted (is_active set to false)
4. Can still be viewed by filtering for "Inactive"

## Key Architectural Decisions

### 1. Soft Delete by Default
- DELETE endpoint sets `is_active` to false instead of removing from database
- Preserves data and allows for recovery
- Can implement hard delete later if needed

### 2. Display Order Management
- Auto-increment display_order when creating new songs
- Reordering swaps display_order values between adjacent songs
- Keeps ordering simple and manageable

### 3. YouTube Integration
- Uses oEmbed API (no API key required)
- Supports multiple URL formats
- Extracts video ID and validates format
- Auto-fills metadata to reduce manual entry

### 4. Server-Side Authentication
- All API routes verify authentication server-side
- Uses service role key for database operations
- Follows existing middleware patterns

### 5. Single Featured Song
- Enforced at database layer via mutations
- Automatically unfeatures other songs when setting featured
- Prevents data inconsistencies

### 6. Tailwind Styling
- Follows existing design system patterns
- Dark theme with accent colors (blue, teal, gold)
- Responsive design (mobile-friendly)
- Consistent spacing and typography

## Edge Cases and Gotchas

### 1. YouTube Video ID Validation
- Always validate video ID format before saving
- Handle various URL formats gracefully
- Show clear error messages for invalid IDs

### 2. Featured Song Logic
- Setting multiple songs as featured will automatically unfeature others
- This is handled at the API/mutation level
- Frontend reflects changes after refresh

### 3. Missing Album Covers
- Falls back to YouTube thumbnail if album_cover_url is empty
- Thumbnail generation is handled by utility functions
- Error handling for failed image loads

### 4. Display Order Conflicts
- Auto-assigns next available order for new songs
- Swapping adjacent songs keeps order consistent
- No gaps in display order sequence

### 5. Authentication
- All admin routes require authentication
- API routes return 401 if not authenticated
- Middleware handles redirects to login page

### 6. Metadata Fetching
- YouTube oEmbed API may fail or be rate-limited
- Form allows manual entry if auto-fill fails
- Not blocking - form can be submitted without metadata

### 7. Tags Handling
- Stored as string array in database
- UI accepts comma-separated string
- Conversion happens in form submission

### 8. Content Type
- "audio" type shows album cover, hides video
- "video" type shows video player
- Important for player behavior in frontend

## Dependencies

### Existing Dependencies (No Installation Required)
- `@supabase/supabase-js` - Database client
- `@supabase/ssr` - Server-side rendering support
- `next` - Framework
- `react` - UI library
- `tailwindcss` - Styling

### No New Dependencies Required
All functionality uses native browser APIs and existing dependencies.

## Testing Recommendations

### Manual Testing Checklist
- [ ] Create a new song with valid YouTube URL
- [ ] Create a song with just video ID
- [ ] Edit an existing song
- [ ] Delete a song (soft delete)
- [ ] Reorder songs using up/down arrows
- [ ] Set a song as featured
- [ ] Filter by content type (audio/video)
- [ ] Filter by status (active/inactive)
- [ ] Test form validation (missing required fields)
- [ ] Test invalid YouTube URL/ID
- [ ] Test with very long titles/descriptions
- [ ] Test on mobile device (responsive design)
- [ ] Test all streaming links (Spotify, Apple Music)
- [ ] Test tag parsing (comma-separated)

### API Testing
```bash
# Get all songs (requires auth token)
curl -X GET http://localhost:3000/api/songs

# Create song (requires auth token)
curl -X POST http://localhost:3000/api/songs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Song",
    "artist": "Test Artist",
    "youtube_video_id": "dQw4w9WgXcQ",
    "content_type": "audio"
  }'

# Update song (requires auth token)
curl -X PUT http://localhost:3000/api/songs \
  -H "Content-Type: application/json" \
  -d '{
    "id": "song-id-here",
    "title": "Updated Title"
  }'

# Delete song (requires auth token)
curl -X DELETE http://localhost:3000/api/songs?id=song-id-here

# Reorder songs (requires auth token)
curl -X PATCH http://localhost:3000/api/songs \
  -H "Content-Type: application/json" \
  -d '{
    "action": "reorder",
    "orders": [
      {"id": "song-1", "display_order": 1},
      {"id": "song-2", "display_order": 2}
    ]
  }'
```

## Future Enhancements

### Potential Improvements
1. **Drag-and-drop reordering** - Use a library like `react-beautiful-dnd` or `@dnd-kit/core`
2. **Bulk operations** - Select multiple songs and perform batch actions
3. **Advanced filtering** - Filter by tags, release date, etc.
4. **Search functionality** - Search songs by title, artist, or description
5. **Sorting options** - Sort by title, artist, date added, etc.
6. **Pagination** - For large song collections
7. **Import/Export** - CSV or JSON import/export
8. **Analytics** - Track plays, views, or other metrics
9. **Playlist management** - Group songs into playlists
10. **Rich text editor** - For song descriptions
11. **Image upload** - Upload custom album covers
12. **Undo/Redo** - For accidental deletions or edits
13. **Revision history** - Track changes to songs over time

## Troubleshooting

### Songs not appearing
- Check if songs are marked as `is_active: true`
- Verify authentication is working
- Check browser console for errors
- Verify database connection

### YouTube metadata not fetching
- Check network connection
- Verify video ID is valid
- YouTube oEmbed API may be rate-limited
- Manual entry is always an option

### Reordering not working
- Ensure songs have unique display_order values
- Check for JavaScript errors in console
- Verify API endpoint is responding

### Featured song not updating
- Check database to see if only one song is featured
- Verify API PATCH endpoint is working
- Check for conflicts in local state vs database state

### Form validation errors
- Ensure required fields (title, artist, youtube_video_id) are filled
- Check video ID format is valid (11 alphanumeric characters)
- Verify no special characters in unexpected places

## Security Considerations

### Implemented Security Measures
1. **Server-side authentication** - All API routes verify user is authenticated
2. **Input validation** - YouTube video IDs are validated before saving
3. **SQL injection protection** - Using Supabase parameterized queries
4. **XSS protection** - React escapes all user input by default
5. **CSRF protection** - Next.js handles this automatically

### Best Practices
- Never expose service role key to client
- Always validate input server-side
- Use HTTPS in production
- Implement rate limiting for API endpoints (future enhancement)
- Log all admin actions for audit trail (future enhancement)

## Support and Maintenance

### Common Issues
- If YouTube oEmbed API stops working, implement fallback to manual entry
- If display_order conflicts occur, run a migration to reset all orders
- If featured song logic breaks, check for database constraints

### Maintenance Tasks
- Periodically clean up soft-deleted songs if needed
- Monitor API performance and optimize queries
- Update YouTube utility functions if URL formats change
- Keep Supabase client library up to date

---

## Quick Reference

### File Locations
- **Mutations**: `/Users/samswerczek/Projects/Personal_Page/lib/supabase/mutations.ts`
- **YouTube Utils**: `/Users/samswerczek/Projects/Personal_Page/lib/utils/youtube.ts`
- **API Routes**: `/Users/samswerczek/Projects/Personal_Page/app/api/songs/route.ts`
- **Admin Page**: `/Users/samswerczek/Projects/Personal_Page/app/admin/songs/page.tsx`
- **Client Component**: `/Users/samswerczek/Projects/Personal_Page/app/admin/songs/SongsAdminClient.tsx`
- **Form Component**: `/Users/samswerczek/Projects/Personal_Page/components/admin/SongForm.tsx`

### Database Schema
See `Song` interface in `/Users/samswerczek/Projects/Personal_Page/lib/types/index.ts`

### Accessing the Admin UI
URL: `http://localhost:3000/admin/songs` (requires authentication)
