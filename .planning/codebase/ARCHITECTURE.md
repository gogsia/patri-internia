# Architecture

**Analysis Date:** 2026-03-07

## Pattern Overview

**Overall:** Single-page React application with a React Three Fiber (R3F) 3D scene embedded in a Next.js 16 App Router shell. The application is a client-side-only interactive 3D room designer; all state lives in React, all persistence uses localStorage or the Next.js Edge API route.

**Key Characteristics:**
- Fully client-side rendered (`'use client'` on every component); SSR disabled for the 3D canvas via `next/dynamic` with `ssr: false`
- Unidirectional data flow: `page.tsx` owns all `furniture[]` state and passes it down as props; the 3D scene and all UI panels are pure consumers / event emitters
- History (undo/redo) is managed through a React Context (`HistoryProvider`) wrapping the entire app in `layout.tsx`
- No global state library (Redux, Zustand, etc.) — React `useState` + custom hooks + Context for cross-cutting state

## Layers

**Application Shell:**
- Purpose: Next.js App Router entry — provides HTML, global CSS, and wraps the tree in `HistoryProvider`
- Location: `src/app/layout.tsx`
- Contains: `<HistoryProvider>`, `<html>`, `<body>`, global metadata
- Depends on: `src/hooks/useHistory.tsx`
- Used by: All page routes

**Page / Orchestrator:**
- Purpose: The single page that owns all furniture state, selection state, and coordinates every interaction handler
- Location: `src/app/page.tsx`
- Contains: `furniture: FurnitureItem[]`, `selectedId`, all `handleXxx` callbacks, all keyboard hook wires, JSX layout composing Scene + UI panels
- Depends on: All `src/hooks/`, `src/lib/layoutTemplates.ts`, `src/lib/colorSchemes.ts`, `src/types`
- Used by: Nothing (it is the root)

**3D Scene Bridge:**
- Purpose: Thin SSR-safe wrapper that dynamically imports the heavy WebGL experience and prevents it from running on the server
- Location: `src/components/Scene.tsx`
- Contains: `next/dynamic` import of `SolarpunkRoom`, `Suspense` fallback spinner
- Depends on: `src/experiences/SolarpunkRoom.tsx`
- Used by: `src/app/page.tsx`

**3D Experience:**
- Purpose: Owns the R3F `<Canvas>`, lighting, camera, post-processing, and renders all 3D child components
- Location: `src/experiences/SolarpunkRoom.tsx`
- Contains: `<Canvas>`, `OrbitControls`, `EffectComposer/Pixelation`, `<PhotoDropzone>` overlay, `<EditableFurniture>`, `<DesignerModel>`, `<FloorGrid>`, `<RoomEnvironment>`
- Depends on: `src/components/3d/`, `src/components/PhotoDropzone.tsx`, `src/components/leva/SceneControls.tsx`, `src/experiences/RoomEnvironment.tsx`
- Used by: `src/components/Scene.tsx`

**Room Environment:**
- Purpose: Static solarpunk room scene — floor, walls, ceiling, decorative meshes, and room GLTF models
- Location: `src/experiences/RoomEnvironment.tsx`, `src/experiences/RoomModels.tsx`
- Contains: Procedural Three.js meshes (plane, box, sphere geometries), `MeshReflectorMaterial` for reflective floor, `<Suspense>`-wrapped GLTF imports
- Depends on: `@react-three/drei`, Three.js
- Used by: `src/experiences/SolarpunkRoom.tsx`

**3D Components:**
- Purpose: Reusable R3F components that render inside the Canvas
- Location: `src/components/3d/`
- Contains:
  - `EditableFurniture.tsx` — renders all placed furniture items with drag, hover, select interaction
  - `FurnitureGeometries.tsx` — procedural geometry renderers for each furniture type (plant/panel/tower/chair/table/lamp)
  - `DesignerModel.tsx` — renders an imported GLB from a URL (AI-generated designer object)
  - `FloorGrid.tsx` — optional grid overlay
- Depends on: `src/lib/materials.ts`, `src/types`
- Used by: `src/experiences/SolarpunkRoom.tsx`

