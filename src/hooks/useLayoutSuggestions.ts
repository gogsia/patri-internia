import { useMemo } from 'react';
import { LAYOUT_TEMPLATES } from '@/lib/layoutTemplates';
import type { FurnitureItem, LayoutTemplate } from '@/types';

/**
 * ENHANCED SUGGESTION ALGORITHM v2
 * Scores templates based on:
 * 1. Furniture type composition (plants, seating, tables, lighting, tech)
 * 2. Density-aware matching (forgiving for small differences)
 * 3. Material palette affinity (matches user's material choices)
 * 4. Diversity bonus (templates with varied furniture types)
 */

// Categorize furniture by type
function getFurnitureType(name: string): string {
  const lower = name.toLowerCase();
  if (
    lower.includes('succulent') ||
    lower.includes('hydroponic') ||
    lower.includes('tower')
  )
    return 'plants';
  if (lower.includes('solar') && lower.includes('panel')) return 'tech';
  if (lower.includes('chair') || lower.includes('seat')) return 'seating';
  if (
    lower.includes('table') ||
    lower.includes('desk') ||
    lower.includes('work')
  )
    return 'table';
  if (lower.includes('lamp') || lower.includes('light')) return 'lighting';
  return 'other';
}

// Analyze user's furniture composition
interface FurnitureComposition {
  plants: number;
  tech: number;
  seating: number;
  tables: number;
  lighting: number;
  total: number;
  materialCategories: Set<string>;
}

function analyzeFurniture(furniture: FurnitureItem[]): FurnitureComposition {
  const composition = {
    plants: 0,
    tech: 0,
    seating: 0,
    tables: 0,
    lighting: 0,
    total: furniture.length,
    materialCategories: new Set<string>(),
  };

  for (const item of furniture) {
    const type = getFurnitureType(item.name);

    // Safely increment based on type
    if (type === 'plants') composition.plants++;
    else if (type === 'tech') composition.tech++;
    else if (type === 'seating') composition.seating++;
    else if (type === 'table') composition.tables++;
    else if (type === 'lighting') composition.lighting++;

    // Track material categories
    if (item.materialName) {
      const materialLower = item.materialName.toLowerCase();
      if (
        materialLower.includes('eco') ||
        materialLower.includes('living') ||
        materialLower.includes('coral') ||
        materialLower.includes('mycelium')
      ) {
        composition.materialCategories.add('organic');
      } else if (
        materialLower.includes('solar') ||
        materialLower.includes('recycled') ||
        materialLower.includes('plastic') ||
        materialLower.includes('glass')
      ) {
        composition.materialCategories.add('tech');
      } else if (
        materialLower.includes('green') ||
        materialLower.includes('vine') ||
        materialLower.includes('wood')
      ) {
        composition.materialCategories.add('hybrid');
      } else if (
        materialLower.includes('bio') ||
        materialLower.includes('crystal') ||
        materialLower.includes('neon') ||
        materialLower.includes('moss')
      ) {
        composition.materialCategories.add('luminous');
      }
    }
  }

  return composition;
}

// Analyze template composition
function analyzeTemplate(template: LayoutTemplate): FurnitureComposition {
  const composition = {
    plants: 0,
    tech: 0,
    seating: 0,
    tables: 0,
    lighting: 0,
    total: template.furniture.length,
    materialCategories: new Set<string>(),
  };

  for (const item of template.furniture) {
    const type = getFurnitureType(item.name);

    // Safely increment based on type
    if (type === 'plants') composition.plants++;
    else if (type === 'tech') composition.tech++;
    else if (type === 'seating') composition.seating++;
    else if (type === 'table') composition.tables++;
    else if (type === 'lighting') composition.lighting++;

    if (item.materialName) {
      const materialLower = item.materialName.toLowerCase();
      if (
        materialLower.includes('eco') ||
        materialLower.includes('living') ||
        materialLower.includes('coral') ||
        materialLower.includes('mycelium')
      ) {
        composition.materialCategories.add('organic');
      } else if (
        materialLower.includes('solar') ||
        materialLower.includes('recycled') ||
        materialLower.includes('plastic') ||
        materialLower.includes('glass')
      ) {
        composition.materialCategories.add('tech');
      } else if (
        materialLower.includes('green') ||
        materialLower.includes('vine') ||
        materialLower.includes('wood')
      ) {
        composition.materialCategories.add('hybrid');
      } else if (
        materialLower.includes('bio') ||
        materialLower.includes('crystal') ||
        materialLower.includes('neon') ||
        materialLower.includes('moss')
      ) {
        composition.materialCategories.add('luminous');
      }
    }
  }

  return composition;
}

