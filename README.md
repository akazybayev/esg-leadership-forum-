# ESG Leadership Forum Astana 2027

Official event site (Next.js App Router, TypeScript, Tailwind CSS, next-intl).

## Stage status

- **Stages 1–5:** scaffold, home, programme/speakers, award/youth/expo, registration/partners/attendees/media/legal, venue diagrams, guest-country package
- **Stage 6 (current):** React Hook Form + Zod, `/api/forms/[type]`, honeypot, rate limit, invoice payment adapter stub
- **Stage 7:** SEO, accessibility pass, final polish

## Run locally

```bash
npm install
cp .env.example .env.local   # optional
npm run dev
```

Open [http://localhost:3000/ru](http://localhost:3000/ru).

```bash
npm run build
npm run typecheck
```

## Forms & payment (Stage 6)

| Endpoint | Purpose |
| --- | --- |
| `POST /api/forms/register` | Guest/delegate registration (+ invoice draft for delegates) |
| `POST /api/forms/award` | ESG Award application |
| `POST /api/forms/youth-delegate` | Youth delegate |
| `POST /api/forms/youth-pitch` | Youth Impact Pitch |
| `POST /api/forms/expo` | Exhibitor request |
| `POST /api/forms/partners` | Partner package request |
| `POST /api/forms/guest-country` | Guest-country package request |
| `POST /api/forms/media` | Media accreditation |
| `POST /api/forms/contact` | Contact form |
| `POST /api/forms/newsletter` | Newsletter |

Behaviour:

- Client: React Hook Form + Zod (`schemas/forms.ts`)
- Server: same Zod schemas, honeypot fields ignored as “success”, per-IP rate limit (`FORM_RATE_LIMIT_PER_HOUR`)
- Storage: append-only `data/submissions/*.jsonl` (gitignored)
- Optional forward: `FORM_WEBHOOK_URL`
- Payment: `PAYMENT_PROVIDER=invoice` creates a draft invoice for delegate registrations until a live gateway is connected

## Change dates and prices (no code)

Edit [`content/site.json`](content/site.json):

- `dates.*` — arrival, forum days, award/pitch windows, early-bird end, announce dates
- `pricing.*` — guest / early / standard delegate USD
- `stage` — `before` | `during` | `after`
- `contact.*` — coordinator, phone, emails

## Add content later

| What | File |
| --- | --- |
| Session | `content/program.json` |
| Speaker | `content/speakers.json` |
| Award nomination | `content/award.json` |
| Guest country | `content/guest-country.json` |
| Sponsor logo | `content/sponsors.json` |
| UI chrome strings | `messages/{ru,en,kk}.json` |

All content fields that appear in the UI are localized (`ru` / `en` / `kk`). Kazakh copy needs native review.

## Client materials

See [`docs/`](docs/) and the checklist in [`docs/MISSING.md`](docs/MISSING.md).

## Dependencies (why each)

- `next`, `react`, `react-dom` — app framework
- `next-intl` — `/ru` `/en` `/kk` routing and messages
- `zod` — content + form validation
- `react-hook-form` + `@hookform/resolvers` — forms
- `framer-motion` — restrained motion
- `lucide-react` — icons
- `tailwindcss` — styling

## Font check (Kazakh)

Primary font: **Manrope** via `next/font` with `latin` + `cyrillic` subsets. Sample glyph coverage: `ә ғ қ ң ө ұ ү һ і`. Verify visually on `/kk`.
