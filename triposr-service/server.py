"""
TripoSR Local API Service
Provides photo-to-3D conversion endpoint for Solarpunk Interiors app.
Optimized for RTX 2070 8GB VRAM.
"""

import os
import uuid
import tempfile
from pathlib import Path
from typing import Optional
import io

from fastapi import FastAPI, File, UploadFile, HTTPException, Header
from fastapi.responses import JSONResponse, FileResponse
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import torch

app = FastAPI(title="TripoSR Service", version="1.0.0")

# CORS for Next.js dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration
OUTPUT_DIR = Path("./output")
OUTPUT_DIR.mkdir(exist_ok=True)

MODEL = None
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
API_TOKEN = os.getenv("TRIPOSR_API_TOKEN", None)

# RTX 2070 optimizations
MAX_IMAGE_SIZE = 512  # Lower resolution for 8GB VRAM
USE_FP16 = True  # Half precision


def load_model():
    """Load TripoSR model with memory optimizations."""
    global MODEL
    if MODEL is not None:
        return MODEL

    print(f"Loading TripoSR model on {DEVICE}...")

    try:
        # Try importing TripoSR
        from tsr.system import TSR

        MODEL = TSR.from_pretrained(
            "stabilityai/TripoSR",
            config_name="config.yaml",
            weight_name="model.ckpt",
        )

        MODEL.renderer.set_chunk_size(8192)  # Reduce chunk size for 8GB VRAM
        MODEL.to(DEVICE)

        if USE_FP16 and DEVICE == "cuda":
            MODEL = MODEL.half()

        print("✓ TripoSR model loaded successfully")
        return MODEL

    except ImportError:
        print("ERROR: TripoSR not installed. Installing...")
        os.system("pip install git+https://github.com/VAST-AI-Research/TripoSR.git")
        print("Please restart the service after installation.")
        raise HTTPException(
            status_code=500,
            detail="TripoSR not installed. Run: pip install git+https://github.com/VAST-AI-Research/TripoSR.git",
        )
    except Exception as e:
        print(f"ERROR loading model: {e}")
        raise HTTPException(status_code=500, detail=f"Model load failed: {str(e)}")


def verify_token(authorization: Optional[str] = Header(None)):
    """Verify API token if configured."""
    if API_TOKEN and authorization != f"Bearer {API_TOKEN}":
        raise HTTPException(status_code=401, detail="Invalid or missing token")


def preprocess_image(image: Image.Image) -> Image.Image:
    """Preprocess image for TripoSR with VRAM optimization."""
    # Remove background
    try:
        from rembg import remove

        image = remove(image)
    except Exception as e:
        print(f"Warning: Background removal failed: {e}")

    # Resize to fit VRAM constraints
    image.thumbnail((MAX_IMAGE_SIZE, MAX_IMAGE_SIZE), Image.Resampling.LANCZOS)

    # Ensure RGBA
    if image.mode != "RGBA":
        image = image.convert("RGBA")

    return image


def generate_3d_model(image: Image.Image, output_path: Path) -> Path:
    """Generate 3D model from image using TripoSR."""
    model = load_model()

    print("Preprocessing image...")
    processed_image = preprocess_image(image)

    print("Generating 3D model...")
    with torch.no_grad():
        scene_codes = model([processed_image], device=DEVICE)

    print("Extracting mesh...")
    meshes = model.extract_mesh(scene_codes)
    mesh = meshes[0]

    print(f"Saving GLB to {output_path}")
    mesh.export(str(output_path))

    return output_path


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "service": "TripoSR Local API",
        "status": "running",
        "device": DEVICE,
        "model_loaded": MODEL is not None,
    }


@app.post("/convert")
async def convert_photo(
    photo: UploadFile = File(...), authorization: Optional[str] = Header(None)
):
    """
    Convert a photo to a 3D GLB model.

    Returns immediate response with glbUrl.
    """
    verify_token(authorization)

    if not photo.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    try:
        # Read image
        contents = await photo.read()
        image = Image.open(io.BytesIO(contents))

        # Generate unique filename
        task_id = str(uuid.uuid4())
        output_file = OUTPUT_DIR / f"{task_id}.glb"

        # Generate 3D model
        generate_3d_model(image, output_file)

        # Return URL to GLB file
        glb_url = f"http://127.0.0.1:8000/output/{task_id}.glb"

        return JSONResponse(
            {
                "success": True,
                "glbUrl": glb_url,
                "taskId": task_id,
                "message": "3D model generated successfully",
            }
        )

    except Exception as e:
        print(f"Conversion error: {e}")
        raise HTTPException(status_code=500, detail=f"Conversion failed: {str(e)}")


@app.get("/output/{filename}")
async def serve_output(filename: str):
    """Serve generated GLB files."""
    file_path = OUTPUT_DIR / filename

    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")

    return FileResponse(
        path=file_path, media_type="model/gltf-binary", filename=filename
    )


@app.get("/health")
async def health_check():
    """Detailed health check."""
    return {
        "status": "healthy",
        "device": DEVICE,
        "cuda_available": torch.cuda.is_available(),
        "model_loaded": MODEL is not None,
        "output_dir": str(OUTPUT_DIR.absolute()),
    }


if __name__ == "__main__":
    import uvicorn

    print("=" * 60)
    print("TripoSR Local Service for Solarpunk Interiors")
    print("=" * 60)
    print(f"Device: {DEVICE}")
    print(f"Max image size: {MAX_IMAGE_SIZE}px")
    print(f"FP16 mode: {USE_FP16}")
    print(f"Output directory: {OUTPUT_DIR.absolute()}")
    print("=" * 60)

    uvicorn.run(app, host="127.0.0.1", port=8000, log_level="info")
