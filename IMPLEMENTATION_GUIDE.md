# Implementation Guide - Designer Reality Mixer

**Target**: Photo-to-3D conversion feature using local TripoSR service  
**Estimated Duration**: 4-6 hours  
**Difficulty**: Intermediate

## Pre-Implementation Checklist

- [ ] Prepare local TripoSR service endpoint
- [ ] (Optional) Configure bearer token for your local service
- [ ] Copy `.env.local` template and add TRIPOSR_API_URL
- [ ] Verify Node 18+ installed
- [ ] Ensure dev server can run: `npm run dev`
- [ ] Review read.txt file in project root for reference code

## Phase 1: Environment Setup (15 min)

### Step 1.1: Create Environment File

1. In project root (`m:\Repo\Patri-Web\solarpunk-interiors\`), create `.env.local `
2. Add:

```env
TRIPOSR_API_URL=http://127.0.0.1:8000
# Optional if your local service requires auth
TRIPOSR_API_TOKEN=your_local_service_token
NEXT_PUBLIC_API_URL=http://localhost:3000
```

3. Verify file is created (not committed to git)

### Step 1.2: Verify Meshy.ai Account

1. Go to [Meshy.ai](https://meshy.ai)
2. Sign up (free tier: 100 credits/month)
3. Navigate to API section
4. Copy API key
5. Set limit on key to this app's domain

### Step 1.3: Check Dependencies

Current package.json should have:

- `next` 16+
- `react` 19+
- `react-three-fiber` latest
- `three` 0.183+

If missing, run:

```bash
npm install lucide-react framer-motion
```

## Phase 2: API Route Implementation (45 min)

### Step 2.1: Create API Directory

```bash
mkdir -p src/app/api/convert-photo
```

### Step 2.2: Implement Route Handler

**File**: `src/app/api/convert-photo/route.ts`

```typescript
// COMPLETE CODE - Copy as-is
import { NextRequest, NextResponse } from 'next/server';

const MESHY_API_KEY = process.env.MESHY_API_KEY!;
const MESHY_URL = 'https://api.meshy.ai/openapi/v1/image-to-3d';
const POLL_INTERVAL = 2000; // 2 seconds
const MAX_POLLS = 120; // 4 minutes max

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData();
    const photo = form.get('photo') as File;

    // Validation
    if (!MESHY_API_KEY) {
      return NextResponse.json(
        { error: 'MESHY_API_KEY not configured' },
        { status: 500 }
      );
    }

    if (!photo) {
      return NextResponse.json({ error: 'No photo provided' }, { status: 400 });
    }

    if (photo.size > 4 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'Image exceeds 4MB limit' },
        { status: 400 }
      );
    }

    // Convert to base64
    const bytes = await photo.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = `data:${photo.type};base64,${buffer.toString('base64')}`;

    // Call Meshy API to start conversion
    const initResponse = await fetch(MESHY_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${MESHY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_url: base64,
        enable_pbr: true,
        should_remesh: true,
        should_texture: true,
        save_pre_remeshed_model: false,
      }),
    });

    if (!initResponse.ok) {
      const error = await initResponse.text();
      console.error('Meshy init error:', error);
      return NextResponse.json(
        { error: `Meshy API init failed: ${error}` },
        { status: 500 }
      );
    }

    const task = await initResponse.json();
    const taskId = task.id;

    // Poll for completion
    let glbUrl = '';
    let pollCount = 0;

    while (!glbUrl && pollCount < MAX_POLLS) {
      await new Promise((r) => setTimeout(r, POLL_INTERVAL));
      pollCount++;

      const statusResponse = await fetch(
        `https://api.meshy.ai/openapi/v1/task/${taskId}`,
        {
          headers: { Authorization: `Bearer ${MESHY_API_KEY}` },
        }
      );

      if (!statusResponse.ok) {
        const error = await statusResponse.text();
        console.error('Meshy status error:', error);
        continue;
      }

      const result = await statusResponse.json();

      if (result.status === 'PENDING' || result.status === 'RUNNING') {
        // Still processing, continue polling
        continue;
      }

      if (result.status === 'FAILED') {
        return NextResponse.json(
          { error: 'Meshy conversion failed on server' },
          { status: 500 }
        );
      }

      if (result.status === 'SUCCESS') {
        glbUrl = result.model_urls?.glb;
        if (!glbUrl) {
          return NextResponse.json(
            { error: 'No GLB URL in response' },
            { status: 500 }
          );
        }
      }
    }

    if (!glbUrl) {
      return NextResponse.json(
        { error: 'Conversion timeout - try again' },
        { status: 504 }
      );
    }

    return NextResponse.json({
      success: true,
      glbUrl,
      thumbnailUrl: task.thumbnail_url,
      message: '3D model ready!',
      taskId,
    });
  } catch (error) {
    console.error('Route error:', error);
    return NextResponse.json(
      { error: 'Server error during conversion' },
      { status: 500 }
    );
  }
}
```

### Step 2.3: Test API Route

1. Save file
2. Restart dev server: `npm run dev`
3. Verify no build errors
4. Test with curl or Postman:

```bash
curl -X POST http://localhost:3000/api/convert-photo \
  -F "photo=@test_image.jpg"
