# Deploy AcrossTime as one Cloudflare Worker

The React SPA, API and D1 binding are deployed as one Worker using Workers Static
Assets. Browser routes are served from the React build and `/api/*` is handled by
the Worker script. Because both use the same origin, production CORS and separate
Pages/API URLs are unnecessary.

## Architecture

```text
https://acrosstime.<account>.workers.dev/
├── /, /register, /homepage, ...  React static assets
└── /api/*                        Worker API → D1
```

## Prerequisites

- Node.js 22 or newer
- A Cloudflare account
- Wrangler authenticated with `npx wrangler login`

## 1. Apply the D1 migration

The D1 database ID is already set in `cloudflare/wrangler.jsonc`.

```sh
cd cloudflare
npm install
npm run db:remote
```

## 2. Deploy the complete application

From `cloudflare/` run:

```sh
npm run deploy:check
npm run deploy
```

The deploy script first builds `my-react-app`, then Wrangler uploads that build as
Static Assets and deploys the API script with its D1 binding. Wrangler prints the
production URL, for example:

```text
https://acrosstime.YOUR-WORKERS-SUBDOMAIN.workers.dev
```

Test the API at:

```text
https://acrosstime.YOUR-WORKERS-SUBDOMAIN.workers.dev/api/health
```

## 3. Configure Google Sign-In

In Google Cloud Console, open **Google Auth Platform → Clients**, select the Web
client ending in:

```text
1075678670548-1i330iun823bu7pgl1q45fng69ic91eu.apps.googleusercontent.com
```

Add the exact Worker origin under **Authorized JavaScript origins**. Include only
the scheme and hostname: no trailing slash and no path.

```text
https://acrosstime.YOUR-WORKERS-SUBDOMAIN.workers.dev
```

Keep `http://localhost:3000` for local development.

## Git-based automatic deployments (optional)

In Cloudflare choose **Workers & Pages → Create application → Import a repository**,
connect `aiyoshida/ProjectLab-meeting-app`, and use `main` as the production
branch. Set **Root directory** to `cloudflare`, then configure the two build steps:

```sh
# Build command
npm --prefix ../my-react-app ci && npm run build:frontend

# Deploy command
npx wrangler deploy
```

No React production environment variables are required. The frontend defaults to
the same-origin `/api` endpoint.

## Email

Email delivery is intentionally disabled so the application stays within the
Workers Free plan. After creating a meeting, the frontend copies a sharing URL that
can be sent to participants with any messaging application.

## Local development

The React development server and Worker can run separately. `.env.local` already
points React to the local API. In two terminals run:

```sh
cd cloudflare
npm run db:local
npm run dev
```

```sh
cd my-react-app
npm start
```

For a production-like local test, build the frontend and start Wrangler, then open
the Wrangler URL:

```sh
cd cloudflare
npm run build:frontend
npm run dev
```
