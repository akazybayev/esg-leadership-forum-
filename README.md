# ESG Leadership Forum 2027

Official multi-language event site for **ESG Leadership Forum 2027**  
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
| Dates, coordinator, scale | `content/site.json` |
| Delegate prices (early / standard / late) | `lib/pricing.ts` |
| Programme sessions | `content/program.json` |
| Speakers | `content/speakers.json` |
| Award nominations | `content/award.json` |
| Guest country package | `content/guest-country.json` |
| Expo zones / plan | `content/expo.json` |
| Partners packages | `content/partners.json` |
| UI chrome | `messages/{ru,en,kk}.json` |

All visitor-facing copy is localized. Kazakh strings need native-speaker review (`messages/kk.json`, key `_nativeSpeakerReview`: «требует проверки носителем языка»). The note is kept out of the public footer.

## Forms & payment (Stage 6)

`POST /api/forms/[type]` for register, award, youth-delegate, youth-pitch, expo, partners, guest-country, media, contact, newsletter.

- Validation: shared Zod schemas + React Hook Form
- Spam: honeypot. Each visitor may send `FORM_RATE_LIMIT_PER_HOUR` submissions per hour (default 3). The visitor is the first address in `X-Forwarded-For`. Later addresses are ignored, and a missing address shares one bucket. The whole site also stops at 15 submissions an hour, 40 a day, and 80 KB of stored text a day. Those counters are kept in the site database, so every server shares one limit. After a limit is reached, further requests are refused from memory until that window ends, and only a few checks may use the database at once. A body larger than 12 KB is refused before it is stored.
- A browser submission must come from this site. A page on another site is refused.
- Stored applications are encrypted with `FORM_STORE_KEY` and kept in the site database, not in a file the site can serve. The published site refuses to save an application until that key is set. A local run without the key keeps only the receipt id, form type and time.
- Static pages post forms to `/api/forms/[type]`. A submit does not put the fields in the page address.
- Promo: a delegate invoice is complimentary only when the code matches `PROMO_CODES` on the server. Any other code is rejected. An empty field pays the published price.
- Static pages post forms to `/api/forms/[type]`. A browser form is checked, then the visitor is sent to `/{locale}/received`. Names and contact details are not placed in the page address and are not sent to an outside form service.
- Optional notice: `FORM_WEBHOOK_URL` receives only the submission id, form type and time. Names, email, phone and invoice text stay in the site database.
- Delegates: invoice draft via `PAYMENT_PROVIDER=invoice` until a live gateway is connected. The KZT rate and card checkout (Visa/Mastercard, Kaspi) are not connected yet. This note stays in code and this README, not on the registration page.

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

Nadiya Dosmukhanova · +7 701 555 25 76 · forum@esgpartners.kz · WhatsApp https://wa.me/77015552576 · Telegram https://t.me/esg_school
