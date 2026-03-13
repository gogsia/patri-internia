# Solarpunk Interiors — Project Context

## Vision
A browser-based 3D room designer with a solarpunk aesthetic. Users place procedural furniture, customize materials, import real photos as 3D models via TripoSR, and share their layouts.

## Stack
- Next.js 16 (App Router) + TypeScript
- React Three Fiber / Three.js for 3D
- Leva for scene controls
- Tailwind CSS for UI
- TripoSR (self-hosted FastAPI) for photo-to-3D
- Docker Compose for local dev

## Current State (Session 8 baseline)
- Phases 1–3 complete: furniture placement, undo/redo, materials, photo-to-3D
- Phase 4 partially done: layout templates and suggestion UI exist but need polish
- All critical bugs fixed (geometry lookup, arrow-key history flood, error boundary, TripoSR timeout)
- Docker Compose setup complete for local dev (Next.js + TripoSR + GPU)

## Design System
- Primary green: #7ddf64
- Forest green: #2d5016
- Gold: #d4af37
- Base teal: #1a3a1a

## Constraints
- No backend/DB yet — localStorage persistence only
- TripoSR runs locally (requires Docker + NVIDIA GPU for best performance)
- Vercel Edge Function limit: 25s (polling moved to client)
