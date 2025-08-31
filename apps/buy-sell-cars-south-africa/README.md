# BuySellCars South Africa 🇿🇦

A modern vehicle marketplace platform for buying and selling vehicles in South Africa, part of the BuySellCars monorepo.

## Tech Stack 💻

- **Turbopack**
- **pnpm**
- **Backend / Auth / Database:** [Supabase](https://supabase.com/)
- **Payments:** [Paystack](https://paystack.com/)
- **Styling:** Panda CSS
- **Typescript**
- **Next.js 15** (App Router)
- **React 19.x**
- **Vercel** for hosting

## Getting Started 📦

### Prerequisites

- Node.js 18+
- pnpm
- Supabase project
- Paystack account

### Running the app

1. **From the monorepo root:**
   ```bash
   # Install all dependencies
   pnpm install
   
   # Start this app specifically
   cd apps/buy-sell-cars-south-africa
   pnpm dev
   ```

2. **Environment setup:**
   - Copy `.env.example` to `.env` in this app directory, or
   - Run `vercel env pull` from the app directory

3. **Generate Supabase types:**
   ```bash
   pnpm generate-supabase-types
   ```

4. **Generate Panda CSS styled-system:**
   ```bash
   pnpm prepare
   ```

## Features

- **Vehicle Listings** - Browse and search vehicles
- **User Authentication** - Secure login with Supabase Auth
- **Payment Processing** - Paystack integration for South Africa
- **Responsive Design** - Mobile-first approach with Panda CSS
- **Admin Dashboard** - Vehicle and user management
- **Vercel Analytics** - Performance and usage tracking

## Development Commands

```bash
# Development server
pnpm dev

# Production build
pnpm build
pnpm start

# Code quality
pnpm lint
pnpm lint:fix
pnpm type-check
pnpm checks  # runs lint + type-check

# Testing
pnpm test
pnpm test:ui
pnpm test:coverage

# Supabase types
pnpm generate-supabase-types

# Format code
pnpm format
```