**UI Panels:**
- Purpose: 2D HTML overlay panels positioned absolutely over the canvas using Tailwind
- Location: `src/components/ui/`
- Contains: `FurniturePanel.tsx`, `Toolbar.tsx`, `LayoutControls.tsx`, `LayoutTemplates.tsx`, `ColorSchemes.tsx`, `MaterialPicker.tsx`, `SaveTemplateModal.tsx`, `Toast.tsx`, `KeyboardShortcuts.tsx`
- Depends on: `src/lib/`, `src/types`
- Used by: `src/app/page.tsx`

**Custom Hooks:**
- Purpose: Encapsulate UI behavior (keyboard shortcuts, input handling) and service interactions (API calls, localStorage access)
- Location: `src/hooks/`
- Contains: `useHistory.tsx` (Context provider + consumer), `useUndoRedo.ts`, `useFurnitureKeyboard.ts`, `useArrowKeyMovement.ts`, `useRotationControls.ts`, `useScalingControls.ts`, `useToast.ts`, `useMaterialPicker.ts`, `useLayoutSuggestions.ts`, `useCustomTemplates.ts`, `usePhotoTo3D.ts`, `useModelLoader.ts`
- Depends on: `src/types`, `src/lib/`
- Used by: `src/app/page.tsx`, `src/components/`

**Library / Data Layer:**
- Purpose: Pure functions, static data, and localStorage utilities; no React
- Location: `src/lib/`
- Contains: `furnitureLibrary.ts` (catalog of available furniture), `materials.ts` (SOLARPUNK_MATERIALS palette + helpers), `colorSchemes.ts` (material theme presets), `layoutTemplates.ts` (template helpers, auto-arrange, remix), `storage.ts` (localStorage CRUD for room layouts), `constants.ts`, `utils.ts`, `shaders.ts`, `share.ts`
- Depends on: `src/types`, Three.js
- Used by: Hooks and UI components

**API Route:**
- Purpose: Server-side proxy to an external TripoSR 3D-generation service; converts a photo upload into a GLB URL
- Location: `src/app/api/convert-photo/route.ts`
- Contains: `POST` handler (Edge runtime), photo validation, task start, async polling loop for GLB URL
- Depends on: `TRIPOSR_API_URL`, `TRIPOSR_API_TOKEN` env vars
- Used by: `src/hooks/usePhotoTo3D.ts`

## Data Flow

**Add Furniture to Scene:**

1. User clicks item in `FurniturePanel` → calls `onAdd(item: FurnitureItem)` prop
2. `handleAddFurniture` in `page.tsx` generates a unique id, sets position to origin, appends to `furniture` state
3. `useEffect` detects `furniture` change → calls `history.push(furniture)` to record snapshot
4. Updated `furniture` array flows down as prop to `Scene` → `SolarpunkRoom` → `EditableFurniture`
5. `EditableFurniture` maps items to `FurnitureGeometry` components rendered in R3F Canvas

**Drag a Furniture Item:**

1. `EditableFurniture.handlePointerDown` — sets `draggingId`, calls `onDragStateChange(true)` disabling `OrbitControls`
2. `handlePointerMove` — fires `onMove(id, nextPosition)` each frame
3. `page.tsx` `handleFurnitureMove` → `setFurniture(prev.map(...))` (live position update, no history commit)
4. `handlePointerUp` → fires `onMoveEnd(id, finalPosition)`, `onDragStateChange(false)`
5. `handleFurnitureMoveEnd` in `page.tsx` sets final position → `useEffect` commits to history

**Photo to 3D Model:**

1. User clicks "Import Designer Photo" → `showDropzone` state toggled in `SolarpunkRoom`
2. `PhotoDropzone` accepts file → calls `usePhotoTo3D().convert(file)`
3. `usePhotoTo3D` POSTs to `/api/convert-photo` (Next.js Edge route)
4. API route forwards to `TRIPOSR_API_URL/convert`, polls for GLB URL, returns `{ glbUrl }`
5. `onDesignerModelReady(glbUrl)` fires → `page.tsx` stores `designerModelUrl` in state
6. `SolarpunkRoom` renders `<DesignerModel url={designerModelUrl} />` inside Canvas

**Save / Load Layout:**

1. Save: `LayoutControls` captures current `furniture` array and `designerModelUrl` from props → calls `storage.saveLayout(layout)` directly (localStorage)
2. Load: `LayoutControls` reads layouts from `storage.getLayouts()`, user selects one → fires `onLoad(layout)` prop
3. `page.tsx` `handleLoadLayout` → replaces `furniture` state and `designerModelUrl`

