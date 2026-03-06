import * as THREE from 'three';

export const SOLARPUNK_MATERIALS = {
  greenFloor: new THREE.MeshStandardMaterial({
    color: 0x1a3a1a,
    metalness: 0.2,
    roughness: 0.1,
  }),

  ecoBrick: new THREE.MeshStandardMaterial({
    color: 0x2d5016,
    metalness: 0.1,
    roughness: 0.8,
  }),

  panel: new THREE.MeshStandardMaterial({
    color: 0x00ff00,
    emissive: 0x00cc00,
    emissiveIntensity: 0.5,
    metalness: 0.8,
    roughness: 0.2,
  }),

  plant: new THREE.MeshStandardMaterial({
    color: 0x4a7c59,
    emissive: 0x7ddf64,
    emissiveIntensity: 0.3,
    metalness: 0.2,
    roughness: 0.6,
  }),
};

export interface LightingConfig {
  ambientIntensity: number;
  ambientColor: string;
  pointIntensity: number;
  pointColor: string;
  directionIntensity: number;
}

export const SOLAR_LIGHTING: LightingConfig = {
  ambientIntensity: 0.6,
  ambientColor: '#d4af37',
  pointIntensity: 1.5,
  pointColor: '#7ddf64',
  directionIntensity: 0.8,
};

export const NIGHT_MODE: LightingConfig = {
  ambientIntensity: 0.3,
  ambientColor: '#1a3a1a',
  pointIntensity: 2,
  pointColor: '#00ff00',
  directionIntensity: 0.2,
};
