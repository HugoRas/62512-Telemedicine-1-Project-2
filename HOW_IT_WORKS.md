# How the Diabetes Monitor Works

A plain-language guide for anyone familiar with general IT concepts.

---

## What Is This System?

The Diabetes Monitor is a **web application** for patients with Type 2 diabetes. It runs in a browser and lets a patient:

- Log their daily blood glucose readings
- Get instant feedback on whether the reading is normal, elevated, or requires a doctor call
- Track their readings over the past 14 days in a chart

Think of it as a digital logbook with built-in clinical guidance, replacing a paper diary the patient might otherwise keep between doctor visits.

---

## The Two Halves: Server and Browser

Like most web apps, this system has two sides:

| Side | What it does |
|------|-------------|
| **Server** (runs in the background) | Handles login, checks that the user is actually logged in, and serves the web pages |
| **Browser** (runs on the patient's device) | Displays the interface, stores glucose data, and runs the clinical logic |

One important thing to know: **all the patient's data is stored locally in the browser** (in a built-in browser feature called `localStorage`). There is no central database or cloud storage. The data lives on the device the patient uses — if they clear their browser data or switch devices, the logs are gone.

---

## Logging In

When the patient opens the app, they see a login page. They enter a username and password, which are sent to the server.

The server checks whether the credentials are correct. If they are, it issues a **token** — think of it like a temporary digital stamp that proves "this person logged in correctly." The token is stored in a browser cookie (a small file the browser keeps) and is valid for 24 hours.

Every time the patient navigates to any page in the app, the server quickly checks: "Does this request have a valid token?" If yes, the page loads. If no (expired or missing), the patient is redirected back to the login screen.

This is a standard web security pattern called **JWT (JSON Web Token)** authentication.

---

## The Pages and What They Do

### Login (`/`)
The entry point. Accepts username and password, issues the token, and sends the patient to the dashboard.

### Dashboard (`/home`)
The first thing the patient sees after logging in. It shows:
- Their most recent glucose reading and its status (green/yellow/red)
- A warning if they have not logged a reading today
- Quick links to log a new reading or view history

### Log Glucose (`/log`)
A form where the patient enters their reading. The fields are:
- **Blood glucose** — the measured value in mmol/l
- **Fasting** — whether they've eaten in the last 8 hours (this affects what counts as "normal")
- **Weight** — optional
- **Notes** — any symptoms or observations (optional)

After submitting, the app immediately shows a colour-coded result card:
- **Green** — within normal range
- **Yellow** — elevated, keep an eye on it
- **Red** — contact a doctor

The reading is saved to the browser's local storage.

### History (`/history`)
Shows the last 14 readings as a bar chart. Each bar's height represents the glucose value, and the colour follows the same green/yellow/red system. Below the chart is a scrollable list with exact values, dates, and status labels.

### Logout
Clicking logout deletes the token cookie and returns the patient to the login screen.

---

## How the Clinical Feedback Works

The app applies Danish clinical thresholds to classify each reading:

| Situation | Normal | Elevated | Contact Doctor |
|-----------|--------|----------|----------------|
| **Fasting** (8+ hours since eating) | ≤ 7.0 mmol/l | 7.1 – 10.0 | > 10.0 |
| **Non-fasting** | ≤ 11.1 mmol/l | 11.1 – 15.0 | > 15.0 |

This logic lives entirely in the browser — no internet connection is needed to get feedback after the page has loaded.

---

## Where Data Lives

| Data | Where it's stored | How long |
|------|--------------------|----------|
| Glucose logs | Browser localStorage | Until manually cleared |
| Login token | Browser cookie | 24 hours, then expires |

Because there is no server-side database, the data is private to the device. No one else can access it remotely.

---

## Technology in Plain Terms

| What you see | What it actually is |
|---|---|
| The web pages and buttons | Built with **Svelte** — a tool for building interactive web UIs |
| The visual design (cards, badges, colours) | **Tailwind CSS + DaisyUI** — pre-made styling rules |
| The "stay logged in" mechanism | **JWT cookie** — a signed digital token the browser stores |
| The patient's data store | **Browser localStorage** — a key-value store built into every modern browser |
| The web server | **SvelteKit** — handles routing, login actions, and security checks |

---

## System at a Glance

```
Patient's Browser
├── Login page          → sends credentials to server
├── Dashboard           → reads today's logs from localStorage
├── Log Glucose page    → classifies reading, saves to localStorage
└── History page        → reads last 14 logs, draws bar chart

SvelteKit Server
├── Login handler       → validates credentials, issues JWT token
├── Route guard         → checks JWT token on every page request
└── Logout handler      → deletes JWT token, redirects to login
```

The server's only real job is **security** — making sure only logged-in users can see the app. Everything else (the data, the charts, the clinical feedback) happens directly in the patient's browser.

---

## Every File and What It Does

---

### Configuration & Project Setup

| File | What it does |
|------|-------------|
| `package.json` | The project's "ingredients list". Declares which software libraries the app depends on and defines the commands used to run, build, and check the code. |
| `svelte.config.js` | Tells the SvelteKit framework how to build and package the app for deployment. |
| `vite.config.js` | Configures the tool that compiles and bundles all the code into files a browser can actually run. |
| `jsconfig.json` | Lets the code editor understand shortcut paths (e.g. `$lib/store.js`) so developers get better autocomplete and error hints. |

---

### The HTML Shell

| File | What it does |
|------|-------------|
| `src/app.html` | The single HTML file that every page in the app is built on top of. It loads the visual design library (DaisyUI) from the internet and provides the bare `<html>` structure that Svelte fills in at runtime. |

---

### Server-Side Security

| File | What it does |
|------|-------------|
| `src/hooks.server.js` | Acts as a **security guard** that runs before every page loads. It reads the login token from the browser cookie and checks whether it is valid. If not, the user is sent back to the login screen. |
| `src/routes/+page.server.js` | Handles the **login form submission**. Receives the username and password, checks them, and if correct, creates and stores a login token in the browser. |
| `src/routes/logout/+server.js` | Handles **logging out**. Deletes the login token from the browser and redirects the user to the login screen. |

---

### Shared Business Logic

| File | What it does |
|------|-------------|
| `src/lib/store.js` | The brain of the app. Contains four key functions: reading saved glucose logs, saving a new log, checking whether the patient has already logged today, and classifying a glucose reading as normal, elevated, or critical based on Danish clinical guidelines. |
| `src/lib/index.js` | A placeholder file that marks the `lib` folder as a shared module. Currently empty. |

---

### Pages (what the patient sees)

Each page lives in its own folder under `src/routes/`. Every folder contains a `+page.svelte` file — the actual page the browser renders.

| File | What it does |
|------|-------------|
| `src/routes/+page.svelte` | The **login page**. Shows the username and password fields. On successful login the server redirects the patient to the dashboard. |
| `src/routes/+layout.svelte` | The **shared wrapper** that wraps every page. Loads the global stylesheet so all pages have consistent fonts and spacing. |
| `src/routes/layout.css` | The **global stylesheet**. Imports Tailwind CSS, which provides all the spacing, colour, and sizing rules used throughout the app. |
| `src/routes/home/+page.svelte` | The **dashboard**. Shows the latest glucose reading, a warning if nothing has been logged today, and quick-access buttons to the other sections. |
| `src/routes/log/+page.svelte` | The **glucose logging form**. Collects the reading (glucose, fasting flag, optional weight, optional notes), classifies it immediately, shows the colour-coded result, and saves it to the browser. |
| `src/routes/history/+page.svelte` | The **14-day trend view**. Fetches the last 14 logs from the browser, draws a colour-coded bar chart, and lists each entry with its date, value, and status label. |
