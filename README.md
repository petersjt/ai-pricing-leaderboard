Here’s a drop-in README.md you can paste into the new repo to get Codex moving fast.

⸻

AI Pricing Leaderboard

A community-maintained leaderboard that tracks, compares, and normalizes AI model pricing (input/output tokens, images, audio, tools, batch, fine-tuning, etc.) across providers and regions—optimized for clarity and apples-to-apples comparisons.

Inspiration: the usability of model leaderboards like lmarena, but focused on costs and effective price per task rather than raw benchmarks.

⸻

✨ Goals
	•	Unified pricing view across providers (OpenRouter, OpenAI, Anthropic, Google, Mistral, Cohere, Groq, etc.).
	•	Normalization to common units (e.g., $/1M input tokens, $/1M output tokens, $/image @ X resolution).
	•	Effective price calculators for common tasks (e.g., “summarize 3k tokens,” “RAG answer 12k tokens,” “generate 4 images 1024×1024”).
	•	Change tracking: when prices update, show diffs, date, and source link.
	•	Simple API for embedding in blogs/dashboards and for CI budget guards.

🚫 Non-Goals (MVP)
	•	Performance benchmarks (latency/quality) beyond price context.
	•	Full multi-currency support (MVP: USD, with later FX).
	•	Provider account management/billing integrations.

⸻

🧭 Product (MVP)
	1.	Leaderboard Page
	•	Sort/filter by provider, model family, context length, availability, modality, price.
	•	Columns: Provider | Model | Input $/1M tok | Output $/1M tok | Context | Modality | Source | Last Updated.
	2.	Model Detail
	•	Raw pricing table (tiers, free quotas), normalization, example task calculators.
	3.	API
	•	GET /api/models (list + filters)
	•	GET /api/models/:id
	•	GET /api/providers
	4.	Admin (private)
	•	Manual entry + source URL
	•	Approve pending changes from scrapers/PRs

⸻

🏗️ Tech Stack (suggested)
	•	Web: Next.js 15 (App Router) + TypeScript + Tailwind
	•	DB: Postgres (Supabase or local pg)
	•	ORM: Prisma
	•	Jobs: Node workers / cron via Next.js Route Handlers (or Supabase cron)
	•	CI: GitHub Actions
	•	Package: pnpm

Swap components freely; README is structured so Codex can scaffold with these defaults.

⸻

📂 Repository Structure

ai-pricing-leaderboard/
├─ apps/web/                 # Next.js app (public site + admin routes)
│  ├─ app/(public)/
│  ├─ app/(admin)/
│  ├─ components/
│  └─ lib/
├─ packages/db/              # Prisma schema + client
├─ packages/scrapers/        # Source-specific scrapers & normalizers
├─ packages/types/           # Shared TypeScript types/schemas (zod)
├─ packages/utils/           # Shared helpers (currency, units)
├─ prisma/                   # Migrations (if not colocated)
├─ .github/workflows/        # CI
├─ .env.example
└─ README.md


⸻

🗃️ Data Model (Prisma sketch)

// packages/db/schema.prisma
datasource db { provider = "postgresql"; url = env("DATABASE_URL") }
generator client { provider = "prisma-client-js" }

model Provider {
  id           String   @id @default(cuid())
  name         String   @unique
  slug         String   @unique
  websiteUrl   String?
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  models       Model[]
}

model Model {
  id                String   @id @default(cuid())
  providerId        String
  provider          Provider  @relation(fields: [providerId], references: [id])
  name              String
  slug              String
  modality          Modality  // "text" | "image" | "audio" | "multimodal" | "tool"
  contextTokens     Int?
  isPublic          Boolean   @default(true)
  pricingRevisions  PricingRevision[]
  latestPricingId   String?
  latestPricing     PricingRevision? @relation("LatestPricing", fields: [latestPricingId], references: [id])
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt

  @@unique([providerId, name])
}

model PricingRevision {
  id                 String   @id @default(cuid())
  modelId            String
  model              Model    @relation(fields: [modelId], references: [id])
  sourceUrl          String
  sourceNote         String?
  // Raw prices as published by provider (per 1K tokens, per 1M, per image, etc.)
  unit               PriceUnit // "per_1k_tok" | "per_1m_tok" | "per_image" | "per_min_audio" | ...
  inputPriceUsd      Float?   // raw unit price
  outputPriceUsd     Float?
  imagePriceUsd      Float?
  audioPriceUsd      Float?
  currency           String   @default("USD")
  // Normalized to common denominators for comparison
  normInputPer1M     Float?
  normOutputPer1M    Float?
  normImage1024      Float?   // normalized 1024×1024 single image
  normAudioPerMin    Float?
  effectiveNotes     String?
  effectiveExamples  Json?    // canned “task cost” examples
  validFrom          DateTime @default(now())
  validTo            DateTime?
  createdAt          DateTime @default(now())
}

