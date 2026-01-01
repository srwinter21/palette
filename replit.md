# Palette - Renovation Visualization & Cost Estimator

## Overview

Palette is a single-page web application for renovation visualization and cost estimation. Users upload a photo of their current space and an inspiration photo, select a budget tier, and receive a transformed design mockup with detailed cost breakdowns. The MVP uses mocked generation output (no real AI calls) with a simulated async delay.

**Core User Flow:**
1. Upload current space photo and inspiration photo
2. Select budget tier (Budget / Mid-range / Luxury)
3. Click "Generate design + estimate"
4. View: transformed design image, what was applied, cost estimate range, materials vs labor breakdown, and upgrade/savings tips

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework:** React with TypeScript (client-side rendering, not Next.js RSC)
- **Routing:** Wouter for lightweight client-side routing
- **State Management:** React Query (@tanstack/react-query) for server state, React useState for local UI state
- **Styling:** Tailwind CSS with CSS variables for theming, custom design tokens
- **UI Components:** shadcn/ui component library (Radix UI primitives + Tailwind)
- **Animations:** Framer Motion for smooth transitions and result reveals
- **Build Tool:** Vite with React plugin

### Backend Architecture
- **Runtime:** Node.js with Express
- **Language:** TypeScript (ESM modules)
- **API Pattern:** REST endpoints defined in shared/routes.ts with Zod validation
- **Database ORM:** Drizzle ORM with PostgreSQL dialect
- **Session Management:** express-session with connect-pg-simple for PostgreSQL session storage

### Data Flow
- Frontend sends POST to `/api/generate` with budget tier
- Backend validates input with Zod, simulates processing delay, returns mocked result
- Response includes: after image URL, applied changes list, cost estimate range, breakdown by category, upgrade/savings tips
- Images are handled client-side only (URL.createObjectURL for previews)

### Project Structure
```
client/           # React frontend
  src/
    components/   # UI components (UploadCard, BudgetSelector, ResultsView)
    components/ui/# shadcn/ui components
    hooks/        # Custom hooks (use-generation, use-toast)
    pages/        # Page components (Home, not-found)
    lib/          # Utilities (queryClient, utils)
server/           # Express backend
  index.ts        # Server entry point
  routes.ts       # API route handlers
  storage.ts      # Database access layer
  db.ts           # Drizzle database connection
shared/           # Shared code between client/server
  schema.ts       # Drizzle schemas and Zod types
  routes.ts       # API route definitions with validation
```

### Key Design Decisions

**Shared Type Definitions:** API routes and validation schemas are defined in `shared/routes.ts` using Zod, ensuring type safety between frontend and backend.

**Component Library:** Uses shadcn/ui (new-york style) for consistent, accessible UI components. Components are copied into the project for full customization.

**Mocked Generation:** The generate endpoint returns static mocked data with a 1.5-second simulated delay. Real AI integration would replace the mock response in `server/routes.ts`.

**Image Handling:** User-uploaded images stay client-side as blob URLs. The "after" image is a static Unsplash URL from the mock response.

## External Dependencies

### Database
- **PostgreSQL:** Primary database (connection via DATABASE_URL environment variable)
- **Drizzle ORM:** Type-safe SQL query builder and migrations
- **connect-pg-simple:** PostgreSQL session store for Express

### Key NPM Packages
- **@tanstack/react-query:** Async state management and caching
- **framer-motion:** Animation library for smooth UI transitions
- **zod:** Runtime type validation for API contracts
- **drizzle-zod:** Generates Zod schemas from Drizzle table definitions
- **lucide-react:** Icon library

### Build & Development
- **Vite:** Frontend build tool with HMR
- **esbuild:** Server bundling for production
- **tsx:** TypeScript execution for development

### Fonts (External CDN)
- DM Sans (body text)
- Outfit (headings)
- Google Fonts CDN