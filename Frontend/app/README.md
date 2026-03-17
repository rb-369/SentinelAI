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
VITE_API_URL=https://sentinelai-backend-server.onrender.com/api
```

Note: Frontend calls only the backend URL above. The AI service URL (`https://sentinelai-1-ehft.onrender.com`) is configured in backend via `AI_SERVICE_URL`.

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
