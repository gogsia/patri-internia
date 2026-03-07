# Codebase Structure

**Analysis Date:** 2026-03-07

## Directory Layout

```
solarpunk-interiors/
├── src/
│   ├── app/                    # Next.js App Router pages and API
│   │   ├── api/
│   │   │   └── convert-photo/
│   │   │       └── route.ts    # Edge API route: photo → GLB via TripoSR
│   │   ├── globals.css         # Global Tailwind CSS
│   │   ├── layout.tsx          # Root layout, HistoryProvider injection
│   │   └── page.tsx            # Single-page app orchestrator (owns all state)
│   ├── components/
│   │   ├── 3d/                 # R3F components rendered inside <Canvas>
│   │   │   ├── DesignerModel.tsx
│   │   │   ├── EditableFurniture.tsx
│   │   │   ├── FloorGrid.tsx
│   │   │   ├── FurnitureGeometries.tsx
│   │   │   ├── FurnitureInstances.tsx
│   │   │   └── Model.tsx
│   │   ├── leva/               # Leva debug panel hooks
│   │   │   └── SceneControls.tsx
│   │   ├── ui/                 # 2D HTML overlay panels
│   │   │   ├── ColorSchemes.tsx
│   │   │   ├── FurniturePanel.tsx
│   │   │   ├── KeyboardShortcuts.tsx
│   │   │   ├── LayoutControls.tsx
│   │   │   ├── LayoutTemplates.tsx
│   │   │   ├── MaterialPicker.tsx
│   │   │   ├── SaveTemplateModal.tsx
│   │   │   ├── Toast.tsx
│   │   │   └── Toolbar.tsx
│   │   ├── PhotoDropzone.tsx   # Photo upload overlay for photo-to-3D
│   │   └── Scene.tsx           # SSR-safe bridge to the 3D experience
│   ├── experiences/            # Self-contained 3D scene compositions
│   │   ├── shaders/            # Custom GLSL shader files
│   │   ├── RoomEnvironment.tsx # Static room meshes (floor, walls, decorations)
│   │   ├── RoomModels.tsx      # GLTF room model imports
│   │   └── SolarpunkRoom.tsx   # Canvas + lights + all 3D children
│   ├── hooks/                  # Custom React hooks
│   │   ├── useArrowKeyMovement.ts
│   │   ├── useCustomTemplates.ts
│   │   ├── useFurnitureKeyboard.ts
│   │   ├── useHistory.tsx      # Context provider + useHistory consumer
│   │   ├── useLayoutSuggestions.ts
│   │   ├── useMaterialPicker.ts
│   │   ├── useModelLoader.ts
│   │   ├── usePhotoTo3D.ts
│   │   ├── useRotationControls.ts
│   │   ├── useScalingControls.ts
│   │   ├── useToast.ts
│   │   └── useUndoRedo.ts
│   ├── lib/                    # Pure functions, static data, utilities
│   │   ├── colorSchemes.ts
│   │   ├── constants.ts
│   │   ├── furnitureLibrary.ts
│   │   ├── layoutTemplates.ts
│   │   ├── materials.ts
│   │   ├── shaders.ts
│   │   ├── share.ts
│   │   ├── storage.ts
│   │   └── utils.ts
│   ├── templates/              # JSON layout template data files
│   │   ├── eclectic.json
│   │   ├── eclectic-night-market.json
│   │   ├── eclectic-sunroom-studio.json
│   │   ├── eclectic-urban-oasis.json
│   │   ├── maximalist.json
│   │   ├── maximalist-biophilic-lab.json
│   │   ├── maximalist-maker-hub.json
│   │   ├── minimalist.json
│   │   ├── minimalist-focus-pod.json
│   │   └── minimalist-reading-nook.json
│   └── types/
│       └── index.ts            # All shared TypeScript interfaces
├── public/
│   ├── models/                 # GLB/GLTF 3D model assets (referenced by furnitureLibrary)
│   ├── templates/              # SVG preview images for layout templates + JSON copies
│   └── textures/               # Texture image assets
├── app/                        # (Legacy/alternate) App Router remnant — likely unused
├── triposr-service/            # Local TripoSR Python service configuration
├── test-images/                # Sample images for photo-to-3D testing
├── package.json
├── tsconfig.json
└── .planning/                  # GSD planning documents (this file's home)
    └── codebase/
```

## Directory Purposes

