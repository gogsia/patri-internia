# Codebase Concerns

**Analysis Date:** 2026-03-07

---

## Tech Debt

**`any` type casts in cursor management (EditableFurniture):**
- Issue: Cursor change on drag uses `(event as any).object.el` — setting a `.el` property on a Three.js `Object3D` is not a documented pattern and the cast silences TypeScript completely.
- Files: `src/components/3d/EditableFurniture.tsx` lines 131–152
- Impact: Brittle runtime behaviour; cursor may not change correctly across Three.js versions or when pointer capture is active. Can produce silent failures with no TS warnings.
- Fix approach: Use CSS `cursor` on the canvas element itself, toggled via a React state flag that is applied with a `style` prop on `<Canvas>`.

**`category: any` parameter in handleSaveTemplate:**
- Issue: The `handleSaveTemplate` callback in `src/app/page.tsx` (line 274) accepts `category: any`, bypassing the `TemplateCategory` type.
- Files: `src/app/page.tsx` line 274
- Impact: Invalid category strings can be persisted to localStorage silently.
- Fix approach: Type the parameter as `TemplateCategory` and thread the type through `SaveTemplateModal`.

**`RoomModels` is a stub returning null:**
- Issue: `src/experiences/RoomModels.tsx` renders `null`. The component is imported and rendered inside a `<Suspense>` boundary inside `RoomEnvironment`, but does nothing.
- Files: `src/experiences/RoomModels.tsx`, `src/experiences/RoomEnvironment.tsx` line 111
- Impact: Dead code that implies planned GLTF room model imports never shipped. The `Suspense` wrapper around it is unnecessary overhead.
- Fix approach: Either implement GLTF imports or remove the component and the wrapping `<Suspense>` entirely.

**`modelPath` field on `FurnitureItem` is unused:**
- Issue: `FurnitureItem.modelPath` is populated in `src/lib/furnitureLibrary.ts` with paths like `/models/eco-chair.glb`, but `EditableFurniture` renders procedural geometries from `FurnitureGeometries.tsx` and ignores `modelPath` entirely. No `.glb` files exist in `public/models/`.
- Files: `src/types/index.ts`, `src/lib/furnitureLibrary.ts`, `src/components/3d/EditableFurniture.tsx`
- Impact: The type contract implies model loading that does not exist. The `public/models/` directory is empty. Any code that reads `modelPath` will receive a path to a non-existent file.
- Fix approach: Remove `modelPath` from `FurnitureItem` and the library data, or implement actual GLTF loading via `useGLTF` to replace the procedural geometries.

**Furniture type detection keyed on `item.id` prefix (EditableFurniture) vs. `item.name` (useLayoutSuggestions):**
- Issue: `getFurnitureType` in `src/components/3d/EditableFurniture.tsx` (line 19) resolves geometry by checking `item.id` prefixes (`plant-`, `chair-`, etc.). `getFurnitureType` in `src/hooks/useLayoutSuggestions.ts` (line 15) resolves category by checking `item.name` substrings. These are two separate classification systems.
- Files: `src/components/3d/EditableFurniture.tsx`, `src/hooks/useLayoutSuggestions.ts`
- Impact: Adding a new furniture type requires updating both functions independently. Duplicated items get IDs like `solar-succulent-1234567890` which no longer match the `plant-` prefix, causing them to fall through to the `default` box geometry.
- Fix approach: Add an explicit `type` field to `FurnitureItem` (e.g., `'plant' | 'panel' | 'tower' | 'chair' | 'table' | 'lamp'`) and derive it once at creation time from `furnitureLibrary.ts`. Both lookup functions should read from that field.

**Duplicate items break geometry lookup:**
- Issue: `handleAddFurniture` in `src/app/page.tsx` (line 70) creates `id: \`${item.id}-${Date.now()}\`` (e.g., `plant-1-1700000000`). `handleDuplicate` (line 107) uses `\`${selected.name}-${Date.now()}\`` (e.g., `solar-succulent-1700000001`). Neither format starts with `plant-`, `chair-`, etc., so the geometry type lookup in `EditableFurniture.tsx` returns `'default'` for all duplicated items, rendering them as plain boxes.
- Files: `src/app/page.tsx` lines 70, 107; `src/components/3d/EditableFurniture.tsx` line 19
- Impact: Duplicated furniture always renders as a grey box regardless of what was duplicated.
- Fix approach: See "Furniture type detection" fix above — introduce an explicit `type` field.

