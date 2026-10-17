# NamazGo

Prayer times for every Muslim, everywhere in the world.

A Progressive Web App built with React, Vite, Tailwind CSS, and the free [Aladhan API](https://aladhan.com/prayer-times-api).

## Features

- Auto-detect location (GPS) for instant prayer times
- Shareable city URLs (`/prayer-times/karachi`)
- Search any city worldwide
- Live countdown to next prayer
- Hijri + Gregorian dates
- Qibla direction compass
- Ramadan Sehri & Iftar times
- Dark / light mode
- Favorite cities (saved locally)
- 5 calculation methods + Hanafi Asr option
- Installable PWA with offline cache
- SEO: Open Graph, sitemap, robots.txt, JSON-LD

## Getting Started

```bash
yarn
yarn dev
```

Open [http://localhost:5173](http://localhost:5173)

## Build

```bash
yarn build
yarn preview
```

## Deploy

Deploy the `dist` folder to [Vercel](https://vercel.com) for free.

After deploy:

1. Point your domain (e.g. `namazgo.app`) at Vercel
2. Add the property in [Google Search Console](https://search.google.com/search-console)
3. Submit `https://your-domain/sitemap.xml`

Update `SITE_URL` references in `index.html`, `public/robots.txt`, `public/sitemap.xml`, and `src/hooks/useDocumentMeta.js` if your domain differs from `namazgo.app`.