enum Modality {
  text
  image
  audio
  multimodal
  tool
}

enum PriceUnit {
  per_1k_tok
  per_1m_tok
  per_image
  per_min_audio
  per_call
}


⸻

🔢 Normalization Rules (initial)
	•	Tokens: convert all token pricing to $/1,000,000 tokens (both input and output).
	•	Images: normalize to $/image @ 1024×1024; if tiers exist, choose pay-as-you-go or note tier in effectiveNotes.
	•	Audio: normalize to $/minute (16 kHz mono assumption unless otherwise noted).
	•	Batch tools/fine-tuning: store raw; exclude from leaderboard columns (MVP).
	•	Rounding: display to 4 decimals; store as Float with full precision.

⸻

🧮 Effective Price Examples (display helpers)
	•	“Summarize 3k tokens prompt → 500 tokens output”
	•	“RAG answer 12k tokens prompt → 800 tokens output”
	•	“Image generation: 1× 1024×1024”
	•	“Transcription: 10 minutes audio”

Store these templates in effectiveExamples and compute per model using normalization fields.

⸻

🌐 Sources & Scrapers
	•	Start with manual entries + source URLs.
	•	Add scrapers in packages/scrapers with one file per provider:
	•	openai.ts, anthropic.ts, google.ts, mistral.ts, cohere.ts, groq.ts, openrouter.ts, etc.
	•	Each scraper exports:
	•	fetchRaw(): ProviderRawPricing[]
	•	normalize(raw): PricingRevision
	•	diff(old, next): PricingDiff

Legal/Ethics: Only scrape publicly available docs that permit automated access; respect robots.txt & rate limits, attribute sources, and prefer official JSON docs where available.

⸻

🔌 API (MVP)

GET /api/providers
GET /api/models?provider=groq&modality=text&sort=price_in
GET /api/models/:id
GET /api/changes?since=2025-01-01

Response shape (simplified):

type ModelRow = {
  id: string
  provider: string
  model: string
  modality: 'text'|'image'|'audio'|'multimodal'|'tool'
  contextTokens?: number
  inputPer1M?: number
  outputPer1M?: number
  image1024?: number
  audioPerMin?: number
  sourceUrl: string
  lastUpdated: string
}


⸻

🚀 Local Dev Quickstart

pnpm i
pnpm dlx prisma generate
pnpm dlx prisma migrate dev
pnpm --filter @apl/web dev

Environment

Copy .env.example → .env and set:

# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_pricing_leaderboard"

# Next.js
NEXT_PUBLIC_SITE_URL="http://localhost:3000"

# (Optional) Supabase if used
SUPABASE_URL=""
SUPABASE_ANON_KEY=""


⸻

🧪 Scripts

// root package.json (example)
{
  "scripts": {
    "dev": "pnpm -C apps/web dev",
    "build": "pnpm -C apps/web build",
    "start": "pnpm -C apps/web start",
    "db:gen": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "scrape": "ts-node packages/scrapers/run.ts",
    "lint": "eslint .",
    "typecheck": "tsc -b --pretty"
  }
}


⸻

🧹 Quality
	•	Types: strict TypeScript
	•	Schema: zod validation on API boundaries
	•	Lint/Format: ESlint + Prettier
	•	Tests: Vitest on utils, integration tests on normalization

⸻

🔒 Security & Compliance
	•	No provider credentials stored server-side for public scraping.
	•	Attribute every price to a source URL + timestamp.
	•	Keep a CHANGELOG.md or DB table for diffs.

⸻

🗺️ Roadmap
	•	MVP schema + seed with 10–15 popular models
	•	Public leaderboard UI + sorting/filtering
	•	Effective price calculators (preset tasks)
	•	“Price changed” diff view per model
	•	Basic JSON API + rate limiting
	•	CSV export
	•	FX conversion (EUR/JPY) with daily rates
	•	Alerts: “notify me if model X drops > Y%”
	•	Embedded widget script (copy-paste)

⸻

🤝 Contributing

PRs welcome! Please include:
	•	Source links for any pricing edits
	•	Before/after screenshots for UI changes
	•	Unit tests for normalization helpers

⸻

📄 License

MIT (proposed). If you need a different license, update this section and LICENSE accordingly.

⸻

📬 Contact

Issues/ideas: open a GitHub Issue in this repo.
Built by Jay Peters (@petersjt) and contributors.

⸻

Notes for Codex (scaffolding hints)
	•	Generate monorepo with apps/web, packages/db, packages/scrapers, packages/types, packages/utils.
	•	Next.js app with App Router, Tailwind, basic table view, server actions for Admin (behind env-guard).
	•	Prisma models above + seed script for a few providers.
	•	Create zod schemas matching ModelRow and normalization helpers.
	•	Add scrapers/openrouter.ts first (easy mapping), then others.