**History push runs on every furniture render cycle via useEffect:**
- Issue: `useEffect(() => { history.push(furniture); }, [furniture, history])` in `src/app/page.tsx` (line 45–47) runs after every render that changes `furniture`. The `push` function includes a JSON.stringify equality check to skip no-ops, but still incurs that serialisation cost on every render.
- Files: `src/app/page.tsx` lines 44–47, `src/hooks/useHistory.tsx` line 46
- Impact: Minor performance cost on every furniture state change; JSON.stringify on a potentially large array on every keypress (arrow key movement triggers a new state on each key event). At large furniture counts this could cause perceptible lag.
- Fix approach: Push history intentionally at operation boundaries (add, delete, move-end, rotate, scale) rather than reactively via `useEffect`.

**Arrow key movement creates a new history entry on every keypress:**
- Issue: `handleArrowKeyMove` in `src/app/page.tsx` calls `setFurniture(...)` on every arrow key event. Each call triggers the `useEffect` history push. Holding an arrow key creates hundreds of history entries in rapid succession, exhausting the 50-entry cap and collapsing meaningful undo granularity.
- Files: `src/app/page.tsx` lines 188–220, `src/hooks/useHistory.tsx` line 50
- Impact: After holding an arrow key for a second, the entire undo history is filled with incremental position steps. Undo becomes near-useless.
- Fix approach: Debounce the history push from arrow key movement, or use a key-up event to commit a single entry when the key is released (same pattern already used for drag via `onMoveEnd`).

**`refreshKey` pattern forces full re-mount of LayoutControls:**
- Issue: `LayoutControls` uses `key={refreshKey}` on its root `<aside>` to trigger a re-render after save/delete. This unmounts and remounts the entire component, resetting all local state.
- Files: `src/components/ui/LayoutControls.tsx` lines 22, 48
- Impact: Non-idiomatic React pattern. The component should read layouts from state or a derived value, not force re-mount. Any focused elements inside the panel lose focus on every save/delete.
- Fix approach: Lift layout state into a `useLayouts` hook (similar to `useCustomTemplates`) that returns reactive state instead of reading from localStorage synchronously at render time.

**`getLayouts()` called synchronously at render time in LayoutControls:**
- Issue: `const layouts = getLayouts()` is called at the top of the `LayoutControls` component body on every render. This is a direct `localStorage.getItem` call on the render path.
- Files: `src/components/ui/LayoutControls.tsx` line 24, `src/lib/storage.ts` line 5
- Impact: Synchronous localStorage access during render can block the main thread and may cause hydration issues since `storage.ts` guards against SSR but the component itself does not.
- Fix approach: Move layout data into React state via a `useLayouts` hook that loads once on mount, same pattern as `useCustomTemplates`.

**Two separate localStorage storage keys for the same conceptual data:**
- Issue: Layouts are stored under `'solarpunk-layouts-v1'` (`src/lib/storage.ts` line 3) and custom templates under `'solarpunk_custom_templates'` (`src/hooks/useCustomTemplates.ts` line 4). These solve overlapping use cases with different storage APIs (direct vs hook-based) and inconsistent key naming conventions (hyphenated vs underscore).
- Files: `src/lib/storage.ts`, `src/hooks/useCustomTemplates.ts`
- Impact: Storage concerns are split and inconsistent. Templates saved via `useCustomTemplates` and layouts saved via `saveLayout` are separate silos with no interoperability.
- Fix approach: Consolidate into a single storage abstraction with consistent key naming.

**`LEGACY_MATERIALS` exported but nothing reads from it:**
- Issue: `src/lib/materials.ts` exports `LEGACY_MATERIALS` (lines 204–232) containing `greenFloor`, `ecoBrick`, `panel`, and `plant` materials. Nothing in the codebase imports or uses this export.
- Files: `src/lib/materials.ts` lines 204–232
- Impact: Dead code that inflates the bundle. The `panel` material uses `color: 0x00ff00` (pure green) which is an obvious placeholder.
- Fix approach: Delete the export.

