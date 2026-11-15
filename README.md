# SeatShare — Live Inventory Integration Starter

This project upgrades the original static SeatShare prototype with a live-search UI and a secure Node.js backend scaffold.

## What is implemented
- Original SeatShare responsive front end and join-only demo groups.
- New flight/bus live-inventory search form.
- Browser calls `POST /api/inventory/search` on the backend.
- Node.js/Express backend with request validation and a health endpoint.
- Provider credentials are expected only in server environment variables.
- Explicit `503` response while a provider is not configured; it does not invent fake live results.
- Explicit `501` response until the approved provider's documented API adapter is implemented.

## Important: this is NOT live inventory yet
No provider account, credentials, API documentation or booking contract has been supplied. Therefore the app cannot truthfully display live flight/bus availability yet. The backend deliberately refuses to fabricate results.

## Run locally
1. Install Node.js (LTS) on a computer.
2. Extract this folder.
3. Open a terminal in this folder and run:
   `npm install`
4. Copy `.env.example` to `.env` (leave credentials blank for now).
5. Run:
   `npm start`
6. Open `http://localhost:3000`.

The live search area will explain that provider configuration is required. The sample group cards are still clearly labelled as demo groups.

## What is needed to activate real inventory
For EACH transport type:
1. An authorised travel provider agrees to provide API access.
2. Obtain official API documentation, sandbox credentials, production credentials and commercial terms.
3. Confirm permitted use, caching/refresh rules, attribution, rate limits, booking handoff, cancellation/refund process and data-protection obligations.
4. Implement the provider-specific adapter in `server.js` using its exact documented authentication and request/response format.
5. Test only against the provider sandbox first.
6. Obtain provider approval before switching to production credentials.

Environment variables reserved:
- `FLIGHT_PROVIDER_API_URL`
- `FLIGHT_PROVIDER_API_KEY`
- `BUS_PROVIDER_API_URL`
- `BUS_PROVIDER_API_KEY`

Do not paste real API keys into `app.js`, `index.html`, GitHub, screenshots, or public chat. Do not commit `.env`.

## Deployment
This version needs a Node.js host for the backend; static-only hosting such as a basic GitHub Pages site cannot run `server.js`.
- Deploy this project to a Node.js-capable host (for example, a managed app service).
- Configure environment variables in that host's private dashboard.
- Use HTTPS.
- If hosting the front end separately, configure a fixed backend API URL and server-side CORS allowlist before deployment; do not use open CORS in production.

## Safety / business readiness
The current join-group flow is still a browser-only demo using localStorage. It does not securely collect requests or issue tickets. Do not accept real passenger data or payments until authentication, database storage, privacy notice, consent, support, cancellation/refund handling, provider contracts and security review are complete. Since the project owner is under 18, a parent/guardian should supervise provider applications, agreements, accounts and any payment or commercial arrangements.

A group reaching its target is not a confirmed booking, available seat or guaranteed discount.
