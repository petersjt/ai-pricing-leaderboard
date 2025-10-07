# AI Pricing Leaderboard

This monorepo hosts a minimal pricing leaderboard for major AI model providers. It is built with Next.js 15, Tailwind CSS, and Prisma with PostgreSQL. The MVP ships with mock data and seeds so you can explore the UI immediately while preparing real scraping integrations.

## Stack

- **Apps**: `apps/web` – Next.js 15 (App Router) with Tailwind CSS and TypeScript.
- **Database**: PostgreSQL accessed via Prisma inside `packages/db`.
- **Shared packages**:
  - `packages/types` – common Zod schemas and TypeScript types.
  - `packages/utils` – helper utilities (formatting, etc.).
  - `packages/scrapers` – placeholder modules for future pricing scrapers.

The repository uses pnpm workspaces to link packages together.

## Getting started

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Provide a `DATABASE_URL` in a `.env` file at the repository root. Example for a local PostgreSQL instance:

   ```bash
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_pricing"
   ```

3. Push the Prisma schema and generate the client:

   ```bash
   pnpm db:migrate
   pnpm db:generate
   ```

4. Seed the database with the included mock provider/model data:

   ```bash
   pnpm db:seed
   ```

5. Start the development server:

   ```bash
   pnpm dev
   ```

   Visit [http://localhost:3000](http://localhost:3000) to see the seeded leaderboard.

## Project structure

```
.
├── apps
│   └── web               # Next.js frontend (App Router)
├── packages
│   ├── db                # Prisma client, schema, seed helpers
│   ├── scrapers          # Placeholder provider scrapers
│   ├── types             # Zod schemas and shared TS types
│   └── utils             # Formatting helpers
└── pnpm-workspace.yaml
```

## Next steps

- Wire up real scrapers inside `packages/scrapers` to populate the database automatically.
- Expand API routes with filtering, pagination, and historical trend endpoints.
- Add authentication/role-based access for managing provider data.
- Layer in charts for historical price movements and provider comparisons.
- Set up automated tests and linting pipelines with CI.
