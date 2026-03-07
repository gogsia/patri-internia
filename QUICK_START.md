# 🚀 Quick Start Guide - Complete Setup

Get the full Solarpunk Interiors app with photo-to-3D conversion running in 15 minutes.

## Prerequisites

- ✅ Windows 10/11
- ✅ Node.js 20+
- ✅ Python 3.9+
- ✅ NVIDIA GPU with CUDA support (RTX 2070 or better)
- ✅ 16GB+ RAM
- ✅ 10GB free disk space

## Step 1: Set Up Next.js App (5 min)

```bash
# In project root
npm install
```

## Step 2: Set Up TripoSR Service (5 min)

```bash
cd triposr-service
setup.bat
```

This will:

- Create Python virtual environment
- Install dependencies
- Install TripoSR from GitHub

## Step 3: Configure Environment (1 min)

Copy `.env.local.example` to `.env.local`:

```bash
# In project root
copy .env.local.example .env.local
```

Verify it contains:

```env
TRIPOSR_API_URL=http://127.0.0.1:8000
```

## Step 4: Start Services (2 min)

### Terminal 1: Start TripoSR Service

```bash
cd triposr-service
start-server.bat
```

Wait for "Model loaded successfully" message.

### Terminal 2: Start Next.js App

```bash
# In project root
npm run dev
```

## Step 5: Test the App (2 min)

1. Open http://localhost:3000
2. Click **"Import Designer Photo"** button (top-left)
3. Drop or choose an interior photo
4. Wait 10-20 seconds for conversion
5. Your 3D model appears in the scene!

## Verification

Test your TripoSR service:

```bash
cd triposr-service
test-service.bat
```

Or with a test image:

```bash
test-service.bat path\to\test-image.jpg
```

## Common Issues

### "Service not running"

Make sure you started `start-server.bat` and see:

```
✓ TripoSR model loaded successfully
Uvicorn running on http://127.0.0.1:8000
```

### "CUDA out of memory"

1. Close other GPU applications
2. Lower image resolution in `server.py`:
   ```python
   MAX_IMAGE_SIZE = 384
   ```
3. Restart service

### "Import button does nothing"

1. Check browser console (F12) for errors
2. Verify `.env.local` has correct `TRIPOSR_API_URL`
3. Test service with `test-service.bat`

## Architecture Overview

```
┌─────────────────┐         ┌──────────────────┐
│   Browser       │  HTTP   │   Next.js App    │
│  localhost:3000 ├────────►│   (port 3000)    │
└─────────────────┘         └────────┬─────────┘
                                     │ API call
                                     ▼
                            ┌────────────────────┐
                            │  TripoSR Service   │
                            │   (port 8000)      │
                            │                    │
                            │  ┌──────────────┐  │
                            │  │   TripoSR    │  │
                            │  │   Model      │  │
                            │  │  (GPU/VRAM)  │  │
                            │  └──────────────┘  │
                            └────────────────────┘
```

## File Structure

```
solarpunk-interiors/
├── src/                     # Next.js app source
│   ├── app/
│   │   └── api/
│   │       └── convert-photo/
│   │           └── route.ts  # API endpoint
│   ├── components/
│   │   └── PhotoDropzone.tsx # Upload UI
│   └── hooks/
│       └── usePhotoTo3D.ts   # Client hook
├── triposr-service/         # Python service
│   ├── server.py            # FastAPI server
│   ├── setup.bat            # First-time setup
│   ├── start-server.bat     # Start script
│   └── test-service.bat     # Validation script
├── .env.local               # Environment config
└── package.json
```

## Next Steps

Once everything works:

1. **Try different photos**: Interior design images work best
2. **Adjust lighting**: Use Leva GUI (top-right) to tweak scene
3. **Save layouts**: Use the save/load controls to persist designs
4. **Customize**: Edit furniture library, colors, and controls

## Performance Tips

### RTX 2070 Optimization

- Default settings are pre-optimized for your GPU
- Expected conversion time: 10-20 seconds
- Lower `MAX_IMAGE_SIZE` if you get OOM errors

### Photo Quality Tips

- **Best**: Clear interior photos with good lighting
- **Good**: Front-facing furniture photos
- **OK**: Room panoramas (may need cropping)
- **Avoid**: Heavily shadowed, blurry, or low-res images

## Development Workflow

```bash
# Terminal 1: Keep service running
cd triposr-service
start-server.bat

# Terminal 2: Next.js with hot reload
npm run dev

# Make code changes, browser auto-refreshes
# Service stays running in background
```

## Production Deployment

For production use, you'll need:

1. Dedicated GPU server for TripoSR
2. Message queue (Redis + Celery) for async processing
3. Object storage (S3/Azure Blob) for GLB files
4. Load balancer for multiple workers
5. HTTPS with proper CORS configuration

See `IMPLEMENTATION_GUIDE.md` for detailed production setup.

## Support

- Check `triposr-service/README.md` for service-specific docs
- Check `IMPLEMENTATION_GUIDE.md` for detailed API documentation
- Run `test-service.bat` to diagnose issues

---

**Estimated Total Time**: 15 minutes  
**Disk Space Used**: ~8GB (models + dependencies)  
**GPU Memory**: ~4-6GB during conversion
