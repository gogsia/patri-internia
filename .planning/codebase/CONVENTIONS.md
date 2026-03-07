# Coding Conventions

**Analysis Date:** 2026-03-07

## Naming Patterns

**Files:**
- React components: PascalCase matching the exported component name (`EditableFurniture.tsx`, `LayoutControls.tsx`, `SaveTemplateModal.tsx`)
- Hooks: camelCase prefixed with `use` (`useHistory.tsx`, `useCustomTemplates.ts`, `usePhotoTo3D.ts`)
- Lib utilities: camelCase module name (`furnitureLibrary.ts`, `layoutTemplates.ts`, `colorSchemes.ts`)
- Shader files: `pixel.frag.ts`, `pixel.vert.ts` — lowercase dot-delimited type indicator
- Constants/config objects: SCREAMING_SNAKE_CASE (`FURNITURE_LIBRARY`, `SOLAR_LIGHTING`, `SOLARPUNK_MATERIALS`, `LAYOUT_TEMPLATES`)

**Functions:**
- Event handlers: `handle` prefix (`handleUndo`, `handleAddFurniture`, `handleFurnitureMove`)
- Hooks: `use` prefix — exported as named exports, not default
- Pure utility functions: camelCase verb phrase (`autoArrangeFurniture`, `cloneTemplateFurniture`, `getMaterialByName`)
- Internal helpers: camelCase, unexported (`withFreshIds`, `getFurnitureType`, `validatePhoto`, `cloneFurniture`)

**Variables:**
- camelCase throughout
- Boolean state variables: descriptive adjective/noun (`isDraggingFurniture`, `showDropzone`, `isLoaded`)
- ID strings: `selectedId`, `draggingId`, `hoveredId`

**Types/Interfaces:**
- Interfaces: PascalCase with no `I` prefix (`FurnitureItem`, `RoomLayout`, `HistoryContextValue`)
- Local prop types: defined inline as `type XxxProps = { ... }` using `type` keyword, not `interface`
- Context types: `interface` for the context value shape
- Union/literal types: `type TemplateCategory = 'minimalist' | 'maximalist' | 'eclectic'`
- Discriminated union return types used for validation results (see `validatePhoto` in `src/app/api/convert-photo/route.ts`)

## Code Style

**Formatting:**
- No `.prettierrc` present — formatting enforced only by ESLint/TypeScript
- Single quotes for string literals in `.ts`/`.tsx` files
- Template literals used when interpolating values
- Trailing commas on multi-line objects/arrays
- Semicolons present throughout

**Linting:**
- ESLint 9 flat config via `eslint.config.mjs`
- `eslint-config-next/core-web-vitals` + `eslint-config-next/typescript`
- TypeScript strict mode enabled (`"strict": true` in `tsconfig.json`)
- No `any` types except one residual case (`category: any` in `src/app/page.tsx` line 274)

## Import Organization

**Order:**
1. React and framework packages (`react`, `next/*`, `@react-three/*`)
2. Third-party packages (`three`, `leva`, `gsap`)
3. Internal path-alias imports (`@/components/...`, `@/hooks/...`, `@/lib/...`, `@/types`)
4. Relative imports (`./RoomEnvironment`, `./FurnitureGeometries`)

**Path Aliases:**
- `@/*` maps to `src/*` — used everywhere except for same-directory relative imports

**Type-only imports:**
- `import type { ... }` used consistently for type-only imports (`import type { FurnitureItem } from '@/types'`)

## Component Design

**Props Pattern:**
- Props defined as a local `type XxxProps = { ... }` before the component
- Destructured in the function signature with defaults: `onSelectChange = () => {}`
- `Readonly<XxxProps>` wrapper applied to all component prop types
- Optional props use `?` with sensible defaults in the destructure

**Client Components:**
- All interactive components start with `'use client'` directive
- Server-only code (API routes, lib utilities with no browser APIs) omits the directive
- `src/app/layout.tsx` uses `'use client'` due to wrapping `HistoryProvider` (context)

**Conditional Rendering:**
- Use `{condition && <Component />}` or `{condition ? <A /> : null}` — both patterns present
- Derived booleans extracted to named variables before JSX: `const showClearButton = designerModelUrl && !showDropzone`

**Accessibility:**
- `aria-label` provided on all icon-only buttons and inputs
- Semantic HTML used: `<nav>`, `<aside>`, `<dialog>` in UI components
- `disabled` state on buttons with visual feedback (`disabled:opacity-30 disabled:cursor-not-allowed`)

## Error Handling

**Patterns:**
- `try/catch` with typed narrowing: `error instanceof Error ? error.message : 'Unknown error'`
- localStorage operations always wrapped in `try/catch` with `console.error` fallback
- API route errors return structured `{ error: string }` JSON with appropriate HTTP status codes
- Validation functions return discriminated union: `{ valid: true; file: File } | { valid: false; message: string }`
- Async hooks use local state: `const [error, setError] = useState<string | null>(null)`

**No Throw Pattern:**
- Functions prefer returning `null` or `false` over throwing, especially in hooks and lib utilities
- API route handler wraps everything in `try/catch` and returns `NextResponse.json({ error: message }, { status: 500 })`

## Logging

**Framework:** `console.error` only — no logging library

**Patterns:**
- `console.error` used exclusively for localStorage failures in `src/hooks/useCustomTemplates.ts`
- No `console.log` or `console.warn` in production code
- Errors surfaced to users via the toast system (`useToast`) not console

## Browser/Global API Access

**Pattern:**
- All browser APIs guarded: `typeof globalThis.window === 'object'`, `typeof document === 'undefined'`
- Prefer `globalThis.*` over bare `window.*` for SSR compatibility (see `src/lib/share.ts`, `src/lib/storage.ts`)
- Event listeners attached via `globalThis.addEventListener` (see `src/hooks/useUndoRedo.ts`)
- `typeof window !== 'undefined'` guard before `localStorage` access in hooks

## State Management

**Pattern:** React state only — no external state manager

- Local component state: `useState`
- Derived state: computed inline in render, not stored in state
- Shared state across tree: React Context (`HistoryProvider` in `src/hooks/useHistory.tsx`)
- All state-mutating callbacks wrapped in `useCallback`
- `useMemo` used for context values to prevent unnecessary re-renders

## Module Design

**Exports:**
- Components: default export (one per file)
- Hooks: named exports
- Lib utilities: named exports (functions + constants)
- Types: named exports from `src/types/index.ts`

**Barrel Files:**
- `src/types/index.ts` serves as type barrel
- No barrel `index.ts` for components, hooks, or lib — direct imports used

## Comments

**When to Comment:**
- Inline comments on non-obvious logic: `// Rotate around Y-axis (vertical rotation)`
- Section separators for long files: `// ORGANIC MATERIALS`, `// TECH MATERIALS`
- Explanatory comments on workarounds: `// Used only to force a re-render after save/delete operations.`

**JSDoc/TSDoc:**
- Not used — no JSDoc annotations on functions or types

---

*Convention analysis: 2026-03-07*
