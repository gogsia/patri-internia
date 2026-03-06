import * as THREE from "three";

export interface SceneProps {
  pixelSize?: number;
  autoRotate?: boolean;
}

export interface ShaderUniforms {
  uPixelSize: { value: number };
  uTime: { value: number };
  uTexture?: { value: THREE.Texture };
}

export interface FurnitureItem {
  id: string;
  name: string;
  modelPath: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}

export interface RoomLayout {
  id: string;
  name: string;
  timestamp: number;
  furniture: FurnitureItem[];
  lighting: {
    ambientIntensity: number;
    pointIntensity: number;
  };
}