**`SOLAR_LIGHTING` and `NIGHT_MODE` configs exported but unused:**
- Issue: `src/lib/materials.ts` exports `SOLAR_LIGHTING` and `NIGHT_MODE` `LightingConfig` objects (lines 266–280). Nothing imports them; lighting values are hardcoded directly in `SolarpunkRoom.tsx` and `LayoutControls`.
- Files: `src/lib/materials.ts` lines 266–280
- Impact: Dead code; creates a false impression that lighting is driven by a shared config.
- Fix approach: Either wire these configs into the scene controls or remove them.

---

## Known Bugs

**Duplicated furniture renders as a box:**
- Symptoms: Duplicating any furniture item renders a grey default box instead of the correct shape.
- Files: `src/app/page.tsx` line 107, `src/components/3d/EditableFurniture.tsx` line 22
- Trigger: Click any item, press Ctrl+D or click Duplicate in toolbar.
- Workaround: None. The duplicated item is functional (can be moved, rotated, scaled) but visually wrong.

**Pointer capture / cursor change via `(event as any).object.el` may fail silently:**
- Symptoms: After dragging furniture, the cursor may remain as `grabbing` on subsequent hover if the `releasePointerCapture` path was not reached (e.g., pointer left the canvas mid-drag).
- Files: `src/components/3d/EditableFurniture.tsx` lines 131–152
- Trigger: Drag an item quickly off the canvas edge.
- Workaround: Click elsewhere to reset.

**Fake progress bar in PhotoDropzone is not tied to actual progress:**
- Symptoms: The percentage shown during TripoSR conversion (`Math.round(progress)%`) is a random interval simulation that caps at 90%. It completes to 100% only after the GLB URL is received.
- Files: `src/components/PhotoDropzone.tsx` lines 23–36
- Trigger: Upload any image when TripoSR service is running.
- Workaround: None; the bar is cosmetic only.

**No validation that GLB URL from TripoSR is a valid URL before rendering:**
- Symptoms: If the TripoSR service returns a malformed or relative URL as `glbUrl`, `useGLTF` in `DesignerModel` will throw an error inside the `<Suspense>` boundary with a silent fallback (`fallback={null}`).
- Files: `src/app/api/convert-photo/route.ts` lines 139–145, `src/components/3d/DesignerModel.tsx` line 11
- Trigger: TripoSR service returns a relative or empty `glbUrl`.
- Workaround: No user-visible error is shown when loading fails silently.

---

## Security Considerations

**SSRF risk in TripoSR API proxy:**
- Risk: `TRIPOSR_API_URL` is read from env and used directly in `fetch(\`${TRIPOSR_API_URL}/convert\`)` and for polling via `statusUrl` returned by the external service. A misconfigured or compromised `TRIPOSR_API_URL` could cause the Next.js edge function to make requests to internal network addresses.
- Files: `src/app/api/convert-photo/route.ts` lines 60, 95, 148–151
- Current mitigation: None. The `statusUrl` from the service response is used as-is without any host validation.
- Recommendations: Validate that `TRIPOSR_API_URL` and any returned `statusUrl` share the same host as configured. Reject `statusUrl` values that do not match the expected base URL.

**No CORS or rate limiting on the photo-to-3D API route:**
- Risk: The `/api/convert-photo` endpoint accepts any POST request with a file up to 4MB. Without rate limiting, it can be used to exhaust the TripoSR service or consume edge function execution time.
- Files: `src/app/api/convert-photo/route.ts`
- Current mitigation: File size check (4MB), basic content-type validation.
- Recommendations: Add rate limiting (Vercel middleware or a third-party solution like `@upstash/ratelimit`). Add an `allowedOrigins` check if the API is not intended to be public.

**GLB URL from external service is rendered directly in Three.js:**
- Risk: The `glbUrl` returned by TripoSR is passed directly to `useGLTF` which fetches and executes the GLB binary. A compromised TripoSR service could return a URL to a malicious GLTF file.
- Files: `src/components/3d/DesignerModel.tsx` line 11, `src/hooks/usePhotoTo3D.ts` line 42
- Current mitigation: None beyond the edge function acting as a proxy.
- Recommendations: Validate that the returned `glbUrl` is from a trusted domain. Consider proxying the GLB through the Next.js server rather than loading it directly from the TripoSR service URL.

**localStorage data deserialized with no schema validation:**
- Risk: Stored layouts and templates are `JSON.parse`d and cast with `as` without any structural validation. Manually crafted localStorage entries could inject unexpected types that crash rendering.
- Files: `src/lib/storage.ts` line 12, `src/hooks/useCustomTemplates.ts` line 21
- Current mitigation: Try/catch wraps the parse, returning `{}` or `[]` on failure.
- Recommendations: Use a lightweight schema validation (e.g., Zod) when reading persisted data.