// Score based on composition match (0-50 points)
function scoreCompositionMatch(
  userComposition: FurnitureComposition,
  templateComposition: FurnitureComposition
): number {
  if (userComposition.total === 0) return 0;

  const userRatios = {
    plants: userComposition.plants / userComposition.total,
    tech: userComposition.tech / userComposition.total,
    seating: userComposition.seating / userComposition.total,
    tables: userComposition.tables / userComposition.total,
    lighting: userComposition.lighting / userComposition.total,
  };

  const templateRatios = {
    plants: templateComposition.plants / templateComposition.total,
    tech: templateComposition.tech / templateComposition.total,
    seating: templateComposition.seating / templateComposition.total,
    tables: templateComposition.tables / templateComposition.total,
    lighting: templateComposition.lighting / templateComposition.total,
  };

  // Score based on how close ratios match
  let compositionScore = 50;
  const types = ['plants', 'tech', 'seating', 'tables', 'lighting'] as const;

  for (const type of types) {
    const diff = Math.abs(userRatios[type] - templateRatios[type]);
    compositionScore -= diff * 50; // Penalize ratio mismatch
  }

  return Math.max(0, compositionScore);
}

// Softer density penalty (forgiving for small differences)
function scoreDensity(userCount: number, templateCount: number): number {
  const diff = Math.abs(userCount - templateCount);

  if (diff === 0) return 20;
  if (diff === 1) return 15;
  if (diff === 2) return 10;
  if (diff === 3) return 5;
  return Math.max(0, 20 - diff * 3);
}

// Score material palette match (0-10 points)
function scoreMaterialMatch(
  userMaterials: Set<string>,
  templateMaterials: Set<string>
): number {
  if (userMaterials.size === 0) return 0;

  let matches = 0;
  for (const material of userMaterials) {
    if (templateMaterials.has(material)) {
      matches++;
    }
  }

  return (matches / userMaterials.size) * 10;
}

// Main scoring function
function scoreTemplate(
  template: LayoutTemplate,
  userFurniture: FurnitureItem[]
): number {
  // EMPTY ROOM: Prefer minimalist starters
  if (userFurniture.length === 0) {
    if (
      template.category === 'minimalist' &&
      template.name.includes('Starter')
    ) {
      return 100; // Perfect match for empty rooms
    }
    if (template.category === 'minimalist') return 85;
    if (template.category === 'eclectic') return 75;
    return 60;
  }

  // ROOM WITH FURNITURE: Analyze & score
  const userComposition = analyzeFurniture(userFurniture);
  const templateComposition = analyzeTemplate(template);

  let totalScore = 50; // Base score

  // 1. Composition match (up to 50 points)
  const compositionScore = scoreCompositionMatch(
    userComposition,
    templateComposition
  );
  totalScore += compositionScore;

  // 2. Density match (up to 20 points - softer than before)
  const densityScore = scoreDensity(
    userComposition.total,
    templateComposition.total
  );
  totalScore += densityScore;

  // 3. Material match (up to 10 points)
  const materialScore = scoreMaterialMatch(
    userComposition.materialCategories,
    templateComposition.materialCategories
  );
  totalScore += materialScore;

  // 4. Diversity bonus (up to 10 points)
  // Templates with diverse furniture types score higher
  const templateDiversity = [
    templateComposition.plants > 0,
    templateComposition.tech > 0,
    templateComposition.seating > 0,
    templateComposition.tables > 0,
    templateComposition.lighting > 0,
  ].filter(Boolean).length;
  const diversityBonus = (templateDiversity / 5) * 10;
  totalScore += diversityBonus;

  return Math.max(0, Math.min(120, totalScore)); // Max 120, clamps to final score
}

export function useLayoutSuggestions(furniture: FurnitureItem[]) {
  const suggestions = useMemo(() => {
    return [...LAYOUT_TEMPLATES]
      .map((template) => ({
        template,
        score: scoreTemplate(template, furniture),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3) // Top 3 suggestions (instead of 2)
      .map((result) => result.template);
  }, [furniture]);

  return {
    suggestions,
    hasSuggestions: suggestions.length > 0,
  };
}
