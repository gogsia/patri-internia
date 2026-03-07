# External Integrations

**Analysis Date:** 2026-03-07

## APIs & External Services

**AI / 3D Generation:**
- TripoSR (Stability AI) - Photo-to-3D model conversion
  - SDK/Client: Custom Python service in `triposr-service/server.py`; model loaded from Hugging Face (`stabilityai/TripoSR`)
  - Auth: `TRIPOSR_API_TOKEN` env var (optional Bearer token)
  - Next.js proxy: `src/app/api/convert-photo/route.ts` (Edge runtime) forwards requests to the local service
  - Client hook: `src/hooks/usePhotoTo3D.ts` posts to `/api/convert-photo`
  - Protocol: multipart/form-data upload → JSON response with `glbUrl`; supports polling via `statusUrl`

**Social Sharing:**
- Twitter / X - Share design via tweet
  - Implementation: `src/lib/share.ts` — opens `https://twitter.com/intent/tweet?text=...` in new tab as fallback when Web Share API is unavailable
  - No API key required (intent URL only)
  - Primary path: Web Share API (`navigator.share`) used first when available

**3D Model Assets:**
- Three.js GLTF/GLB loader (via `@react-three/drei` `useGLTF`) - loads local and remote `.glb` models
  - Used in: `src/hooks/useModelLoader.ts`, `src/components/3d/EditableFurniture.tsx`
  - Model files: served from `public/` directory (local models) or dynamic URLs from TripoSR

## Data Storage

**Databases:**
- None — no backend database

**Browser Storage:**
- localStorage (browser-native)
  - Key: `solarpunk-layouts-v1`
  - Implementation: `src/lib/storage.ts`
  - Stores: serialized `RoomLayout` objects (furniture positions, materials, metadata)
  - Operations: `getLayouts()`, `saveLayout()`, `removeLayout()`

**File Storage:**
- TripoSR output directory: `triposr-service/output/` — generated `.glb` files served at `http://127.0.0.1:8000/output/{uuid}.glb`
- No cloud file storage

**Caching:**
- In-memory model cache: `src/hooks/useModelLoader.ts` — `modelCache` object tracks preloaded GLTF paths
- drei's built-in GLTF cache via `useGLTF` and `useGLTF.preload`
- No Redis or CDN caching configured

## Authentication & Identity

**Auth Provider:**
- None — no user authentication system

**TripoSR Service Auth:**
- Optional Bearer token via `TRIPOSR_API_TOKEN` env var
- Verified in `triposr-service/server.py` `verify_token()` function and forwarded by `src/app/api/convert-photo/route.ts`

## Monitoring & Observability

**Error Tracking:**
- None — no Sentry, Datadog, or equivalent

**Logs:**
- `console.log` / `console.error` in development (browser devtools)
- Python `print()` statements in TripoSR service (`triposr-service/server.py`)
- No structured logging or log aggregation

## CI/CD & Deployment

**Hosting:**
- Vercel (`vercel.json` declares `"framework": "nextjs"`)
- TripoSR microservice: self-hosted only; not deployable to Vercel

**CI Pipeline:**
- None detected — no GitHub Actions, CircleCI, or equivalent config files

## Environment Configuration

**Required env vars:**
- `TRIPOSR_API_URL` — Points to local TripoSR service (e.g., `http://127.0.0.1:8000`); photo-to-3D feature is disabled without this

**Optional env vars:**
- `TRIPOSR_API_TOKEN` — Adds Bearer auth to TripoSR requests
- `NEXT_PUBLIC_API_URL` — Client-visible API base URL

**Secrets location:**
- `.env.local` (gitignored) — see `.env.local.example` for required vars

## Webhooks & Callbacks

**Incoming:**
- None

**Outgoing:**
- None

## Browser APIs Used

- `localStorage` — layout persistence (`src/lib/storage.ts`)
- `navigator.share` — Web Share API for design sharing (`src/lib/share.ts`)
- `HTMLCanvasElement.toDataURL` — screenshot/download of Three.js canvas (`src/lib/share.ts`)
- `window.location.href` — current URL for share links (`src/lib/share.ts`)

---

*Integration audit: 2026-03-07*