---

## Performance Bottlenecks

**`getMaterialByName` clones a new `THREE.MeshStandardMaterial` on every render:**
- Problem: Every `<FurnitureGeometry>` calls `getMaterialByName(materialName)` which calls `materialDef.material.clone()`. This creates a new Three.js material object on every React render of every furniture item.
- Files: `src/lib/materials.ts` line 241, `src/components/3d/FurnitureGeometries.tsx` line 22
- Cause: No memoization; React renders occur on position, selection, and hover changes.
- Improvement path: Memoize the clone per `materialName` with `useMemo` inside `FurnitureGeometry`, or return the shared material instance directly (materials are read-only in this context).

**`MeshReflectorMaterial` on the floor at resolution 1024:**
- Problem: `RoomEnvironment` uses `<MeshReflectorMaterial resolution={1024} blur={[300, 100]}>` for the floor. This renders a secondary reflection pass at full 1024px resolution on every frame.
- Files: `src/experiences/RoomEnvironment.tsx` line 17
- Cause: High-resolution reflection pass is always active regardless of device capability.
- Improvement path: Reduce resolution to 512 by default; expose it via scene controls; disable on mobile or low-end GPUs detected via `renderer.capabilities`.

**`JSON.stringify` equality check in history `push` runs on every furniture change:**
- Problem: `src/hooks/useHistory.tsx` line 46 runs `JSON.stringify(last.furniture) === JSON.stringify(snapshot)` on every history push.
- Files: `src/hooks/useHistory.tsx` line 46
- Cause: No incremental diffing; entire furniture array is serialized twice per change.
- Improvement path: Compare array length and a hash/timestamp instead, or transition to action-based history that avoids snapshot comparison.

**Pixelation post-processing always renders an `<EffectComposer>` branch:**
- Problem: When `controls.enablePixelation` is true, a full `EffectComposer` + `Pixelation` pass is added. This is a full-screen render pass and can cause significant frame-rate drops at high canvas resolutions.
- Files: `src/experiences/SolarpunkRoom.tsx` lines 123–127
- Cause: No resolution cap or quality scaling on the post-process pass.
- Improvement path: Cap canvas pixel ratio when pixelation is enabled; accept granularity from Leva with a minimum that makes the effect meaningful without being too costly.

---

## Fragile Areas

**`EditableFurniture` drag state is local — pointer cancel is not handled:**
- Files: `src/components/3d/EditableFurniture.tsx`
- Why fragile: There is no `onPointerCancel` handler. If the browser cancels pointer capture (e.g., the window loses focus mid-drag), `draggingId` remains set and `onDragStateChange(false)` is never called. OrbitControls will remain disabled (`enabled={!isDraggingFurniture}`) until the user drags again.
- Safe modification: Add an `onPointerCancel` handler that calls `setDraggingId(null)` and `onDragStateChange(false)`.
- Test coverage: No tests exist for this component.

**`LayoutControls` re-reads localStorage synchronously on every render:**
- Files: `src/components/ui/LayoutControls.tsx` line 24
- Why fragile: Any external write to localStorage (e.g., from another tab) will not be reflected until the component re-renders, and any render triggered by an unrelated state change will re-read stale data between the `refreshKey` increment and the re-mount.
- Safe modification: Introduce a `useLayouts` hook with `useState` + `useEffect` and a `storage` event listener for cross-tab sync.
- Test coverage: None.

**`useHistory` `undo`/`redo` returns state via a captured variable from inside `setHistory`:**
- Files: `src/hooks/useHistory.tsx` lines 58–88
- Why fragile: The pattern assigns `result` inside `setHistory`'s updater function and returns it after. React does not guarantee that a `setState` updater runs synchronously in all future versions, and in Strict Mode it runs twice (though the double-run is an issue only in development). This pattern is technically unsound.
- Safe modification: Store `currentIndex` as a separate `useRef` that is updated alongside `setHistory`, enabling synchronous reads without relying on setState updater side effects.
- Test coverage: None.