```

Expected response:

```json
{
  "success": true,
  "glbUrl": "https://d2...",
  "message": "3D model ready!"
}
```

## Phase 3: Client Hook (30 min)

### Step 3.1: Create Hook File

**File**: `src/hooks/usePhotoTo3D.ts`

```typescript
'use client';

import { useState, useCallback } from 'react';

interface ConversionResult {
  success: boolean;
  glbUrl?: string;
  thumbnailUrl?: string;
  error?: string;
}

export function usePhotoTo3D() {
  const [loading, setLoading] = useState(false);
  const [glbUrl, setGlbUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const convert = useCallback(
    async (photo: File): Promise<ConversionResult> => {
      setLoading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append('photo', photo);

        const response = await fetch('/api/convert-photo', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || 'Conversion failed');
          setLoading(false);
          return { success: false, error: data.error };
        }

        setGlbUrl(data.glbUrl);
        setLoading(false);

        return {
          success: true,
          glbUrl: data.glbUrl,
          thumbnailUrl: data.thumbnailUrl,
        };
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error';
        setError(errorMsg);
        setLoading(false);

        return { success: false, error: errorMsg };
      }
    },
    []
  );

  const reset = useCallback(() => {
    setGlbUrl(null);
    setError(null);
    setLoading(false);
  }, []);

  return { convert, glbUrl, error, loading, reset };
}
```

### Step 3.2: Test Hook

1. In a test component, import and use:

```tsx
const { convert, loading, glbUrl } = usePhotoTo3D();
```

2. Verify hook exports correctly (no TypeScript errors)

## Phase 4: PhotoDropzone Component (60 min)

### Step 4.1: Create Component File

**File**: `src/components/PhotoDropzone.tsx`

```typescript
'use client';

import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePhotoTo3D } from '@/hooks/usePhotoTo3D';
import { Upload, Loader2, Sparkles } from 'lucide-react';

interface PhotoDropzoneProps {
  onModelReady: (glbUrl: string) => void;
  className?: string;
}

// Animation variants
const containerVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  dragActive: {
    scale: 1.05,
    boxShadow: '0 0 60px rgba(34, 197, 94, 0.6)',
    transition: { duration: 0.2 }
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.3 }
  }
};

const contentVariants = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: { delay: 0.1 } },
};

