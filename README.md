# C&S Car Rental

Premium car rental platform for Curaçao. Built with Next.js 14, Prisma, Supabase, Notion CMS, and Stripe payments.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Database | Supabase (PostgreSQL) via Prisma ORM |
| CMS | Notion API (car listings) |
| Payments | Stripe Checkout |
| Auth | NextAuth.js (credentials) |
| UI | Tailwind CSS + shadcn/ui |

## Project Structure

```
cs-car-rental/
├── prisma/
│   └── schema.prisma          # DB models: User, Car, Booking
├── src/
│   ├── app/
│   │   ├── (auth)/            # Login & Register pages
│   │   ├── api/               # API routes (auth, cars, bookings, stripe webhook)
│   │   ├── bookings/          # Customer booking history
│   │   ├── cars/              # Fleet listing + car detail
│   │   ├── dashboard/         # Admin dashboard
│   │   └── page.tsx           # Homepage
│   ├── components/
│   │   ├── ui/                # shadcn/ui components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   ├── CarCard.tsx
│   │   ├── BookingCard.tsx
│   │   └── BookingForm.tsx    # Booking + Stripe checkout flow
│   ├── lib/
│   │   ├── auth.ts            # NextAuth config
│   │   ├── notion.ts          # Notion API client
│   │   ├── prisma.ts          # Prisma singleton
│   │   ├── stripe.ts          # Stripe client
│   │   └── supabase.ts        # Supabase client
│   └── types/
│       └── index.ts
└── .env.local                 # Environment variables (not committed)
```

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/sahidattaf/cands-car-rental.git
cd cands-car-rental
npm install
```

### 2. Environment Variables

Copy the example file and fill in your credentials:

```bash
cp .env.example .env.local
```

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | Supabase → Settings → Database → Connection string (Transaction mode) |
| `DIRECT_URL` | Supabase → Settings → Database → Connection string (Session mode) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API |
| `NOTION_TOKEN` | [notion.so/my-integrations](https://www.notion.so/my-integrations) → Create integration |
| `NOTION_DATABASE_ID` | From the Notion database URL |
| `STRIPE_SECRET_KEY` | [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe dashboard |
| `STRIPE_WEBHOOK_SECRET` | `stripe listen --forward-to localhost:3000/api/webhooks/stripe` |
| `NEXTAUTH_SECRET` | Run: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `http://localhost:3000` (dev) |

### 3. Set up Notion

1. Create an integration at [notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Copy the **Internal Integration Token** → paste as `NOTION_TOKEN`
3. Open your Notion car database → **Share** → **Invite** → select your integration
4. The database must have these properties:

| Property | Type | Notes |
|---|---|---|
| `Name` | Title | Car name |
| `Brand` | Text | Make/manufacturer |
| `Model` | Text | |
| `Year` | Number | |
| `Category` | Select | ECONOMY, SUV, LUXURY, etc. |
| `Price Per Day` | Number | USD |
| `Seats` | Number | |
| `Transmission` | Select | AUTOMATIC / MANUAL |
| `Fuel` | Select | GASOLINE / DIESEL / ELECTRIC |
| `Available` | Checkbox | |
| `Description` | Text | |
| `Features` | Text | Comma-separated list |

### 4. Push Database Schema

```bash
npx prisma db push
npx prisma generate
```

### 5. Run Dev Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Stripe Webhooks (local dev)

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

Copy the webhook signing secret → paste as `STRIPE_WEBHOOK_SECRET` in `.env.local`.

## Key Features

- **Browse fleet** — Cars pulled live from your Notion database
- **Booking flow** — Date picker → price calculation → Stripe Checkout → booking confirmed via webhook
- **Authentication** — Email/password login with NextAuth.js + JWT sessions
- **My Bookings** — Customers see all their bookings with status tracking
- **Admin Dashboard** — Stats overview (cars, users, bookings, revenue)
- **Image uploads** — Supabase Storage for car photos

## Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run db:push      # Push Prisma schema to database
npm run db:generate  # Regenerate Prisma client
npm run db:studio    # Open Prisma Studio (database GUI)
```

## Deployment

Deploy to [Vercel](https://vercel.com):

1. Import the GitHub repo in Vercel
2. Add all environment variables from `.env.local`
3. Change `NEXTAUTH_URL` to your production domain
4. Set up a Stripe webhook pointing to `https://yourdomain.com/api/webhooks/stripe`

## License

Private — C&S Car Rental © 2025
