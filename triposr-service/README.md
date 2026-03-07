# TripoSR Local Service

Local photo-to-3D conversion service for Solarpunk Interiors app.

## Hardware Requirements

- **GPU**: RTX 2070 8GB (or better)
- **RAM**: 16GB+ recommended
- **Storage**: 5GB for model weights

## Quick Start

### 1. Install Python Dependencies

```bash
cd triposr-service
pip install -r requirements.txt
```

### 2. Install TripoSR

```bash
pip install git+https://github.com/VAST-AI-Research/TripoSR.git
```

### 3. Start the Service

```bash
python server.py
```

Service will start on `http://127.0.0.1:8000`

### 4. Configure Next.js App

Create `.env.local` in project root:

```env
TRIPOSR_API_URL=http://127.0.0.1:8000
```

### 5. Start Next.js Dev Server

```bash
cd ..
npm run dev
```

Open `http://localhost:3000` and try the photo import feature!

## RTX 2070 8GB Optimizations

The service is pre-configured for your GPU:

- **Max resolution**: 512px (reduces VRAM usage)
- **FP16 mode**: Enabled (half precision)
- **Chunk size**: 8192 (optimized for 8GB)

If you get OOM errors, reduce `MAX_IMAGE_SIZE` in `server.py`:

```python
MAX_IMAGE_SIZE = 384  # Even lower for tight memory
```

## API Endpoints

### `POST /convert`

Upload photo, returns GLB URL immediately.

**Request**:

```bash
curl -X POST http://127.0.0.1:8000/convert \
  -F "photo=@test.jpg"
```

**Response**:

```json
{
  "success": true,
  "glbUrl": "http://127.0.0.1:8000/output/{id}.glb",
  "taskId": "uuid-here",
  "message": "3D model generated successfully"
}
```

### `GET /health`

Check service status.

### `GET /output/{filename}`

Download generated GLB files.

## Optional: API Token

Set environment variable to require authentication:

```bash
set TRIPOSR_API_TOKEN=your_secret_token
python server.py
```

Then add to `.env.local`:

```env
TRIPOSR_API_TOKEN=your_secret_token
```

## Troubleshooting

### CUDA Out of Memory

1. Lower `MAX_IMAGE_SIZE` to 384 or 256
2. Close other GPU applications
3. Restart the service

### TripoSR Import Error

```bash
pip install git+https://github.com/VAST-AI-Research/TripoSR.git
```

### Service Won't Start

Check Python version (3.9+ required):

```bash
python --version
```

### Background Removal Fails

Install rembg separately:

```bash
pip install rembg
```

## Performance

**RTX 2070 8GB expected times**:

- Image preprocessing: 2-3 seconds
- 3D generation: 8-15 seconds
- Total: ~10-20 seconds per image

## Production Deployment

For production use:

1. Use async/queue system (Celery + Redis)
2. Add proper error logging
3. Implement rate limiting
4. Use HTTPS with nginx reverse proxy
5. Set up model caching
6. Monitor GPU memory usage

## License

This service wraps open-source TripoSR (MIT License).