**`SolarpunkRoom` has two camera definitions that may conflict:**
- Files: `src/experiences/SolarpunkRoom.tsx` lines 81, 85
- Why fragile: `<Canvas camera={{ position: [0, 5, 12], fov: 50 }}>` and `<PerspectiveCamera makeDefault position={[0, 5, 12]} fov={50} />` both define the default camera. The `makeDefault` prop on `PerspectiveCamera` overrides the Canvas `camera` prop, but both are present, which is redundant and could cause subtle ordering issues with `OrbitControls`.
- Safe modification: Remove the `camera` prop from `<Canvas>` and rely solely on `<PerspectiveCamera makeDefault>`.
- Test coverage: None.

---

## Scaling Limits

**localStorage for all user data:**
- Current capacity: Browser localStorage limit is typically 5–10MB per origin.
- Limit: A scene with many large furniture arrays and many custom templates could approach the storage cap, at which point the try/catch in `saveLayout` and `saveTemplate` will silently discard the write.
- Scaling path: Move persistence to IndexedDB (larger quota, async API) or a server-side store with user accounts.

**TripoSR polling occupies an edge function for up to 4 minutes:**
- Current capacity: Edge function timeout on Vercel is 25 seconds by default for Pro plans; the route.ts sets a polling loop of up to 4 minutes (120 × 2s = 240 seconds).
- Limit: The polling will exceed Vercel's edge function timeout, causing a 504 before the loop completes. This is dead code in production on Vercel.
- Scaling path: Move conversion polling to a webhook callback model, or use Vercel's `streaming` responses to keep the connection alive. Alternatively, have the client poll a status endpoint directly.

---

## Dependencies at Risk

**`leva` v0.10.1 is unmaintained:**
- Risk: The last leva release was in 2022. It has known peer dependency warnings with React 19 and is not actively maintained.
- Impact: Debug panel (`SceneControls`) will become incompatible as React evolves.
- Migration plan: Migrate to a maintained alternative (e.g., `tweakpane`, or a custom Tailwind-styled controls panel) or remove the Leva panel if it is only used in development.

**`gsap` v3 is listed as a dependency but not imported anywhere in `src/`:**
- Risk: Unused production dependency adds ~70KB to the bundle.
- Impact: Build size bloat.
- Migration plan: Remove from `package.json` if not needed.

---

## Missing Critical Features

**No collision detection or boundary enforcement:**
- Problem: Furniture can be dragged outside the room bounds (20×20 floor plane) or stacked on top of each other. There are no guards.
- Blocks: Layouts saved with out-of-bounds positions will render items floating in void space.

**No error boundary around the 3D canvas:**
- Problem: `SolarpunkRoom` is loaded inside a `<Suspense>` but there is no React `ErrorBoundary` wrapping the `<Canvas>`. Any runtime Three.js or R3F error will propagate and crash the entire page.
- Files: `src/components/Scene.tsx` lines 43–56
- Blocks: Any GLB load failure or shader error causes an unhandled React error, white-screening the app.

**No persistence of scene lighting settings:**
- Problem: Lighting adjustments made via the Leva panel are lost on page reload. Saved layouts hardcode `ambientIntensity: 0.6, pointIntensity: 1.5` regardless of what the user set.
- Files: `src/components/ui/LayoutControls.tsx` lines 31–34, `src/hooks/useCustomTemplates.ts` lines 51–54

---

## Test Coverage Gaps

**Zero project-level tests exist:**
- What's not tested: Every hook, component, and utility function. No test runner is configured (`jest`, `vitest`, or Playwright are absent from `package.json`).
- Files: All of `src/`
- Risk: Any refactor or dependency update can silently break core functionality (undo/redo logic, furniture ID generation, geometry type dispatch, storage serialization).
- Priority: High

**History logic is especially risky without tests:**
- What's not tested: `push` deduplication, undo/redo index boundary conditions, and the `setHistory` side-effect return pattern.
- Files: `src/hooks/useHistory.tsx`
- Risk: The fragile `result`-inside-`setHistory` pattern described above has no regression coverage.
- Priority: High

**Furniture ID → geometry dispatch has no tests:**
- What's not tested: `getFurnitureType` prefix matching in `EditableFurniture`, including the bug where duplicated IDs fall through to `'default'`.
- Files: `src/components/3d/EditableFurniture.tsx` lines 19–29
- Risk: Silent rendering regressions when furniture library entries are added or ID format changes.
- Priority: Medium

---

*Concerns audit: 2026-03-07*
