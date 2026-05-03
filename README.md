# Diabetes Monitor — Telemedicine Project 2

A proof-of-concept telemedicine web application for patients with Type 2 diabetes. Built as part of course 62512 at DTU.

## Overview

The app gives patients a simple way to self-monitor their condition between clinical visits. It runs entirely in the browser — no cloud database, no app installation required.

**Core features:**
- Log daily blood glucose readings (fasting or non-fasting)
- Instant colour-coded feedback based on Danish clinical thresholds
- Optional weight and free-text notes per entry
- 14-day trend chart with full history
- Secure login via JWT

## Running locally

```bash
cd Project2
npm install
npm run dev -- --host 127.0.0.1
```

Open [http://127.0.0.1:5173](http://127.0.0.1:5173) in your browser.

Login: `admin` / `123456`

## Tech stack

| Layer | Technology |
|---|---|
| Framework | SvelteKit |
| Styling | Tailwind CSS + DaisyUI |
| Auth | JWT (httpOnly cookie) |
| Storage | Browser localStorage |

## Clinical thresholds

| Measurement | Normal | Elevated | Contact doctor |
|---|---|---|---|
| Fasting | ≤ 7.0 mmol/l | 7.1–10.0 | > 10.0 |
| Non-fasting | ≤ 11.1 mmol/l | 11.1–15.0 | > 15.0 |

Based on Danish endocrinology guidelines.
