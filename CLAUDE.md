# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Architecture Overview

This is a Turborepo monorepo for Buy Sell Cars, a vehicle marketplace platform with separate instances for Zimbabwe and South Africa. The project uses Next.js 15 with React 19, Supabase for backend/auth, and Panda CSS for styling.

### Monorepo Structure
- **Root**: Contains workspace configuration and shared scripts
- **apps/**: Two Next.js applications (buy-sell-cars-zimbabwe, buy-sell-cars-south-africa)  
- **packages/**: Shared packages including UI components, configurations, and utilities
  - `packages/shared/`: Common components, hooks, utils, and styling system
  - `packages/eslint-config-custom/`: Shared ESLint configuration
  - `packages/prettier-config-custom/`: Shared Prettier configuration

### Tech Stack
- **Framework**: Next.js 15 (App Router) with React 19
- **Styling**: Panda CSS with shared design tokens and styled-system
- **Database/Auth**: Supabase with TypeScript generated types
- **Payments**: Paystack integration
- **Analytics**: Vercel Analytics + PostHog (Zimbabwe only)
- **Testing**: Vitest with Testing Library
- **Package Manager**: pnpm with workspaces
- **Build System**: Turbo for orchestrating builds across packages

## Development Commands

### Root Level Commands
```bash
# Install dependencies
pnpm install

# Start development (all apps in parallel)
pnpm dev

# Build all packages
pnpm build

# Run linting across all packages  
pnpm lint
pnpm lint:fix

# Type checking across all packages
pnpm type-check

# Run tests across all packages
pnpm test
pnpm test:ui
pnpm test:coverage

# Format code across all packages
pnpm format

# Clean all node_modules, .next, and .turbo directories
pnpm clean

# Run full CI checks (lint + type-check + test + build)
pnpm ci:check
```

### Application-Specific Commands
Navigate to `apps/buy-sell-cars-zimbabwe` or `apps/buy-sell-cars-south-africa`:

```bash
# Development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Lint and type-check together
pnpm checks

# Generate Supabase types
pnpm generate-supabase-types

# Generate Panda CSS
pnpm prepare
```

### Shared Package Commands
Navigate to `packages/shared`:

```bash
# Generate Panda CSS styled-system
pnpm prepare

# Run tests with UI
pnpm test:ui

# Generate test coverage
pnpm test:coverage
```

## Key Architecture Patterns

### Shared Package System
- `packages/shared` contains reusable components, hooks, utilities, and styling
- Both apps import from `~bsc-shared` workspace alias
- Panda CSS configuration is shared through `packages/shared/styles`
- Common UI components in `packages/shared/ui/` with recipe-based styling

### Supabase Integration  
- Server and client utilities in each app's `supabase/` directory
- Generated TypeScript types in `database.types.ts`
- Auth context provider wraps entire application
- Row Level Security (RLS) policies handle data access

### Styling Architecture
- Panda CSS with shared tokens, breakpoints, and text styles
- Recipe-based component variants (Button, Typography, etc.)
- Styled-system generated in each app's `styled-system/` directory
- Global CSS and theme configuration shared across apps

### Route Organization (Next.js App Router)
- Route groups: `(auth)`, `(paystack)`, `(vehicle-pages)`
- Parallel routes for different vehicle categories
- Admin dashboard with protected routes
- API routes for webhooks and integrations

## Important Notes

### Testing
- Use Vitest for unit testing with jsdom environment  
- Testing Library React for component testing
- Setup file at `src/test/setup.ts` in each app

### Environment Setup
- Copy `.env.example` or run `vercel env pull`
- Each app has separate Supabase project IDs
- Different Paystack configurations per region

### Type Safety
- Strict TypeScript configuration
- Generated Supabase types for database schema
- Zod schemas for form validation and API contracts

### Performance
- Turbo caching for faster builds
- Shared dependencies reduce bundle duplication
- Next.js 15 optimizations with App Router

### Code Organization
- Server actions in `src/server/actions/`
- Shared schemas in `src/schemas/`
- Utility functions organized by domain
- Component co-location with styles and tests