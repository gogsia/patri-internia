import * as THREE from 'three';

// Material type definition
export interface MaterialDefinition {
  name: string;
  displayName: string;
  category: 'organic' | 'tech' | 'hybrid' | 'luminous';
  description: string;
  material: THREE.MeshStandardMaterial;
}

// Solarpunk Materials Library
export const SOLARPUNK_MATERIALS: Record<string, MaterialDefinition> = {
  // ORGANIC MATERIALS
  ecoWood: {
    name: 'ecoWood',
    displayName: '🌳 Eco Wood',
    category: 'organic',
    description: 'Reclaimed sustainable wood with natural grain',
    material: new THREE.MeshStandardMaterial({
      color: 0x8b6f47,
      metalness: 0.0,
      roughness: 0.85,
    }),
  },

  livingBamboo: {
    name: 'livingBamboo',
    displayName: '🎋 Living Bamboo',
    category: 'organic',
    description: 'Fast-growing bamboo with light grain',
    material: new THREE.MeshStandardMaterial({
      color: 0x9db88f,
      metalness: 0.05,
      roughness: 0.75,
    }),
  },

  coralStone: {
    name: 'coralStone',
    displayName: '🪨 Coral Stone',
    category: 'organic',
    description: 'Lab-grown coral-like mineral composite',
    material: new THREE.MeshStandardMaterial({
      color: 0xe8d5c4,
      metalness: 0.1,
      roughness: 0.9,
    }),
  },

  myceliumFoam: {
    name: 'myceliumFoam',
    displayName: '🍄 Mycelium Foam',
    category: 'organic',
    description: 'Soft biodegradable fungal material',
    material: new THREE.MeshStandardMaterial({
      color: 0xf5ecd7,
      metalness: 0.0,
      roughness: 1.0,
    }),
  },

  // TECH MATERIALS
  solarPanel: {
    name: 'solarPanel',
    displayName: '⚡ Solar Panel',
    category: 'tech',
    description: 'High-efficiency photovoltaic surface',
    material: new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      emissive: 0x0066ff,
      emissiveIntensity: 0.3,
      metalness: 0.9,
      roughness: 0.15,
    }),
  },

  recycledMetal: {
    name: 'recycledMetal',
    displayName: '♻️ Recycled Metal',
    category: 'tech',
    description: 'Upcycled aluminum and steel alloy',
    material: new THREE.MeshStandardMaterial({
      color: 0x8c8c8c,
      metalness: 0.85,
      roughness: 0.4,
    }),
  },

  bioPlastic: {
    name: 'bioPlastic',
    displayName: '🧪 Bio-Plastic',
    category: 'tech',
    description: 'Plant-derived polymer composite',
    material: new THREE.MeshStandardMaterial({
      color: 0xa4d4ae,
      metalness: 0.2,
      roughness: 0.3,
    }),
  },

  smartGlass: {
    name: 'smartGlass',
    displayName: '🔮 Smart Glass',
    category: 'tech',
    description: 'Electrochromic adaptive glass',
    material: new THREE.MeshStandardMaterial({
      color: 0x88ccff,
      metalness: 0.95,
      roughness: 0.05,
      transparent: true,
      opacity: 0.6,
    }),
  },

  // HYBRID MATERIALS
  greenConcrete: {
    name: 'greenConcrete',
    displayName: '🏗️ Green Concrete',
    category: 'hybrid',
    description: 'Carbon-negative concrete composite',
    material: new THREE.MeshStandardMaterial({
      color: 0x6b7c6e,
      metalness: 0.1,
      roughness: 0.85,
    }),
  },

  livingVine: {
    name: 'livingVine',
    displayName: '🌿 Living Vine',
    category: 'hybrid',
    description: 'Self-growing plant-fiber hybrid',
    material: new THREE.MeshStandardMaterial({
      color: 0x4a7c59,
      emissive: 0x7ddf64,
      emissiveIntensity: 0.2,
      metalness: 0.0,
      roughness: 0.7,
    }),
  },

  techWood: {
    name: 'techWood',
    displayName: '🪵 Tech Wood',
    category: 'hybrid',
    description: 'Wood infused with conductive polymers',
    material: new THREE.MeshStandardMaterial({
      color: 0x6a5544,
      emissive: 0x002200,
      emissiveIntensity: 0.1,
      metalness: 0.3,
      roughness: 0.6,
    }),
  },

  // LUMINOUS MATERIALS
  bioluminescent: {
    name: 'bioluminescent',
    displayName: '💡 Bioluminescent',
    category: 'luminous',
    description: 'Genetically engineered glowing organisms',
    material: new THREE.MeshStandardMaterial({
      color: 0x88ff88,
      emissive: 0x00ff00,
      emissiveIntensity: 0.8,
      metalness: 0.0,
      roughness: 0.5,
    }),
  },

  crystalLight: {
    name: 'crystalLight',
    displayName: '💎 Crystal Light',
    category: 'luminous',
    description: 'Photon-storing crystal matrix',
    material: new THREE.MeshStandardMaterial({
      color: 0xaaddff,
      emissive: 0x0088ff,
      emissiveIntensity: 0.6,
      metalness: 0.4,
      roughness: 0.1,
      transparent: true,
      opacity: 0.85,
    }),
  },

  neonMoss: {
    name: 'neonMoss',
    displayName: '🌟 Neon Moss',
    category: 'luminous',
    description: 'Fluorescent bio-engineered moss',
    material: new THREE.MeshStandardMaterial({
      color: 0x39ff14,
      emissive: 0x39ff14,
      emissiveIntensity: 0.5,
      metalness: 0.1,
      roughness: 0.8,
    }),
  },
};


// Helper function to get material by name
export function getMaterialByName(name: string): THREE.MeshStandardMaterial {
  const materialDef = SOLARPUNK_MATERIALS[name];
  if (!materialDef) {
    // Return default material if not found
    return SOLARPUNK_MATERIALS.ecoWood.material.clone();
  }
  return materialDef.material.clone();
}

// Helper function to get materials by category
export function getMaterialsByCategory(
  category: 'organic' | 'tech' | 'hybrid' | 'luminous'
): MaterialDefinition[] {
  return Object.values(SOLARPUNK_MATERIALS).filter(
    (mat) => mat.category === category
  );
}

// Get all material names for picker
export function getAllMaterialNames(): string[] {
  return Object.keys(SOLARPUNK_MATERIALS);
}