**`src/app/`:**
- Purpose: Next.js App Router — pages, layouts, and API routes
- Contains: One page (`page.tsx`), root layout, one API route (`convert-photo`)
- Key files: `src/app/page.tsx` (entire app logic), `src/app/layout.tsx` (HistoryProvider root)

**`src/components/3d/`:**
- Purpose: React Three Fiber components rendered exclusively inside a `<Canvas>` context
- Contains: Draggable furniture renderer, procedural geometry library, imported GLB viewer, floor grid
- Key files: `src/components/3d/EditableFurniture.tsx`, `src/components/3d/FurnitureGeometries.tsx`

**`src/components/ui/`:**
- Purpose: 2D Tailwind-styled HTML overlay panels that float over the 3D canvas
- Contains: All sidebar panels, modals, toasts, keyboard shortcut overlay
- Key files: `src/components/ui/FurniturePanel.tsx`, `src/components/ui/Toolbar.tsx`, `src/components/ui/LayoutControls.tsx`

**`src/components/leva/`:**
- Purpose: Leva debug GUI hook wrappers
- Contains: `SceneControls.tsx` — exposes ambient/point light intensity, pixelation, grid, auto-rotate via Leva panel
- Key files: `src/components/leva/SceneControls.tsx`

**`src/experiences/`:**
- Purpose: Full 3D scene compositions (not individual components) — owns the `<Canvas>` element
- Contains: `SolarpunkRoom.tsx` (the Canvas + all child composition), `RoomEnvironment.tsx` (static set dressing), `RoomModels.tsx` (GLTF imports), `shaders/` (custom GLSL)
- Key files: `src/experiences/SolarpunkRoom.tsx`

**`src/hooks/`:**
- Purpose: Custom React hooks for keyboard input, state behavior, API calls, and localStorage
- Contains: Input hooks (movement, rotation, scale, keyboard), service hooks (photo-to-3D, model loader), state hooks (history, undo/redo, toast, material picker, custom templates, layout suggestions)
- Key files: `src/hooks/useHistory.tsx` (is also a Context provider — must be imported carefully)

**`src/lib/`:**
- Purpose: Framework-free TypeScript modules; safe to import in any context (React or not)
- Contains: Static catalogs (`furnitureLibrary.ts`, `colorSchemes.ts`), material definitions (`materials.ts`), template utilities (`layoutTemplates.ts`), localStorage CRUD (`storage.ts`), general utilities
- Key files: `src/lib/materials.ts`, `src/lib/storage.ts`, `src/lib/furnitureLibrary.ts`

**`src/templates/`:**
- Purpose: JSON data files for the 10 built-in layout templates; imported statically by `src/lib/layoutTemplates.ts`
- Contains: One `.json` per template with `id`, `name`, `category`, `description`, `furniture[]`, `lighting`
- Generated: No — hand-authored

**`src/types/`:**
- Purpose: Central TypeScript type definitions shared across the entire codebase
- Key file: `src/types/index.ts` — exports `FurnitureItem`, `RoomLayout`, `LayoutTemplate`, `TemplateCategory`, `SceneProps`, `ShaderUniforms`

**`public/templates/`:**
- Purpose: SVG preview images for each built-in template, served as static assets; URLs referenced in `src/lib/layoutTemplates.ts`
- Generated: No — manually created SVG files

**`public/models/`:**
- Purpose: GLB/GLTF 3D model files referenced by `furnitureLibrary.ts` `modelPath` fields
- Note: The `modelPath` values in `furnitureLibrary.ts` point to files here, but furniture is currently rendered with procedural geometries in `FurnitureGeometries.tsx` rather than loading these GLBs

## Key File Locations

**Entry Points:**
- `src/app/page.tsx`: Main application page — all furniture state, selection, keyboard wiring
- `src/app/layout.tsx`: Root layout — `HistoryProvider` wrapping
- `src/app/api/convert-photo/route.ts`: Photo-to-3D Edge API endpoint

**Configuration:**
- `tsconfig.json`: TypeScript config with `@/` path alias pointing to `src/`
- `package.json`: Dependencies and scripts
- `src/app/globals.css`: Global Tailwind CSS entry

**Core Logic:**
- `src/experiences/SolarpunkRoom.tsx`: Canvas setup and 3D scene root
- `src/components/3d/EditableFurniture.tsx`: Drag/select interaction for all furniture
- `src/components/3d/FurnitureGeometries.tsx`: Visual geometry per furniture type
- `src/hooks/useHistory.tsx`: Undo/redo Context provider
- `src/lib/materials.ts`: All material definitions and helper functions
- `src/lib/storage.ts`: Room layout persistence to localStorage
- `src/lib/layoutTemplates.ts`: Template data aggregation and arrangement utilities

