# Quick Reference Guide - Solarpunk Interiors

**Last Updated**: March 6, 2026 Session 5  
**Status**: MVP Complete + Phase 2 Ready  
**Next Session**: Photo-to-3D Feature Implementation

## 🚀 Start Here

### For Next Session (5 min setup)

```bash
# 1. Navigate to project
cd m:\Repo\Patri-Web\solarpunk-interiors

# 2. Start dev server
npm run dev

# 3. Open in browser
# http://localhost:3000

# 4. Verify it works
# - Should see 3D scene with furniture
# - Help text at bottom
# - No console errors
```

### Documentation Files (Read in Order)

1. **PROGRESS.md** - What's been done, what's next
2. **IMPLEMENTATION_GUIDE.md** - Step-by-step feature building
3. **SESSION_CHECKPOINTS.md** - Session status & verification
4. **ROADMAP.md** - Long-term vision
5. **This file** - Quick reference
6. **QUICKSTART.md** - User guide (for users, not devs)

## 📊 Current State

### Working Features ✅

- 6 furniture types in library
- Drag-drop placement
- Arrow keys for movement (0.5 unit steps)
- Q/E rotation (15° steps)
- +/- scaling (10% steps, 50-300% range)
- Grid overlay with toggle
- Undo/redo (50-state buffer)
- Save/load layouts
- Hover indicators
- Direction arrow on selection

### Ready to Build 🠶

- Photo-to-3D conversion
- Material customization
- Layout templates
- Collaboration features

## 🔑 Key Files

### State Management

- `src/app/page.tsx` - Main component, state management
- `src/types/index.ts` - FurnitureItem, RoomLayout types
- `src/lib/storage.ts` - Save/load logic

### Controls/Hooks

- `src/hooks/useArrowKeyMovement.ts` - ↑↓←→ position
- `src/hooks/useRotationControls.ts` - Q/E rotation
- `src/hooks/useScalingControls.ts` - +/- scaling
- `src/hooks/useHistory.tsx` - Undo/redo

### 3D Scene

- `src/experiences/SolarpunkRoom.tsx` - Canvas + scene setup
- `src/experiences/RoomEnvironment.tsx` - Lights + environment
- `src/components/3d/EditableFurniture.tsx` - Interactive furniture
- `src/components/3d/FurnitureGeometries.tsx` - 6 shapes
- `src/components/3d/FloorGrid.tsx` - Grid overlay

### UI Components

- `src/components/ui/FurniturePanel.tsx` - Left sidebar
- `src/components/ui/Toolbar.tsx` - Top toolbar
- `src/components/ui/LayoutControls.tsx` - Save/load panel
- `src/components/leva/SceneControls.tsx` - Leva GUI

## ⌨️ Keyboard Shortcuts (Complete Map)

```
POSITION       Arrow Keys ↑↓←→  (0.5 units each)
ROTATION       Q / E            (15 degrees each)
SCALING        + / -            (10% each)
DELETE         Delete           (remove item)
DUPLICATE      Ctrl+D           (copy + offset)
DESELECT       Esc              (unselect)
UNDO           Ctrl+Z
REDO           Ctrl+Y
```

## 🎯 Implementation Checklist (Phase 2)

### Pre-Implementation

- [ ] Read: IMPLEMENTATION_GUIDE.md
- [ ] Setup: MESHY_API_KEY in .env.local
- [ ] Verify: Dev server running
- [ ] Test: Current features working

### Phase 1: Environment (15 min)

- [ ] Create .env.local with MESHY_API_KEY
- [ ] Verify Meshy.ai account & API key
- [ ] Confirm dependencies installed

### Phase 2: API Route (45 min)

- [ ] Create `src/app/api/convert-photo/route.ts`
- [ ] Implement POST handler
- [ ] Add Meshy.ai integration
- [ ] Implement polling logic
- [ ] Test with curl/Postman

### Phase 3: Hook (30 min)

- [ ] Create `src/hooks/usePhotoTo3D.ts`
- [ ] Implement conversion logic
- [ ] Add state management
- [ ] Test TypeScript compilation

### Phase 4: Component (60 min)

- [ ] Create `src/components/PhotoDropzone.tsx`
- [ ] Add drag-drop handling
- [ ] Implement Framer Motion animations
- [ ] Add file preview
- [ ] Test component rendering

### Phase 5: Integration (45 min)

- [ ] Update `src/experiences/SolarpunkRoom.tsx`
- [ ] Import PhotoDropzone
- [ ] Create DesignerModel component
- [ ] Add state management
- [ ] Test model loading

### Phase 6: Testing (45 min)

- [ ] Test photo upload
- [ ] Verify conversion
- [ ] Check GLB loading
- [ ] Test error handling
- [ ] Mobile testing
- [ ] Performance check

## 📦 Dependencies

### Core (already installed)

```json
{
  "next": "16.x",
  "react": "19.x",
  "three": "0.183.x",
  "react-three-fiber": "latest",
  "@react-three/drei": "latest",
  "@react-three/postprocessing": "latest",
  "leva": "latest",
  "zustand": "latest",
  "lucide-react": "latest",
  "tailwindcss": "latest",
  "typescript": "latest"
}
```

### New For Phase 2

```json
{
  "framer-motion": "^latest"
}
```

Install with:

```bash
npm install framer-motion
```