**Undo / Redo:**

1. `useUndoRedo` hook attaches `keydown` listener for Ctrl+Z / Ctrl+Y
2. Fires `onUndo` / `onRedo` callbacks passed from `page.tsx`
3. `handleUndo` calls `history.undo()` (from `HistoryContext`) → gets previous `FurnitureItem[]` snapshot → `setFurniture(prevState)`
4. `HistoryContext` is a React Context (`HistoryProvider` in `layout.tsx`) backed by `useState<HistoryData>` storing up to 50 snapshots

**State Management:**
- Primary scene state (`furniture[]`, `selectedId`, `designerModelUrl`) lives as `useState` in `src/app/page.tsx`
- History snapshots live in `HistoryContext` (`src/hooks/useHistory.tsx`) — provided at root, consumed in `page.tsx`
- Transient UI state (hover, drag, panel open/closed) lives locally in each component/hook
- Persistence: `localStorage` via `src/lib/storage.ts` (layouts) and `src/hooks/useCustomTemplates.ts` (custom templates)

## Key Abstractions

**FurnitureItem:**
- Purpose: Core domain entity representing a placed furniture piece with transform and material
- Definition: `src/types/index.ts`
- Shape: `{ id, name, modelPath, position: [x,y,z], rotation: [x,y,z], scale: number, materialName?: string }`
- All furniture state mutations produce new arrays of `FurnitureItem` (immutable update pattern)

**LayoutTemplate:**
- Purpose: A named preset of furniture arrangements (built-in or user-saved)
- Definition: `src/types/index.ts`, data in `src/templates/*.json`, index in `src/lib/layoutTemplates.ts`
- Built-in templates: 10 JSON files in three categories (`minimalist`, `maximalist`, `eclectic`)

**SOLARPUNK_MATERIALS:**
- Purpose: Named library of `THREE.MeshStandardMaterial` instances keyed by material ID
- Definition: `src/lib/materials.ts`
- Used by: `FurnitureGeometries.tsx` via `getMaterialByName(name)`

**FurnitureGeometry (procedural):**
- Purpose: Replaces missing/placeholder GLTF models with hand-coded Three.js geometry compositions
- Location: `src/components/3d/FurnitureGeometries.tsx`
- Pattern: `if (type === 'plant') return <group>...</group>` — one branch per furniture type

**HistoryContext:**
- Purpose: Undo/redo stack for `FurnitureItem[]` snapshots, max 50 entries, de-duplicated by JSON comparison
- Location: `src/hooks/useHistory.tsx`
- Pattern: React Context with `push` / `undo` / `redo` / `canUndo` / `canRedo`

## Entry Points

**Web Application:**
- Location: `src/app/page.tsx`
- Triggers: Browser navigation to `/`
- Responsibilities: Owns all furniture state, composes Scene + all UI panels, wires all keyboard hooks

**App Root / Provider:**
- Location: `src/app/layout.tsx`
- Triggers: Every page render
- Responsibilities: Injects `HistoryProvider` context, sets HTML metadata and body class

**API Endpoint:**
- Location: `src/app/api/convert-photo/route.ts`
- Triggers: POST from `usePhotoTo3D` hook at `/api/convert-photo`
- Responsibilities: Validates image upload, proxies to TripoSR service, polls for GLB URL, returns result

## Error Handling

**Strategy:** Errors surface to UI via the toast notification system. The API route catches all exceptions and returns structured `{ error: string }` JSON responses. Client hooks check `response.ok` and propagate error strings upward.

**Patterns:**
- API route: try/catch wrapping entire handler, returns `NextResponse.json({ error })` with appropriate HTTP status
- `usePhotoTo3D`: catches fetch errors, stores in local `error` state, returns `{ success: false, error }` from `convert()`
- `storage.ts` / `useCustomTemplates.ts`: try/catch around `localStorage` calls, fail silently with `console.error`
- No global error boundary — unhandled R3F errors would crash the canvas silently

## Cross-Cutting Concerns

**Logging:** `console.error` only on localStorage failures; no structured logging or error tracking service
**Validation:** Only in the API route (`validatePhoto` function: type check, size limit 4MB); no form validation library
**Authentication:** None — the app is fully public; the API route optionally reads `TRIPOSR_API_TOKEN` for bearer auth to the external TripoSR service

---

*Architecture analysis: 2026-03-07*
