'use client';

import { useGLTF } from '@react-three/drei';

// Simple cache for preloaded models
const modelCache: Record<string, any> = {};

export function useModelLoader(path: string) {
  // Preload model on first use
  if (!modelCache[path]) {
    useGLTF.preload(path);
    modelCache[path] = true;
  }

  return useGLTF(path);
}
