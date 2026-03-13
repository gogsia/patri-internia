/**
 * Pre-designed color schemes (material palettes) for solarpunk interiors
 * Each scheme applies coordinated materials across different furniture types
 */

export interface ColorScheme {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: 'organic' | 'tech' | 'mixed' | 'luminous';
  materials: {
    plants?: string; // Material for plant furniture
    tech?: string; // Material for tech/energy furniture
    seating?: string; // Material for chairs
    tables?: string; // Material for work surfaces
    lighting?: string; // Material for lamps
    default?: string; // Fallback material
  };
}

export const COLOR_SCHEMES: ColorScheme[] = [
  // ORGANIC SCHEMES
  {
    id: 'natural-earth',
    name: 'Natural Earth',
    description: 'Warm woods and living materials for a cozy organic feel',
    emoji: '🌳',
    category: 'organic',
    materials: {
      plants: 'livingBamboo',
      tech: 'ecoWood',
      seating: 'ecoWood',
      tables: 'ecoWood',
      lighting: 'myceliumFoam',
      default: 'ecoWood',
    },
  },
  {
    id: 'living-garden',
    name: 'Living Garden',
    description: 'Bamboo and vine materials with growing, breathing aesthetics',
    emoji: '🎋',
    category: 'organic',
    materials: {
      plants: 'livingVine',
      tech: 'livingBamboo',
      seating: 'livingBamboo',
      tables: 'livingBamboo',
      lighting: 'livingVine',
      default: 'livingBamboo',
    },
  },
  {
    id: 'coral-reef',
    name: 'Coral Reef',
    description: 'Light mineral tones inspired by ocean ecosystems',
    emoji: '🪨',
    category: 'organic',
    materials: {
      plants: 'myceliumFoam',
      tech: 'coralStone',
      seating: 'coralStone',
      tables: 'coralStone',
      lighting: 'coralStone',
      default: 'coralStone',
    },
  },

  // TECH SCHEMES
  {
    id: 'solar-future',
    name: 'Solar Future',
    description: 'High-tech photovoltaic surfaces with metallic accents',
    emoji: '⚡',
    category: 'tech',
    materials: {
      plants: 'smartGlass',
      tech: 'solarPanel',
      seating: 'recycledMetal',
      tables: 'solarPanel',
      lighting: 'solarPanel',
      default: 'solarPanel',
    },
  },
  {
    id: 'recycled-industrial',
    name: 'Recycled Industrial',
    description: 'Upcycled metals and polymers for modern sustainability',
    emoji: '♻️',
    category: 'tech',
    materials: {
      plants: 'bioPlastic',
      tech: 'recycledMetal',
      seating: 'recycledMetal',
      tables: 'recycledMetal',
      lighting: 'bioPlastic',
      default: 'recycledMetal',
    },
  },
  {
    id: 'smart-glass',
    name: 'Smart Glass',
    description: 'Translucent adaptive materials with clean lines',
    emoji: '🔮',
    category: 'tech',
    materials: {
      plants: 'smartGlass',
      tech: 'smartGlass',
      seating: 'bioPlastic',
      tables: 'smartGlass',
      lighting: 'crystalLight',
      default: 'smartGlass',
    },
  },

  // MIXED/HYBRID SCHEMES
  {
    id: 'green-concrete',
    name: 'Green Concrete',
    description: 'Carbon-negative building materials with natural touches',
    emoji: '🏗️',
    category: 'mixed',
    materials: {
      plants: 'livingVine',
      tech: 'greenConcrete',
      seating: 'greenConcrete',
      tables: 'greenConcrete',
      lighting: 'techWood',
      default: 'greenConcrete',
    },
  },
  {
    id: 'tech-wood',
    name: 'Tech Wood',
    description: 'Conductive polymers infused with natural wood grain',
    emoji: '🪵',
    category: 'mixed',
    materials: {
      plants: 'livingBamboo',
      tech: 'techWood',
      seating: 'techWood',
      tables: 'techWood',
      lighting: 'techWood',
      default: 'techWood',
    },
  },
  {
    id: 'biophilic-mix',
    name: 'Biophilic Mix',
    description: 'Balanced blend of organic and tech materials',
    emoji: '🌿',
    category: 'mixed',
    materials: {
      plants: 'livingVine',
      tech: 'solarPanel',
      seating: 'ecoWood',
      tables: 'greenConcrete',
      lighting: 'bioPlastic',
      default: 'ecoWood',
    },
  },

  // LUMINOUS SCHEMES
  {
    id: 'bioluminescent',
    name: 'Bioluminescent',
    description: 'Glowing organisms and self-illuminating materials',
    emoji: '💡',
    category: 'luminous',
    materials: {
      plants: 'livingVine',
      tech: 'bioluminescent',
      seating: 'myceliumFoam',
      tables: 'livingBamboo',
      lighting: 'bioluminescent',
      default: 'bioluminescent',
    },
  },
  {
    id: 'crystal-light',
    name: 'Crystal Light',
    description: 'Photon-storing crystal matrix with blue glow',
    emoji: '💎',
    category: 'luminous',
    materials: {
      plants: 'smartGlass',
      tech: 'crystalLight',
      seating: 'smartGlass',
      tables: 'crystalLight',
      lighting: 'crystalLight',
      default: 'crystalLight',
    },
  },
  {
    id: 'neon-nature',
    name: 'Neon Nature',
    description: 'Fluorescent bio-engineered moss with vibrant glow',
    emoji: '🌟',
    category: 'luminous',
    materials: {
      plants: 'neonMoss',
      tech: 'neonMoss',
      seating: 'livingVine',
      tables: 'livingBamboo',
      lighting: 'neonMoss',
      default: 'neonMoss',
    },
  },
];

/**
 * Get furniture category for material assignment
 */
export function getFurnitureCategory(
  furnitureName: string
): 'plants' | 'tech' | 'seating' | 'tables' | 'lighting' | 'default' {
  const lower = furnitureName.toLowerCase();

  if (
    lower.includes('succulent') ||
    lower.includes('hydroponic') ||
    lower.includes('tower') ||
    lower.includes('plant')
  ) {
    return 'plants';
  }

  if (lower.includes('solar') && lower.includes('panel')) {
    return 'tech';
  }

  if (
    lower.includes('chair') ||
    lower.includes('seat') ||
    lower.includes('sofa') ||
    lower.includes('bed')
  ) {
    return 'seating';
  }

  if (
    lower.includes('table') ||
    lower.includes('desk') ||
    lower.includes('work')
  ) {
    return 'tables';
  }

  if (lower.includes('lamp') || lower.includes('light')) {
    return 'lighting';
  }

  return 'default';
}