## 🔐 Environment Variables

### Required

```env
MESHY_API_KEY=your_api_key_from_meshy_ai
```

### Optional

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
NODE_ENV=development
```

### Getting MESHY_API_KEY

1. Go to https://meshy.ai
2. Sign up (free account)
3. Navigate to API section
4. Create/copy API key
5. Add to .env.local
6. Restart dev server

## 🧪 Testing Quick Commands

```bash
# Run dev server
npm run dev

# Check for TS errors
npm run type-check

# Lint code
npm run lint

# Build for production
npm run build

# Test API route (after implementation)
curl -X POST http://localhost:3000/api/convert-photo \
  -F "photo=@test_image.jpg"
```

## 🐛 Common Issues & Quick Fixes

| Issue                   | Solution                                          |
| ----------------------- | ------------------------------------------------- |
| MESHY_API_KEY undefined | Add to .env.local, restart server                 |
| Dev server won't start  | `rm -r .next && npm install && npm run dev`       |
| TypeScript errors       | Check file paths, verify imports                  |
| Drag-drop not working   | Inspect browser console, check event handlers     |
| GLB not loading         | Verify URL valid, check CORS, inspect Network tab |
| Slow conversion         | Meshy.ai is async, may take 60+ seconds           |

## 📱 Browser Compatibility

**Tested & Working**:

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Chrome/Safari

**Not Tested**:

- IE 11 (not supported)
- Older browsers

## 💾 Data Structures

### FurnitureItem Type

```typescript
interface FurnitureItem {
  id: string; // Unique identifier
  name: string; // Display name
  type: string; // Furniture type (from library)
  position: [number, number, number]; // X, Y, Z
  rotation: [number, number, number]; // X, Y, Z (radians)
  scale: number; // 0.5 - 3.0 (uniform scaling)
}
```

### RoomLayout Type

```typescript
interface RoomLayout {
  name: string;
  furniture: FurnitureItem[];
  createdAt: string;
  updatedAt: string;
}
```

## 🎨 Styling Guide

### Color Palette

```css
/* Primary solarpunk colors */
--color-primary: #7ddf64;    /* Bioluminescent green */
--color-dark: #2d5016;       /* Forest green */
--color-accent: #d4af37;     /* Solar gold */
--color-base: #1a1a1a;       /* Night black */
--color-teal: #1a3a1a;       /* Teal base */

/* Tailwind corresponding */
.text-primary:       #7ddf64  /* via custom config */
.bg-dark-forest:     #2d5016
.text-solar-gold:    #d4af37
```

### Key CSS Classes

```css
.selection-ring   /* Green ring on selected furniture */
.direction-arrow  /* Yellow/green arrow indicator */
.grid-overlay     /* Floor grid pattern */
.hover-state      /* Dim green circle on hover */
```

## 🚦 Deployment Checklist

**Before Production**:

- [ ] All tests passing
- [ ] No console errors
- [ ] Performance tested
- [ ] Mobile responsive verified
- [ ] API endpoints secured
- [ ] Error handling complete
- [ ] Documentation updated

**Deploy Command**:

```bash
npm run build
npm run start
# Or push to Vercel (auto-deployment)
git push
```

## 📞 Getting Help

1. **For quick issues**: Check this file's "Common Issues"
2. **For feature details**: Review IMPLEMENTATION_GUIDE.md
3. **For status**: Check SESSION_CHECKPOINTS.md
4. **For vision**: Review ROADMAP.md
5. **For code**: Check relevant session update file (SESSION*UPDATE*\*.md)

## ✅ Status Green Lights

Before starting:

```
✅ Dev server running
✅ No console errors
✅ All 6 furniture types visible
✅ Keyboard shortcuts working
✅ Save/load functioning
✅ Undo/redo responding
```

## 🎯 Success is When...

**End of Phase 2 (Photo-to-3D)**:

- User drags photo onto canvas
- Dropzone appears with animations
- Photo converts to 3D in ~60s
- GLB model loads in scene
- Model can be manipulated (move/rotate/scale)
- Can save layout with model
- Error messages are helpful

## 🔄 Session Pattern

Each session follows:

1. Verify current state (5 min)
2. Review docs (10 min)
3. Implement feature phase (30-60 min)
4. Test thoroughly (15-30 min)
5. Update docs (10 min)
6. Commit changes (5 min)

**Total per session**: 1-3 hours productive work

## 📊 Progress So Far

| Item                        | Status   | Sessions |
| --------------------------- | -------- | -------- |
| Furniture Library (6 types) | ✅ Done  | 1        |
| Grid + Arrows               | ✅ Done  | 2        |
| Rotation Controls           | ✅ Done  | 3        |
| Scaling Controls            | ✅ Done  | 4        |
| Documentation               | ✅ Done  | 5        |
| Photo-to-3D API             | 🠶 Next   | 6        |
| Photo-to-3D UI              | 🠶 Next   | 6        |
| Materials                   | 🠶 Future | 7-8      |
| Templates                   | 🠶 Future | 9        |
| Collaboration               | 🠶 Future | 10-11    |

---

**You are here**: End of Session 5 ✓  
**Next milestone**: Photo-to-3D feature complete  
**Then**: Material customization & templates

🚀 **Ready to build?** Follow IMPLEMENTATION_GUIDE.md Phase 1!
