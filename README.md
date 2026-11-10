# Red Hawk Canyon HOA website

The website for the Red Hawk Canyon Owners Association in Wenatchee, WA. It replaces the old Google Site with a fast, mobile-friendly site built with Next.js and hosted on Vercel.

## What's on the site

| Page | What it does |
| --- | --- |
| `/` | Neighborhood news, about the HOA, quick links, upcoming events |
| `/irrigation` | Searchable watering schedule (pulled live from Google Sheets), irrigation FAQs, fall line-blowout services |
| `/calendar` | Upcoming and past events (pulled live from Google Calendar), embedded calendar, subscribe links |
| `/documents` | CC&R PDF download, online viewer, and plain-language highlights |
| `/faq` | General and irrigation FAQs |
| `/board` | Board roster and contact |
| `/spraying` | Spraying services (placeholder) |
| `/contact` | Email links by topic |

Old Google Sites paths (`/home`, `/bylaws`, `/hoa-faqs`, `/board-members`) redirect to the new pages.

## How to update content

### Things that update themselves (no code changes)

- **Irrigation schedule**: edit the [Google Sheet](https://docs.google.com/spreadsheets/d/1jF-JidSQo60WvgZKz7eUN-xlZmt1ISDhN7Ga4ZyTgWQ). The site re-checks it every 15 minutes. Keep the same layout: street headings end with a colon (`Yarrow Road:`), each home row is `Address (Name)` in column A and the time in column B, and the `Dated:` row shows as "Last updated". The sheet must stay shared as "Anyone with the link can view".
- **Events**: add them to the `redhawkcanyonhoa@gmail.com` Google Calendar. The calendar must stay public. Events show up within 15 minutes.

### Everything else

All other text lives in one file: [`src/content/site.ts`](src/content/site.ts). Edit it on GitHub (pencil icon), commit, and Vercel redeploys in about a minute.

- **Post news**: add an item to the top of `announcements`. Add an `expires` date if it should disappear on its own.
- **Board members**: add entries to `board`, e.g. `{ name: "Jane Doe", role: "President" }`.
- **FAQs**: edit `faqs` or `irrigation.faqs`.
- **Blowout vendors**: edit `irrigation.blowoutVendors`.
- **New documents**: drop the PDF in `public/documents/` and add an entry to `documents`.
- **Photos**: images live in `public/images/` and are listed in `photos`. The current photos are from Wikimedia Commons under CC BY-SA licenses, which require the credit line the footer shows automatically. If you replace one with your own photo, update its entry (you can drop the author and license fields for photos you own).

## AI and search friendliness

- `/llms.txt`: short site summary and index for AI assistants ([llms.txt convention](https://llmstxt.org)).
- `/llms-full.txt`: the whole site as one Markdown file, including the live irrigation schedule and events.
- `/api/irrigation-schedule` and `/api/events`: JSON versions of the live data.
- Structured data (schema.org `Organization`, `FAQPage`, `Event`), `sitemap.xml`, `robots.txt`, semantic HTML, and per-page titles and descriptions.

## Local development

Requires Node 22.

```bash
npm install
npm run dev
```

Open http://localhost:3000. Run `npm run build` to check a production build.

## Deploying on Vercel

1. In Vercel, choose **Add New > Project** and import this GitHub repository. The defaults (Next.js, `npm run build`) are correct.
2. Optional: set `NEXT_PUBLIC_SITE_URL` if the site will live somewhere other than `https://www.redhawkcanyonhoa.com`.
3. Under **Settings > Domains**, add `redhawkcanyonhoa.com` and `www.redhawkcanyonhoa.com`, then update the DNS records at your domain registrar as Vercel instructs. This replaces the Google Sites custom-domain records.
4. Once the new site is live, unpublish or remove the custom domain from the Google Site.