**Types:**
- `src/types/index.ts`: All domain types (`FurnitureItem`, `RoomLayout`, `LayoutTemplate`, etc.)

## Naming Conventions

**Files:**
- Components: PascalCase — `EditableFurniture.tsx`, `FurniturePanel.tsx`
- Hooks: camelCase prefixed with `use` — `useHistory.tsx`, `useArrowKeyMovement.ts`
- Library modules: camelCase — `furnitureLibrary.ts`, `layoutTemplates.ts`, `colorSchemes.ts`
- Template JSON: kebab-case — `minimalist-reading-nook.json`, `eclectic-urban-oasis.json`
- SVG previews: kebab-case matching template id — `minimalist-starter.svg`

**Directories:**
- All lowercase or camelCase: `3d/`, `ui/`, `leva/`, `experiences/`, `hooks/`, `lib/`, `templates/`, `types/`

**Code:**
- React components: PascalCase function names
- Exported constants: SCREAMING_SNAKE_CASE — `FURNITURE_LIBRARY`, `SOLARPUNK_MATERIALS`, `LAYOUT_TEMPLATES`
- Handler props/callbacks: `onXxx` pattern — `onAdd`, `onSelectChange`, `onFurnitureMove`
- Handler implementations in page: `handleXxx` — `handleAddFurniture`, `handleDelete`, `handleUndo`

## Where to Add New Code

**New UI panel or overlay:**
- Implementation: `src/components/ui/YourPanel.tsx`
- Wire into: `src/app/page.tsx` JSX and state handlers
- Style with: Tailwind utility classes, position absolutely over canvas

**New 3D component (rendered inside Canvas):**
- Implementation: `src/components/3d/YourComponent.tsx` — must use R3F hooks/JSX
- Mount it in: `src/experiences/SolarpunkRoom.tsx` inside the `<Canvas>` block
- Do NOT use `'use client'` directive style DOM APIs inside Canvas components

**New keyboard shortcut hook:**
- Implementation: `src/hooks/useYourShortcut.ts`
- Pattern: `useEffect` with `keydown` event listener, return cleanup
- Wire into: `src/app/page.tsx` alongside existing shortcut hooks

**New furniture type (geometry only):**
- Add a new `if (type === 'yourtype')` branch in `src/components/3d/FurnitureGeometries.tsx`
- Add the type to the union in `getFurnitureType()` in `src/components/3d/EditableFurniture.tsx`
- Add the catalog entry in `src/lib/furnitureLibrary.ts`

**New built-in layout template:**
- Create `src/templates/your-template.json` following the `LayoutTemplate` interface shape
- Import and add to `RAW_TEMPLATES` array in `src/lib/layoutTemplates.ts`
- Add an SVG preview at `public/templates/your-template.svg`
- Add the path mapping to `TEMPLATE_PREVIEWS` in `src/lib/layoutTemplates.ts`

**New material:**
- Add entry to `SOLARPUNK_MATERIALS` record in `src/lib/materials.ts`
- Key is the material ID string; value is `MaterialDefinition` with category and `THREE.MeshStandardMaterial`

**New color scheme:**
- Add entry to `COLOR_SCHEMES` array in `src/lib/colorSchemes.ts`
- Map furniture categories (`plants`, `tech`, `seating`, `tables`, `lighting`, `default`) to material IDs

**New API route:**
- Create `src/app/api/your-route/route.ts` following Next.js App Router route handler conventions
- Set `export const runtime = 'edge'` for Edge runtime or omit for Node.js runtime

**Utilities / pure functions:**
- Add to `src/lib/utils.ts` for general helpers
- Add to domain-specific lib file (e.g., `src/lib/layoutTemplates.ts`) for feature-specific logic

## Special Directories

**`.planning/`:**
- Purpose: GSD planning and codebase analysis documents
- Generated: No
- Committed: Yes

**`triposr-service/`:**
- Purpose: Local TripoSR Python service for photo-to-3D conversion (run separately)
- Generated: No
- Committed: Yes (service config/scripts)

**`test-images/`:**
- Purpose: Sample images for manual testing of the photo-to-3D pipeline
- Generated: No
- Committed: Yes

**`.next/`:**
- Purpose: Next.js build output and dev server cache
- Generated: Yes
- Committed: No

---

*Structure analysis: 2026-03-07*
