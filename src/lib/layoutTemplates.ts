import type { FurnitureItem, LayoutTemplate, TemplateCategory } from '@/types';
import eclecticTemplate from '@/templates/eclectic.json';
import eclecticNightMarketTemplate from '@/templates/eclectic-night-market.json';
import eclecticSunroomStudioTemplate from '@/templates/eclectic-sunroom-studio.json';
import eclecticUrbanOasisTemplate from '@/templates/eclectic-urban-oasis.json';
import maximalistTemplate from '@/templates/maximalist.json';
import maximalistBiophilicLabTemplate from '@/templates/maximalist-biophilic-lab.json';
import maximalistMakerHubTemplate from '@/templates/maximalist-maker-hub.json';
import minimalistFocusPodTemplate from '@/templates/minimalist-focus-pod.json';
import minimalistTemplate from '@/templates/minimalist.json';
import minimalistReadingNookTemplate from '@/templates/minimalist-reading-nook.json';

const RAW_TEMPLATES = [
  minimalistTemplate,
  minimalistReadingNookTemplate,
  minimalistFocusPodTemplate,
  maximalistTemplate,
  maximalistBiophilicLabTemplate,
  maximalistMakerHubTemplate,
  eclecticTemplate,
  eclecticUrbanOasisTemplate,
  eclecticSunroomStudioTemplate,
  eclecticNightMarketTemplate,
] as const;

const TEMPLATE_PREVIEWS: Record<string, string> = {
  'template-minimalist-starter': '/templates/minimalist-starter.svg',
  'template-minimalist-reading-nook': '/templates/minimalist-reading-nook.svg',
  'template-minimalist-focus-pod': '/templates/minimalist-focus-pod.svg',
  'template-maximalist-atelier': '/templates/maximalist-atelier.svg',
  'template-maximalist-biophilic-lab': '/templates/maximalist-biophilic-lab.svg',
  'template-maximalist-maker-hub': '/templates/maximalist-maker-hub.svg',
  'template-eclectic-remix': '/templates/eclectic-remix.svg',
  'template-eclectic-urban-oasis': '/templates/eclectic-urban-oasis.svg',
  'template-eclectic-sunroom-studio': '/templates/eclectic-sunroom-studio.svg',
  'template-eclectic-night-market': '/templates/eclectic-night-market.svg',
};

function withFreshIds(items: FurnitureItem[]): FurnitureItem[] {
  return items.map((item, index) => ({
    ...item,
    id: `${item.id}-${Date.now()}-${index}`,
  }));
}

export const LAYOUT_TEMPLATES: LayoutTemplate[] = RAW_TEMPLATES.map(
  (template) => ({
    ...template,
    category: template.category as TemplateCategory,
    previewImage: TEMPLATE_PREVIEWS[template.id],
    furniture: template.furniture as FurnitureItem[],
  })
);

export function getTemplatesByCategory(
  category: TemplateCategory
): LayoutTemplate[] {
  return LAYOUT_TEMPLATES.filter((template) => template.category === category);
}

export function cloneTemplateFurniture(
  template: LayoutTemplate
): FurnitureItem[] {
  return withFreshIds(template.furniture);
}

export function remixFurniture(items: FurnitureItem[]): FurnitureItem[] {
  if (items.length === 0) return [];

  const radius = Math.max(2.2, items.length * 0.45);
  const angleStep = (Math.PI * 2) / items.length;

  return withFreshIds(
    items.map((item, index) => {
      const angle = angleStep * index;
      return {
        ...item,
        position: [
          Number((Math.cos(angle) * radius).toFixed(2)),
          item.position[1],
          Number((Math.sin(angle) * radius).toFixed(2)),
        ],
        rotation: [item.rotation[0], Number((angle + Math.PI).toFixed(2)), 0],
      };
    })
  );
}

export function autoArrangeFurniture(items: FurnitureItem[]): FurnitureItem[] {
  if (items.length === 0) return [];

  const columns = Math.ceil(Math.sqrt(items.length));
  const spacing = 1.9;
  const centerOffset = ((columns - 1) * spacing) / 2;

  return withFreshIds(
    items.map((item, index) => {
      const row = Math.floor(index / columns);
      const column = index % columns;

      return {
        ...item,
        position: [
          Number((column * spacing - centerOffset).toFixed(2)),
          item.position[1],
          Number((row * spacing - centerOffset).toFixed(2)),
        ],
      };
    })
  );
}
