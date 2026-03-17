# sentinelAI Frontend

This folder contains the sentinelAI React + Vite frontend.

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

## Environment

Create `Frontend/app/.env` from `Frontend/app/.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Main Routes

- `/` : Threat dashboard
- `/area-intelligence` : Scams/Frauds Happening In Your Area

## Render Static Hosting Note

Add this rewrite in Render settings so route refresh works:
- Source: `/*`
- Destination: `/index.html`
- Action: `Rewrite`

For full setup and deployment instructions, see the repository root README:
- `README.md`
