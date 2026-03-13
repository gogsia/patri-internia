# Solarpunk Interiors — Roadmap

## Completed
- Phase 1: Furniture placement, drag/drop, 3D controls
- Phase 2: Photo-to-3D via TripoSR (local Docker service)
- Phase 3: Material customization (14 solarpunk materials)
- Bug sprint: Geometry lookup fix, arrow-key history, error boundary, dead code removal, Docker Compose

## Phase 4: Templates (In Progress)
- [x] 10+ pre-designed room templates
- [x] Layout suggestion AI (by furniture type)
- [x] LayoutTemplates UI panel, one-click apply
- [ ] Template preview thumbnails

## Phase 5: Export & Sharing ✓
- [x] Export room as screenshot (canvas capture → PNG download) — `src/lib/share.ts` + Toolbar
- [x] Social share via Web Share API / Twitter fallback — `shareDesign()` in Toolbar
- [x] Shareable layout URL (base64 scene state in `?scene=` param) — `encodeSceneToUrl` / `decodeSceneFromUrl`, loaded on mount
- [x] Save to file / load from file (JSON export/import) — `exportSceneJson` / `importSceneJson`, wired in Toolbar

## Phase 6: UX Polish
- [ ] Collision detection / room boundary enforcement
- [ ] `onPointerCancel` handler in EditableFurniture (drag stuck bug)
- [ ] LayoutControls: replace `refreshKey` re-mount with `useLayouts` hook
- [ ] Persist lighting settings in saved layouts
- [ ] Camera deduplication (remove Canvas `camera` prop, keep `<PerspectiveCamera makeDefault>`)

## Phase 7: Performance
- [ ] Memoize `getMaterialByName` material clone (currently clones on every render)
- [ ] `MeshReflectorMaterial` resolution: 1024 → 512 default, configurable
- [ ] Cap pixel ratio when pixelation post-process is enabled

## Phase 8: Quality & Tests
- [ ] Set up Vitest for hooks (useHistory, furnitureLibrary, storage)
- [ ] `type` field migration: remove unused `modelPath` from FurnitureItem
- [ ] Consolidate two localStorage silos (layouts vs custom templates)
- [ ] Zod validation on localStorage deserialize

## Phase 9: Collaboration (Future)
- [ ] WebSocket live collaboration
- [ ] Supabase/Firebase cloud persistence
- [ ] Comment on furniture items

## Deprioritized / Parked
- VR/AR preview
- Multi-room floor plans
- Furniture shopping integration
