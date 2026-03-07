# Technology Stack

**Analysis Date:** 2026-03-07

## Languages

**Primary:**
- TypeScript 5.x - All frontend and Next.js API routes (`src/**/*.ts`, `src/**/*.tsx`)

**Secondary:**
- Python 3.x - Local TripoSR microservice (`triposr-service/server.py`)

## Runtime

**Environment:**
- Node.js (no version pin — lockfileVersion 3, Next.js 16 requires Node 18+)

**Package Manager:**
- npm
- Lockfile: `package-lock.json` (v3, present)

## Frameworks

**Core:**
- Next.js 16.1.6 - Full-stack React framework; App Router, Edge API routes
- React 19.2.3 - UI rendering; used with `'use client'` directive throughout
- React DOM 19.2.3 - DOM bindings

**3D Rendering:**
- Three.js 0.183.2 - Core 3D engine
- @react-three/fiber 9.5.0 - React renderer for Three.js; all 3D scenes use this
- @react-three/drei 10.7.7 - Three.js helpers (OrbitControls, useGLTF, TransformControls, etc.)
- @react-three/postprocessing 3.0.4 - Post-processing effects (bloom, etc.)
- postprocessing 6.38.3 - Underlying postprocessing library

**Animation:**
- GSAP 3.14.2 - Timeline animations and transitions

**Debug/Dev UI:**
- leva 0.10.1 - In-scene GUI control panels (`src/components/leva/SceneControls.tsx`)

**Styling:**
- Tailwind CSS 4.x - Utility-first CSS; custom solarpunk color palette in `tailwind.config.ts`
- PostCSS via `@tailwindcss/postcss` - Tailwind integration

**Python Microservice (TripoSR):**
- FastAPI 0.110.0 - HTTP API framework (`triposr-service/server.py`)
- uvicorn 0.27.1 - ASGI server
- PyTorch 2.2.0 - ML inference; CUDA-enabled if available
- torchvision 0.17.0 - Image preprocessing
- Pillow 10.2.0 - Image manipulation
- trimesh 4.1.4 - 3D mesh export (GLB)
- rembg 2.0.56 - Background removal for input photos
- huggingface-hub 0.20.3 - Downloads `stabilityai/TripoSR` model weights

**Testing:**
- Not detected — no test framework configured

**Build/Dev:**
- ESLint 9 with `eslint-config-next` - Linting; config at `eslint.config.mjs`
- TypeScript compiler - Type checking; config at `tsconfig.json`
- babel-plugin-react-compiler 1.0.0 - React compiler Babel plugin (experimental)

## Key Dependencies

**Critical:**
- `@react-three/fiber` 9.5.0 - The React/Three.js bridge; entire 3D scene depends on it
- `three` 0.183.2 - Core 3D math, geometry, materials, renderer
- `@react-three/drei` 10.7.7 - Provides `useGLTF`, `TransformControls`, `OrbitControls`, `Environment`
- `leva` 0.10.1 - Runtime scene control GUI; removing breaks debug/dev controls in `src/components/leva/SceneControls.tsx`

**Infrastructure:**
- `next` 16.1.6 - App Router, Edge runtime for `/api/convert-photo`, static/SSR serving

## Configuration

**Environment:**
- Template at `.env.local.example`
- Required: `TRIPOSR_API_URL` — URL for local TripoSR service (default `http://127.0.0.1:8000`)
- Optional: `TRIPOSR_API_TOKEN` — Bearer token for TripoSR auth
- Optional: `NEXT_PUBLIC_API_URL` — Public API base URL (default `http://localhost:3000`)

**Build:**
- `next.config.ts` — Enables `optimizePackageImports` for `three`, `@react-three/fiber`, `@react-three/drei`
- `tsconfig.json` — `ES2017` target, strict mode, path alias `@/*` → `./src/*`, bundler module resolution
- `tailwind.config.ts` — Custom color tokens (`solarpunk-dark`, `solarpunk-green`, `solarpunk-lime`, etc.)
- `postcss.config.mjs` — Tailwind PostCSS plugin only
- `eslint.config.mjs` — Next.js core web vitals + TypeScript rules

## Platform Requirements

**Development:**
- Node.js 18+ (Next.js 16 minimum)
- npm for JS dependencies
- Python 3.9+ with pip for TripoSR service (optional; needed only for photo-to-3D feature)
- NVIDIA GPU with CUDA recommended for TripoSR (`triposr-service/server.py` optimized for RTX 2070 8GB)

**Production:**
- Vercel (`vercel.json` present, framework set to `nextjs`)
- TripoSR microservice must be self-hosted; not included in Vercel deployment
- No database or server-side session storage required

---

*Stack analysis: 2026-03-07*
