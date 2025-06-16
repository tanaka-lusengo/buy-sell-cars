# BuySellCars Mono Repo

A modern rebuild of the Buy Sell Cars application, a platform for buying and selling vehicles.

With instances in [Zimbabwe](https://buysellcars.co.zw/) & South Africa (WIP)

## Tech Stack 💻

- **Turbopack**
- **pnpm**
- **Backend / Auth / Database:** Supabase
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

- Copy over the `.env.example` in the root folder and rename it to `.env`.
- Or, run `vercel env pull` to pull environment variables from the Vercel deployment

```bash
pnpm install
cd apps/buy-sell-cars-zimbabwe
pnpm dev
```

or

```bash
pnpm install
cd apps/buy-sell-cars-south-africa
pnpm dev
```
