# BuySellCars Monorepo

A modern vehicle marketplace platform with separate instances for Zimbabwe and South Africa. Built with Next.js 15, React 19, and Turborepo for scalable development.

**Live Sites:**

- 🇿🇼 [Zimbabwe](https://buysellcars.co.zw/)
- 🇿🇦 South Africa (Coming Soon)

## Architecture

This is a **Turborepo monorepo** containing:

- **apps/** - Two Next.js applications
    - `buy-sell-cars-zimbabwe` - Zimbabwe marketplace instance with PostHog analytics
    - `buy-sell-cars-south-africa` - South Africa marketplace instance
- **packages/** - Shared packages and configurations
    - `shared` - Common UI components, hooks, utilities, and Panda CSS styling system
    - `eslint-config-custom` - Shared ESLint configuration
    - `prettier-config-custom` - Shared Prettier configuration

## Tech Stack

- **Framework:** Next.js 15 (App Router) with React 19
- **Styling:** Panda CSS with shared design tokens and styled-system
- **Database/Auth:** Supabase with TypeScript generated types
- **Payments:** Paystack integration
- **Analytics:** Vercel Analytics + PostHog (Zimbabwe only)
- **Testing:** Vitest with Testing Library
- **Package Manager:** pnpm with workspaces
- **Build System:** Turbo for orchestrating builds across packages
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm 10.0+
- Supabase projects (separate for each region)
- Paystack accounts (separate for each region)

### Installation & Setup

1. **Clone and install dependencies:**

    ```bash
    git clone <repository-url>
    cd buy-sell-cars
    pnpm install
    ```

2. **Environment setup:**

    - Copy `.env.example` to `.env` in each app directory, or
    - Run `vercel env pull` to pull from Vercel deployment

3. **Start development (all apps in parallel):**

    ```bash
    pnpm dev
    ```

4. **Start individual apps:**

    ```bash
    # Zimbabwe instance
    cd apps/buy-sell-cars-zimbabwe
    pnpm dev

    # South Africa instance
    cd apps/buy-sell-cars-south-africa
    pnpm dev
    ```

## Development Commands

### Root Level Commands

```bash
# Start all apps in development mode
pnpm dev

# Build all packages and apps
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

# Run full CI checks (lint + type-check + test + build)
pnpm ci:check

# Clean all build artifacts and node_modules
pnpm clean
```

### App-Specific Commands

Navigate to `apps/buy-sell-cars-zimbabwe` or `apps/buy-sell-cars-south-africa`:

```bash
# Development server
pnpm dev

# Production build and start
pnpm build
pnpm start

# Linting and type checking
pnpm lint
pnpm type-check
pnpm checks  # runs both lint and type-check

# Generate Supabase types
pnpm generate-supabase-types

# Generate Panda CSS styled-system
pnpm prepare

# Testing
pnpm test
pnpm test:ui
pnpm test:coverage
```

## Project Structure

```
buy-sell-cars/
├── apps/
│   ├── buy-sell-cars-zimbabwe/    # Zimbabwe marketplace
│   └── buy-sell-cars-south-africa/ # South Africa marketplace
├── packages/
│   ├── shared/                     # Shared components, hooks, utils
│   ├── eslint-config-custom/       # Shared ESLint config
│   └── prettier-config-custom/     # Shared Prettier config
├── scripts/                        # Build and deployment scripts
├── CLAUDE.md                      # AI assistant project guidance
├── turbo.json                     # Turbo build configuration
└── pnpm-workspace.yaml           # Workspace configuration
```

## Key Features

- **Shared Component System** - Reusable UI components with Panda CSS styling
- **Type-Safe Database** - Generated TypeScript types from Supabase
- **Multi-Region Support** - Separate instances for different markets
- **Modern Testing Setup** - Vitest + Testing Library integration
- **Optimized Builds** - Turbo caching for faster development
- **Strict Type Safety** - Full TypeScript coverage with strict configuration
