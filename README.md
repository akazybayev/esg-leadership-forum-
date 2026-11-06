# ESG Leadership Forum Astana 2027

Official multi-language event site for **ESG Leadership Forum Astana 2027**  
*(Leadership for Generations / Лидерство ради поколений / Ұрпақтар үшін көшбасшылық)*  
13–14 October 2027 · Hilton Astana · Organizer: Global ESG Partnership

Stack: **Next.js App Router**, TypeScript, Tailwind CSS, **next-intl** (`ru` default, `en`, `kk`).

## Stage status

| Stage | Status |
| --- | --- |
| 1 Scaffold, i18n, tokens, schemas | Done |
| 2 Homepage | Done |
| 3 Programme + speakers | Done |
| 4 Award / youth / expo | Done |
| 5 Register, partners, attendees, media, legal | Done |
| 6 Forms API + invoice stub | Done |
| **7 SEO, a11y, performance, README** | **Done** |

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
npm run lint
```

## Content without code

| Change | File |
| --- | --- |
| Dates, prices, coordinator, scale | `content/site.json` |
| Programme sessions | `content/program.json` |
| Speakers | `content/speakers.json` |
| Award nominations | `content/award.json` |
| Guest country package | `content/guest-country.json` |
| Expo zones / plan | `content/expo.json` |
| Partners packages | `content/partners.json` |
| UI chrome | `messages/{ru,en,kk}.json` |

All visitor-facing copy is localized. Kazakh strings need native review.

Client materials and open TODOs: [`docs/`](docs/), [`docs/MISSING.md`](docs/MISSING.md).

## Forms & payment (Stage 6)

`POST /api/forms/[type]` for register, award, youth-delegate, youth-pitch, expo, partners, guest-country, media, contact, newsletter.

- Validation: shared Zod schemas + React Hook Form
- Spam: honeypot + per-IP hourly rate limit
- Storage: `data/submissions/*.jsonl` (gitignored)
- Optional CRM: `FORM_WEBHOOK_URL`
- Delegates: invoice draft via `PAYMENT_PROVIDER=invoice` until a live gateway is connected

## SEO & accessibility (Stage 7)

- Per-locale metadata, Open Graph, Twitter cards, hreflang alternates
- `sitemap.xml`, `robots.txt`
- schema.org **Event** JSON-LD (dates, venue, offers, organizer)
- Skip link, labelled landmarks, visible `:focus-visible`, `prefers-reduced-motion`
- `lang` on `<html>`, main landmark `#main-content`

Set `NEXT_PUBLIC_SITE_URL` in production for canonical URLs and the sitemap.

## Design

Palette A — Horizon Deep (`#0B1F2A`) + accent (`#C45C26`), Manrope with Cyrillic (Kazakh glyphs `ә ғ қ ң ө ұ ү һ і`). Venue photos and floor plan: `public/images/venue/`.

## Key routes

`/ru`, `/program`, `/award`, `/youth`, `/expo`, `/guest-country`, `/register`, `/partners`, `/attendees`, `/media`, `/contact`

## Coordinator

Nadiya Dosmukhanova · +7 777 655 5860 · esg@inbox.eu · forum@esgpartners.kz
