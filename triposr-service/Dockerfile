# TripoSR Service — CUDA-capable image, falls back to CPU if no GPU available
FROM pytorch/pytorch:2.2.0-cuda12.1-cudnn8-runtime

WORKDIR /app

# System deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    git \
    libgl1 \
    libglib2.0-0 \
  && rm -rf /var/lib/apt/lists/*

# Python deps from requirements.txt (torch already in base image)
COPY requirements.txt .
RUN pip install --no-cache-dir \
    fastapi==0.110.0 \
    uvicorn==0.27.1 \
    python-multipart==0.0.9 \
    "Pillow==10.2.0" \
    "trimesh[easy]==4.1.4" \
    "rembg==2.0.56" \
    "huggingface-hub==0.20.3"

# Install TripoSR from source
RUN pip install --no-cache-dir git+https://github.com/VAST-AI-Research/TripoSR.git

COPY server.py .

# Model weights and generated GLBs are stored in volumes
RUN mkdir -p /app/output /root/.cache/huggingface

EXPOSE 8000

CMD ["python", "-m", "uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000", "--log-level", "info"]
