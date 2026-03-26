# Preeti Blog Admin

A comprehensive editorial admin panel for managing Preeti's lifestyle blog. Built with **Next.js 16.2**, **React 19**, **TanStack Table**, **BlockNote**, **Gemini AI**, and **ImageKit**.

## Overview

This is the backend editorial interface for the Preeti Amble blog. It provides:

- **Dashboard**: Post statistics, recent posts, and engagement metrics
- **Posts Management**: Full CRUD operations with TanStack Table (sorting, filtering, pagination)
- **Rich Text Editor**: BlockNote with AI writing assistance
- **AI Features**:
  - Text generation (Gemini 3.1 Pro)
  - Cover image generation (Nano Banana models)
  - Inline image generation
- **Image Management**: ImageKit integration for uploading and storing images
- **Database**: MongoDB with Mongoose ORM

## Tech Stack

- **Framework**: Next.js 16.2.1 (App Router)
- **UI Library**: React 19.2.4
- **Editor**: BlockNote v0.47.2 with Mantine theme
- **Tables**: TanStack React Table v8.21.3
- **Components**: shadcn/ui with Tailwind CSS v4
- **Database**: MongoDB + Mongoose v9.3.2
- **AI**: Google Generative AI SDK (Gemini)
- **Media**: ImageKit SDK
- **Icons**: Lucide React
- **Styling**: Tailwind CSS v4 with custom design tokens (Terracotta Soul palette)

## Getting Started

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file with:

```env
mongodb=<mongodb_connection_string>
GEMINI_API_KEY=<your_gemini_api_key>
IMAGEKIT_PUBLIC_KEY=<imagekit_public_key>
IMAGEKIT_PRIVATE_KEY=<imagekit_private_key>
IMAGEKIT_URL_ENDPOINT=<imagekit_url_endpoint>
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=<imagekit_url_endpoint>
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=<imagekit_public_key>
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access the admin panel.

## Features

### Dashboard
- Overview of total posts, published posts, and total views
- Recent posts list with quick actions
- Key metrics visualization

### Posts Management
- Table view with sorting by date, title, category
- Global search across posts
- Filter by category and status (draft/published)
- Pagination with configurable page size
- Delete confirmation with shadcn AlertDialog
- Responsive grid layout

### Post Editor
- **BlockNote Editor**: Rich text editing with multiple block types
  - Headings, paragraphs, lists, quotes, code blocks
  - Inline formatting (bold, italic, underline, strikethrough, code)
  - Link insertion
- **Metadata**: Title, slug, excerpt, category, tags, cover image
- **AI Writing**: Generate content with Gemini 3.1 Pro
- **Cover Images**:
  - Upload via file picker (multipart form)
  - Generate with AI (Nano Banana models)
  - Preview with 16:9 aspect ratio
- **Publishing**: Draft/Published status toggle
- **Auto-save**: Reading time estimation

### Image Generation Models
- **Nano Banana**: `gemini-2.5-flash-image`
- **Nano Banana 2**: `gemini-3.1-flash-image-preview`
- **Nano Banana Pro**: `nano-banana-pro-preview`

### API Routes

- `GET/POST /api/posts` - List and create posts
- `GET/PATCH/DELETE /api/posts/[slug]` - Post operations
- `POST /api/images/generate` - Generate images with AI
- `POST /api/imagekit/upload` - Upload images to ImageKit

## Design System

Uses a custom **Terracotta Soul** color palette with shadcn/ui components:
- Primary: #713115 (warm terracotta)
- Background: #faf9f6 (soft cream)
- Typography: Inter + Geist (fonts)

## Project Structure

```
app/
├── dashboard/          # Dashboard page
├── posts/             # Posts listing and management
│   └── new/          # New post editor
├── api/              # Backend API routes
│   ├── posts/
│   ├── images/
│   └── imagekit/
└── layout.tsx

components/
├── admin/            # Layout (sidebar, topbar)
├── posts/            # Posts components (table, etc)
└── editor/           # Editor components (BlockNote, AI tools)

lib/
├── models/           # MongoDB schemas
├── imagekit.ts       # ImageKit client
├── mongodb.ts        # MongoDB connection
└── serialize.ts      # BSON to plain object conversion
```

## Key Techniques

### Server Components & Serialization
Uses `serializePost()` helper to convert Mongoose BSON ObjectIds and Dates to plain JavaScript objects for Client Component props.

### Image Handling
- Multipart uploads: File picker → multipart/form-data → ImageKit
- AI images: Base64 → JSON → ImageKit
- All stored under `/blog/covers` folder in ImageKit

### AI Integration
- Uses Google Generative AI SDK with `responseModalities: ["TEXT", "IMAGE"]`
- Gemini 3.1 Pro for text generation
- Image models support both text and image generation

### BlockNote Integration
- Stores content as JSON array of block objects
- `extractExcerpt()` strips JSON and returns plain text for excerpts
- Server-side rendering in frontend with `BlockNoteRenderer` component

## Development Notes

- Sidebar is always expanded (w-64)
- Active nav detection handles /posts and /posts/new correctly
- All forms auto-save to database
- Delete uses optimistic UI updates with `router.refresh()`
- Images are CDN-served via ImageKit for fast loading

## Deployment

```bash
npm run build
npm start
```

Deploy to Vercel, AWS, or your preferred Node.js hosting.

## License

Private project for Preeti Amble
