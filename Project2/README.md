# Diabetes Monitor

A proof-of-concept telemedicine web app for Type 2 diabetes self-monitoring, built with SvelteKit.

## What it does

- Log daily blood glucose readings with fasting/non-fasting context, optional weight, and notes
- Instant colour-coded feedback based on Danish clinical thresholds (green / yellow / red)
- 14-day trend view with a bar chart and scrollable history
- JWT-based login (httpOnly cookie, 24h expiry)
- All patient data stored in browser localStorage — no server-side database

## Running locally

```bash
npm install
npm run dev -- --host 127.0.0.1
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173).

Login: `admin` / `123456`

## Tech stack

- [SvelteKit](https://kit.svelte.dev/) — framework and routing
- [Tailwind CSS](https://tailwindcss.com/) + [DaisyUI](https://daisyui.com/) — styling
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) — JWT auth
