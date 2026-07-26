# Rekastaff Landing

Marketing site for [rekastaff.com](https://rekastaff.com).

HRD / dashboard app lives separately at [hrd.rekastaff.com](https://hrd.rekastaff.com).

## Getting started

```bash
cp .env.example .env
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Env

| File | Dipakai saat |
|---|---|
| `.env` | Development (`npm run dev`) — jangan di-commit |
| `.env.production` | Production (`npm run build` / `npm start`) |
| `.env.example` | Template untuk dokumentasi |

```bash
cp .env.example .env
npm install
npm run dev
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | URL site landing ini |
| `NEXT_PUBLIC_HRD_URL` | Base URL app HRD (target CTA login) |
| `NEXT_PUBLIC_API_URL` | Base URL API (`…/api/`) |
