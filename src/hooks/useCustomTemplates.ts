import { useCallback, useEffect, useState } from 'react';
import type { FurnitureItem, LayoutTemplate, TemplateCategory } from '@/types';

const STORAGE_KEY = 'solarpunk_custom_templates';

export interface CustomTemplate extends LayoutTemplate {
  isCustom: true;
  createdAt: number;
}

export function useCustomTemplates() {
  const [customTemplates, setCustomTemplates] = useState<CustomTemplate[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load custom templates from localStorage on mount
  useEffect(() => {
    const loadTemplates = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const templates = JSON.parse(stored) as CustomTemplate[];
          setCustomTemplates(templates);
        }
      } catch (error) {
        console.error('Failed to load custom templates:', error);
      }
      setIsLoaded(true);
    };

    if (typeof window !== 'undefined') {
      loadTemplates();
    }
  }, []);

  // Save a new template
  const saveTemplate = useCallback(
    (
      name: string,
      description: string,
      category: TemplateCategory,
      furniture: FurnitureItem[]
    ): CustomTemplate => {
      const newTemplate: CustomTemplate = {
        id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
        name,
        description,
        category,
        furniture,
        isCustom: true,
        createdAt: Date.now(),
        lighting: {
          ambientIntensity: 0.65,
          pointIntensity: 1.5,
        },
      };

      const updated = [...customTemplates, newTemplate];
      setCustomTemplates(updated);

      // Persist to localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save custom template:', error);
      }

      return newTemplate;
    },
    [customTemplates]
  );

  // Delete a custom template
  const deleteTemplate = useCallback(
    (templateId: string) => {
      const updated = customTemplates.filter((t) => t.id !== templateId);
      setCustomTemplates(updated);

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to delete custom template:', error);
      }
    },
    [customTemplates]
  );

  // Clear all custom templates
  const clearAllTemplates = useCallback(() => {
    setCustomTemplates([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear custom templates:', error);
    }
  }, []);

  return {
    customTemplates,
    saveTemplate,
    deleteTemplate,
    clearAllTemplates,
    isLoaded,
  };
}
