# ESG Leadership Forum Astana 2027

Official event site (Next.js App Router, TypeScript, Tailwind CSS, next-intl).

## Stage status

- **Stage 1 (current):** project scaffold, i18n `ru` / `en` / `kk` (default `ru`), design tokens (Palette A), header/footer, content schemas + JSON from the brief and `docs/`.
- Later stages: full home, program/speakers, award/youth/expo, registration, forms, SEO.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000/ru](http://localhost:3000/ru).

```bash
npm run build
npm run typecheck
```

## Change dates and prices (no code)

Edit [`content/site.json`](content/site.json):

- `dates.*` — arrival, forum days, award/pitch windows, early-bird end
- `pricing.*` — guest / early / standard delegate USD
- `stage` — `before` | `during` | `after`

## Add content later

| What | File |
| --- | --- |
| Session | `content/program.json` |
| Speaker | `content/speakers.json` |
| Award nomination | `content/award.json` |
| Sponsor logo | `content/sponsors.json` |
| UI chrome strings | `messages/{ru,en,kk}.json` |

All content fields that appear in the UI are localized (`ru` / `en` / `kk`). Kazakh copy needs native review.

## Client materials

See [`docs/`](docs/) and the checklist in [`docs/MISSING.md`](docs/MISSING.md).

## Dependencies (why each)

- `next`, `react`, `react-dom` — app framework
- `next-intl` — `/ru` `/en` `/kk` routing and messages
- `zod` — content + form validation
- `react-hook-form` + `@hookform/resolvers` — forms (Stage 6)
- `framer-motion` — restrained motion (later pages)
- `lucide-react` — icons
- `tailwindcss` — styling

## Font check (Kazakh)

Primary font: **Manrope** via `next/font` with `latin` + `cyrillic` subsets. Stage 1 sample string for glyph coverage: `ә ғ қ ң ө ұ ү һ і`. Verify visually on `/kk`.
