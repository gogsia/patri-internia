# Testing Patterns

**Analysis Date:** 2026-03-07

## Test Framework

**Runner:**
- None — no test framework is installed or configured
- No `jest.config.*`, `vitest.config.*`, or equivalent found
- No test runner in `package.json` scripts (`dev`, `build`, `start`, `lint` only)

**Assertion Library:**
- None

**Run Commands:**
- No test command exists. `npm run lint` is the only code-quality script.

## Test File Organization

**Location:**
- No test files exist anywhere in the codebase
- No `__tests__` directories
- No `*.test.ts`, `*.test.tsx`, `*.spec.ts`, or `*.spec.tsx` files

**Naming:**
- Not applicable — no established pattern exists

## Test Coverage

**Requirements:** None enforced

**Current Coverage:** 0% — the codebase has no automated tests of any kind

## What Exists Instead of Tests

The project relies on:
1. **TypeScript strict mode** (`"strict": true` in `tsconfig.json`) for type safety at compile time
2. **ESLint** with `eslint-config-next/core-web-vitals` for code quality
3. **Manual browser testing** (implied by the interactive 3D nature of the app)

## Recommended Test Strategy (for new test additions)

**Suggested Framework:**
- Vitest — aligns well with the Next.js/TypeScript stack; install with `npm install -D vitest @vitejs/plugin-react`
- React Testing Library for component tests: `npm install -D @testing-library/react @testing-library/user-event`

**Suggested Config File:** `vitest.config.ts` at project root

**Run Commands (proposed):**
```bash
npx vitest              # Run all tests
npx vitest --watch      # Watch mode
npx vitest --coverage   # Coverage report
```

## Highest-Value Test Targets

The following pure functions in `src/lib/` have no side effects and are straightforward to unit test:

**`src/lib/layoutTemplates.ts`:**
- `autoArrangeFurniture(items)` — deterministic grid positioning
- `remixFurniture(items)` — deterministic circular arrangement
- `cloneTemplateFurniture(template)` — snapshot of ID generation

**`src/lib/utils.ts`:**
- `cn(...classes)` — trivial string concatenation

**`src/lib/materials.ts`:**
- `getMaterialByName(name)` — returns cloned material or default
- `getMaterialsByCategory(category)` — filter by category enum

**`src/lib/colorSchemes.ts`:**
- `getFurnitureCategory(name)` — name-to-category mapping

**`src/app/api/convert-photo/route.ts`:**
- `validatePhoto(photo)` — discriminated union validation logic (pure, no I/O)

**`src/lib/storage.ts`:**
- `getLayouts()`, `saveLayout()`, `removeLayout()` — require `localStorage` mock

## Hook Testing Guidance

Custom hooks in `src/hooks/` that have testable logic:

**`src/hooks/useHistory.tsx`** — `HistoryProvider` + `useHistory()`
- Push/undo/redo state transitions
- 50-entry cap enforcement
- `canUndo`/`canRedo` derived flags
- Requires wrapping in `HistoryProvider` in tests

**`src/hooks/useToast.ts`:**
- `show`, `success`, `error`, `info`, `dismiss` state transitions

**`src/hooks/useCustomTemplates.ts`:**
- Requires `localStorage` mock (`vi.stubGlobal('localStorage', ...)`)

## Mocking Guidance

**What to mock:**
- `localStorage` — use `vi.stubGlobal` or `jsdom` environment
- `globalThis.navigator.share` — stub for share API tests
- `fetch` — mock for `usePhotoTo3D` and API route tests
- Three.js constructors (`THREE.MeshStandardMaterial`) — mock in unit tests of `src/lib/materials.ts`

**What NOT to mock:**
- Pure utility functions in `src/lib/` — test them directly
- Type guards and validation logic — test with real inputs

## Fixtures and Factories

**No fixtures exist.** For new tests, recommended factory pattern based on existing types:

```typescript
// Example factory matching src/types/index.ts
function makeFurnitureItem(overrides?: Partial<FurnitureItem>): FurnitureItem {
  return {
    id: 'plant-1',
    name: 'Test Plant',
    modelPath: '/models/test.glb',
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: 1,
    ...overrides,
  };
}
```

**Fixture Location (proposed):** `src/__tests__/fixtures/` or co-located `__fixtures__/` directories

## Test Types

**Unit Tests:**
- Target: pure lib functions, validation logic, hook state machines
- No browser/canvas APIs needed

**Integration Tests:**
- Target: hook + context interactions (`useHistory` + `HistoryProvider`)
- Requires React Testing Library + jsdom

**E2E Tests:**
- Not configured. Playwright would suit this app given heavy 3D canvas interaction.
- Canvas testing is inherently difficult — screenshot diffing via Playwright is preferred over DOM assertions

## Common Patterns (proposed, based on codebase conventions)

**Async Testing (for hooks):**
```typescript
import { renderHook, act } from '@testing-library/react';
import { useToast } from '@/hooks/useToast';

it('adds and dismisses a toast', () => {
  const { result } = renderHook(() => useToast());
  act(() => { result.current.success('Saved'); });
  expect(result.current.toasts).toHaveLength(1);
  act(() => { result.current.dismiss(result.current.toasts[0].id); });
  expect(result.current.toasts).toHaveLength(0);
});
```

**Error Testing (for API validation):**
```typescript
import { validatePhoto } from '@/app/api/convert-photo/route'; // if exported

it('rejects non-image files', () => {
  const file = new File(['text'], 'doc.txt', { type: 'text/plain' });
  const result = validatePhoto(file);
  expect(result.valid).toBe(false);
});
```

---

*Testing analysis: 2026-03-07*