export default function PhotoDropzone({
  onModelReady,
  className = '',
}: PhotoDropzoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const { convert, loading, error, glbUrl } = usePhotoTo3D();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      const files = Array.from(e.dataTransfer.files);
      const photoFile = files.find(
        f => f.type.startsWith('image/') && f.size < 4 * 1024 * 1024
      );

      if (photoFile) {
        // Show preview
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result as string);
        reader.readAsDataURL(photoFile);

        // Convert
        const result = await convert(photoFile);
        if (result.glbUrl) {
          setTimeout(() => onModelReady(result.glbUrl!), 800);
        }
      }
    },
    [convert, onModelReady]
  );

  const handleFileInput = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.currentTarget.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);

        const result = await convert(file);
        if (result.glbUrl) {
          setTimeout(() => onModelReady(result.glbUrl!), 800);
        }
      }
    },
    [convert, onModelReady]
  );

  // Hide after successful conversion
  if (glbUrl) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={dropRef}
        className={`
          fixed inset-0 z-50 flex items-center justify-center
          bg-gradient-to-br from-emerald-900/90 via-teal-900/80 to-green-900/90
          backdrop-blur-xl border-4 border-emerald-400/30 ${className}
        `}
        variants={containerVariants}
        initial="initial"
        animate={dragActive ? 'dragActive' : 'animate'}
        exit="exit"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <motion.div
          className="text-center p-12 rounded-2xl bg-white/10 backdrop-blur-2xl border-2 border-white/20 shadow-2xl max-w-md w-full mx-4"
          variants={contentVariants}
          initial="initial"
          animate="animate"
        >
          {/* Icon */}
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center animate-pulse">
            {loading ? (
              <Loader2 className="w-12 h-12 animate-spin text-white" />
            ) : (
              <Upload className="w-12 h-12 text-white drop-shadow-lg" />
            )}
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
            {loading ? 'Converting to 3D...' : 'Drop Designer Photo'}
          </h2>

          {/* Subtitle */}
          <p className="text-emerald-100 mb-6 text-lg">
            Drag interior photo → AI → Solarpunk 3D model
          </p>

          {/* Preview */}
          {preview && (
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <img
                src={preview}
                alt="Preview"
                className="w-full h-32 object-cover rounded-xl shadow-xl"
              />
            </motion.div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-400 rounded-lg">
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          )}

          {/* File Input */}
          <label className="block w-full cursor-pointer mb-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              disabled={loading}
              className="hidden"
            />
            <button
              className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-lg font-semibold transition-all shadow-xl disabled:opacity-50 active:scale-95"
              disabled={loading}
            >
              <Sparkles className="w-4 h-4 mr-2 inline" />
              Choose Photo
            </button>
          </label>

          {/* Helper text */}
          <p className="text-xs text-emerald-200/80">
            JPG/PNG < 4MB • AI magic in ~60s ✨
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
```

### Step 4.2: Add dependencies

If not already installed:

```bash
npm install framer-motion lucide-react
```

### Step 4.3: Test component

Verify no TypeScript errors and component renders correctly.

## Phase 5: Scene Integration (45 min)

### Step 5.1: Update SolarpunkRoom Component

**File**: `src/experiences/SolarpunkRoom.tsx`

Add imports at top:

```typescript
import PhotoDropzone from '@/components/PhotoDropzone';
```

Add state in component:

```typescript
const [designerModelUrl, setDesignerModelUrl] = useState<string | null>(null);
```

Add PhotoDropzone before Canvas closes (inside <Canvas>):

```tsx
<PhotoDropzone onModelReady={(url) => setDesignerModelUrl(url)} />
```

### Step 5.2: Create DesignerModel Component

Add to SolarpunkRoom.tsx:

```tsx
const DesignerModel = ({ url }: { url: string }) => {
  const gltf = useGLTF(url);

  return (
    <group position={[0, 0, 0]} scale={1}>
      <primitive object={gltf.scene} scale={0.5} />
    </group>
  );
};
```

### Step 5.3: Conditionally render model

In Canvas, add:

```tsx
{
  designerModelUrl && <DesignerModel url={designerModelUrl} />;
}
```

## Phase 6: Testing & Polish (45 min)

### Step 6.1: Functional Testing

- [ ] Upload JPG image - should show preview
- [ ] See loading spinner while converting
- [ ] Conversion succeeds - model appears in 3D scene
- [ ] Conversion fails gracefully with error message
- [ ] 4MB+ file rejected with error
- [ ] Mobile file picker works
- [ ] Keyboard controls still work with model loaded

### Step 6.2: Edge Cases

- [ ] Test with low-quality image
- [ ] Test with non-photo (e.g., screenshot)
- [ ] Network timeout handling
- [ ] Rapid consecutive uploads
- [ ] Model positioning when placed

### Step 6.3: Performance

- [ ] Check GLB file size (typically 5-50MB)
- [ ] Monitor memory usage while model loads
- [ ] Verify FPS doesn't drop significantly
- [ ] Test with 5+ models in scene

### Step 6.4: Visual Polish

- [ ] Animation timing feels smooth
- [ ] Preview thumbnail displays nicely
- [ ] Loading states are clear
- [ ] Error messages are helpful
- [ ] Transitions are fluid

## Debugging Checklist

**API not responding**:

- Check MESHY_API_KEY in .env.local is correct
- Verify API key has image-to-3d permissions
- Check console for Network errors
- Use browser DevTools Network tab

**GLB not loading**:

- Verify glbUrl is valid (paste in browser)
- Check Three.js CORS settings
- Ensure useGLTF is imported correctly
- Check browser console for GLB load errors

**Animations not working**:

- Verify framer-motion installed (npm ls)
- Check variants are spelled correctly
- Ensure animate prop is set
- Test with simpler animation first

**File upload fails**:

- Check file size < 4MB
- Verify MIME type is image/\*
- Check FormData construction
- Test with different image formats

## Success Criteria

✅ When complete:

1. Photo dropzone appears on page load
2. Dragging photo over canvas highlights dropzone
3. Uploading photo shows loader
4. After ~60s, 3D model appears in scene
5. Model can be selected/moved/rotated/scaled
6. Save/load preserves model reference
7. No console errors
8. Mobile file picker works
9. Error handling shows user-friendly messages

## Next Steps After Completion

1. Add model texture customization (solarpunk overlay)
2. Implement model positioning UI
3. Add model deletion/replacement
4. Save full scene with imported models
5. Optimize GLB loading (compression, LOD)
6. Add custom material modifications

---

**Total Estimated Time**: 4-6 hours  
**Difficulty**: Intermediate  
**Priority**: High (major UX feature)
