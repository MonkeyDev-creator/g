# Monkey Studio GFX

## Overview

A GFX (graphics) ordering and tracking platform for Monkey Studio. Users can browse services, place orders via Discord integration, and track their order status. The platform includes an admin dashboard for order management and status updates.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for page transitions and UI effects
- **Build Tool**: Vite with hot module replacement

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript (ESM modules)
- **API Design**: RESTful endpoints defined in `shared/routes.ts` with Zod validation
- **Session Management**: Express sessions for admin authentication

### Data Storage
- **Database**: PostgreSQL via Drizzle ORM
- **Schema Location**: `shared/schema.ts` defines orders and admins tables
- **Migrations**: Drizzle Kit for schema management (`drizzle-kit push`)

### Key Design Patterns
- **Shared Types**: Schema and route definitions shared between client and server via `@shared/*` path alias
- **Type-Safe API**: Zod schemas for request/response validation
- **Storage Interface**: Abstract `IStorage` interface with `DatabaseStorage` implementation for testability

### File Upload System
- **Client**: Uppy with AWS S3 plugin for direct uploads
- **Server**: Google Cloud Storage integration via Replit's object storage service
- **Flow**: Presigned URL pattern - client requests upload URL, then uploads directly to storage

## External Dependencies

### Database
- PostgreSQL (connection via `DATABASE_URL` environment variable)
- Drizzle ORM for query building and schema management

### Cloud Services
- Google Cloud Storage for file uploads (via Replit sidecar at `127.0.0.1:1106`)

### Discord Integration
- Discord.js bot for order placement via Discord server
- Requires `DISCORD_BOT_TOKEN` environment variable
- Bot handles modal-based order forms and channel messaging

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Express session encryption key
- `DISCORD_BOT_TOKEN` - Optional, for Discord bot functionality

### UI Component Library
- shadcn/ui (New York style) with Radix UI primitives
- Full component set in `client/src/components/ui/`