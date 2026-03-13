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

export type FurnitureType =
  | 'plant'
  | 'panel'
  | 'tower'
  | 'chair'
  | 'table'
  | 'lamp'
  | 'sofa'
  | 'bookshelf'
  | 'rug'
  | 'desk'
  | 'mirror'
  | 'vase'
  | 'curtain'
  | 'bed';

export interface FurnitureItem {
  id: string;
  name: string;
  type?: FurnitureType; // Explicit geometry type — takes priority over id-prefix lookup
  modelPath: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
  materialName?: string; // Optional material from SOLARPUNK_MATERIALS library
}

export interface RoomLayout {
  id: string;
  name: string;
  timestamp: number;
  furniture: FurnitureItem[];
  designerModelUrl?: string;
  lighting: {
    ambientIntensity: number;
    pointIntensity: number;
  };
}

export type TemplateCategory = 'minimalist' | 'maximalist' | 'eclectic';

export interface LayoutTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  previewImage?: string;
  furniture: FurnitureItem[];
  lighting: {
    ambientIntensity: number;
    pointIntensity: number;
  };
}
