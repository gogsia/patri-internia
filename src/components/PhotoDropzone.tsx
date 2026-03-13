'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import Image from 'next/image';
import { usePhotoTo3D } from '@/hooks/usePhotoTo3D';

type PhotoDropzoneProps = {
  onModelReady: (glbUrl: string) => void;
};

const MAX_FILE_SIZE_BYTES = 4 * 1024 * 1024;

export default function PhotoDropzone({
  onModelReady,
}: Readonly<PhotoDropzoneProps>) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const previewObjectUrlRef = useRef<string | null>(null);
  const { convert, loading, error, glbUrl } = usePhotoTo3D();

  // Simulate progress during conversion
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 800);
      return () => clearInterval(interval);
    }
  }, [loading, glbUrl]);

  const displayProgress = glbUrl ? 100 : progress;

  useEffect(() => {
    return () => {
      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
      }
    };
  }, []);

  const processFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) {
        return;
      }

      if (file.size > MAX_FILE_SIZE_BYTES) {
        return;
      }

      setProgress(0);

      if (previewObjectUrlRef.current) {
        URL.revokeObjectURL(previewObjectUrlRef.current);
      }

      const objectUrl = URL.createObjectURL(file);
      previewObjectUrlRef.current = objectUrl;
      setPreviewUrl(objectUrl);

      const result = await convert(file);
      if (result.success && result.glbUrl) {
        onModelReady(result.glbUrl);
      }
    },
    [convert, onModelReady]
  );

  const handleDrag = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.type === 'dragenter' || event.type === 'dragover') {
      setDragActive(true);
    }

    if (event.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    async (event: React.DragEvent) => {
      event.preventDefault();
      event.stopPropagation();
      setDragActive(false);

      const imageFile = Array.from(event.dataTransfer.files).find((f) =>
        f.type.startsWith('image/')
      );
      if (imageFile) {
        await processFile(imageFile);
      }
    },
    [processFile]
  );

  if (glbUrl) {
    return null;
  }

  return (
    <label
      htmlFor="designer-photo-input"
      className={`pointer-events-auto absolute inset-0 z-30 flex items-center justify-center transition ${
        dragActive ? 'bg-emerald-800/30' : 'bg-black/15'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <div className="w-[min(92vw,28rem)] rounded-2xl border border-emerald-300/40 bg-emerald-950/75 p-6 text-center shadow-2xl backdrop-blur">
        <h2 className="text-xl font-bold text-emerald-100">
          Designer Reality Mixer
        </h2>
        <p className="mt-2 text-sm text-emerald-200">
          Drop an interior photo to convert it via local TripoSR into a 3D GLB
          model.
        </p>

        {previewUrl ? (
          <div className="relative mt-4">
            <Image
              src={previewUrl}
              alt="Uploaded preview"
              width={480}
              height={180}
              unoptimized
              className="mx-auto h-28 w-full rounded-lg object-cover"
            />
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/60 backdrop-blur-sm">
                <div className="text-center">
                  <div className="mx-auto mb-2 h-10 w-10 animate-spin rounded-full border-4 border-emerald-300 border-t-transparent"></div>
                  <p className="text-xs font-semibold text-emerald-200">
                    {Math.round(displayProgress)}% Converting...
                  </p>
                </div>
              </div>
            )}
          </div>
        ) : null}

        {!loading && (
          <button
            type="button"
            className="mt-4 inline-block cursor-pointer rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400 disabled:opacity-50"
            onClick={() => fileInputRef.current?.click()}
          >
            Choose Photo
          </button>
        )}

        <input
          id="designer-photo-input"
          ref={fileInputRef}
          type="file"
          accept="image/*"
          disabled={loading}
          className="hidden"
          onChange={async (event) => {
            const selected = event.target.files?.[0];
            if (selected) {
              await processFile(selected);
            }
          }}
        />

        <p className="mt-3 text-xs text-emerald-300">JPG/PNG up to 4MB</p>
        {error ? (
          <div className="mt-3 rounded-lg border border-red-400/50 bg-red-900/30 p-2 text-xs text-red-200">
            <span className="font-semibold">Error:</span> {error}
          </div>
        ) : null}
        {loading && (
          <p className="mt-3 text-xs text-emerald-400">
            Processing on local GPU... This may take 10-20 seconds.
          </p>
        )}
      </div>
    </label>
  );
}
