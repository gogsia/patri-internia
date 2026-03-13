# Project State

**Last updated:** 2026-03-07 (Session 10)

## Current Phase
Phase 6 (UX Polish) — in progress

## Cumulative History
**Session 8:**
- Fixed duplicate furniture geometry bug (added explicit `type` field to FurnitureItem)
- Fixed arrow-key history flooding (commit on keyup via `onMoveEnd`)
- Added SceneErrorBoundary around R3F Canvas
- Rewrote TripoSR API route: removed long poll, client now polls `/api/convert-photo/status`
- Removed dead code: LEGACY_MATERIALS, SOLAR_LIGHTING, NIGHT_MODE, gsap
  - Note: `RoomModels.tsx` was stubbed to `return null` (not deleted — file still exists)
- Created Docker Compose setup (Next.js + TripoSR + NVIDIA GPU)
- Cleaned up 19 stray root-level markdown files
- Initialized .planning/ with PROJECT.md, ROADMAP.md, STATE.md

**Session 9:**
- Added `src/lib/share.ts`: `downloadCanvasScreenshot()` and `shareDesign()` (Web Share API + Twitter fallback)
- Wired both into Toolbar.tsx (screenshot download + social share button)
- Added `encodeSceneToUrl` / `decodeSceneFromUrl` — base64 scene state in `?scene=` query param
- Added `exportSceneJson` / `importSceneJson` — JSON file download and file-picker import
- Wired Copy Link, Export, Import buttons into Toolbar + page.tsx
- Phase 5 fully complete

**Session 10:**
- Added `onPointerCancel` to EditableFurniture — fixes drag-stuck + locked OrbitControls on pointer loss
- Removed redundant `camera` prop from `<Canvas>` (duplicate of `<PerspectiveCamera makeDefault>`)
- Created `src/hooks/useLayouts.ts` — replaces `refreshKey` re-mount hack in LayoutControls
- Created `src/lib/sceneStore.ts` — shared Leva store for scene controls
- Lighting persistence: save uses real `sceneStore.get()` values; load calls `sceneStore.set()` to restore
- Phase 6 tasks 2–5 complete (collision detection still pending)

## Active Branch
`master` (all work committed here)

## Known Open Issues
- `(event as any).object.el` cursor hack in EditableFurniture (tech debt)
- `category: any` in handleSaveTemplate page.tsx:290
- `modelPath` field on FurnitureItem is unused (no GLB files exist)
- `useHistory` setState-inside-updater pattern is fragile
- `RoomModels.tsx` is a `return null` stub — can be fully deleted
- Zero tests configured
- Collision detection / room boundary enforcement (Phase 6 remaining)

## Next Up
Phase 6 last item: collision detection / room boundary clamp
Then Phase 7: Performance (material memoization, MeshReflectorMaterial, pixel ratio cap)
