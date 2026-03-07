'use client';

import { useCallback, useState } from 'react';

const POLL_INTERVAL_MS = 2000;
const MAX_POLL_ATTEMPTS = 120; // 4 minutes client-side — no server timeout risk

type ConvertResult = {
  success: boolean;
  glbUrl?: string;
  error?: string;
};

type StartData = {
  success?: boolean;
  pending?: boolean;
  glbUrl?: string;
  statusUrl?: string;
  taskId?: string;
  error?: string;
};

async function startTask(file: File): Promise<{ ok: boolean; data: StartData }> {
  const formData = new FormData();
  formData.append('photo', file);
  const response = await fetch('/api/convert-photo', { method: 'POST', body: formData });
  const data = (await response.json()) as StartData;
  return { ok: response.ok, data };
}

async function pollForGlb(params: URLSearchParams): Promise<ConvertResult> {
  for (let i = 0; i < MAX_POLL_ATTEMPTS; i++) {
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));

    const response = await fetch(`/api/convert-photo/status?${params}`);
    if (!response.ok) continue;

    const data = (await response.json()) as { status?: string; glbUrl?: string; error?: string };

    if (data.error || data.status === 'FAILED') {
      return { success: false, error: data.error ?? 'TripoSR conversion failed.' };
    }
    if (data.status === 'SUCCEEDED' && data.glbUrl) {
      return { success: true, glbUrl: data.glbUrl };
    }
  }
  return { success: false, error: 'Conversion timed out. Please retry with another image.' };
}

async function runConversion(file: File): Promise<ConvertResult> {
  const { ok, data } = await startTask(file);

  if (!ok || data.error) {
    return { success: false, error: data.error ?? 'Photo conversion failed.' };
  }
  if (data.success && data.glbUrl) {
    return { success: true, glbUrl: data.glbUrl };
  }
  if (data.pending && (data.statusUrl || data.taskId)) {
    const params = new URLSearchParams();
    if (data.statusUrl) params.set('statusUrl', data.statusUrl);
    if (data.taskId) params.set('taskId', data.taskId);
    return pollForGlb(params);
  }
  return { success: false, error: 'Unexpected response from conversion service.' };
}

export function usePhotoTo3D() {
  const [loading, setLoading] = useState(false);
  const [glbUrl, setGlbUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const convert = useCallback(async (file: File): Promise<ConvertResult> => {
    setLoading(true);
    setError(null);

    try {
      const result = await runConversion(file);
      if (result.success && result.glbUrl) {
        setGlbUrl(result.glbUrl);
      } else {
        setError(result.error ?? 'Conversion failed.');
      }
      setLoading(false);
      return result;
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Unknown conversion error.';
      setError(message);
      setLoading(false);
      return { success: false, error: message };
    }
  }, []);

  const reset = useCallback(() => {
    setGlbUrl(null);
    setError(null);
    setLoading(false);
  }, []);

  return { convert, loading, glbUrl, error, reset };
}
