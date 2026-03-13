'use client';

import { useControls } from 'leva';
import { sceneStore } from '@/lib/sceneStore';

export function useSceneControls() {
  return useControls(
    'Scene',
    {
      ambientIntensity: { value: 0.6, min: 0, max: 2, step: 0.05 },
      ambientColor: '#d4af37',
      pointLightIntensity: { value: 1.5, min: 0, max: 4, step: 0.1 },
      pointLightColor: '#7ddf64',
      autoRotate: true,
      autoRotateSpeed: { value: 2, min: 0, max: 8, step: 0.25 },
      enablePixelation: true,
      pixelSize: { value: 6, min: 1, max: 16, step: 1 },
      showGrid: { value: true, label: 'Floor Grid' },
    },
    { store: sceneStore }
  );
}
