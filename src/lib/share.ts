import type { FurnitureItem } from '@/types';

// --- URL state encoding ---

export function encodeSceneToUrl(furniture: FurnitureItem[]): string {
  const encoded = btoa(encodeURIComponent(JSON.stringify(furniture)));
  const url = new URL(window.location.href);
  url.searchParams.set('scene', encoded);
  return url.toString();
}

export function decodeSceneFromUrl(): FurnitureItem[] | null {
  if (typeof window === 'undefined') return null;
  const param = new URLSearchParams(window.location.search).get('scene');
  if (!param) return null;
  try {
    const items = JSON.parse(decodeURIComponent(atob(param)));
    return Array.isArray(items) ? (items as FurnitureItem[]) : null;
  } catch {
    return null;
  }
}

// --- JSON export / import ---

export function exportSceneJson(furniture: FurnitureItem[]): void {
  const json = JSON.stringify({ version: 1, furniture }, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const stamp = new Date().toISOString().slice(0, 10);
  link.href = objectUrl;
  link.download = `solarpunk-layout-${stamp}.json`;
  link.click();
  URL.revokeObjectURL(objectUrl);
}

export function importSceneJson(): Promise<FurnitureItem[] | null> {
  return new Promise((resolve) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,application/json';
    input.onchange = () => {
      const file = input.files?.[0];
      if (!file) { resolve(null); return; }
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target?.result as string);
          const items: unknown = parsed.furniture ?? parsed;
          resolve(Array.isArray(items) ? (items as FurnitureItem[]) : null);
        } catch {
          resolve(null);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  });
}

export async function shareDesign(title: string, text: string) {
  const hasWindow = typeof globalThis.window === 'object';
  const url = hasWindow ? globalThis.window.location.href : '';

  if (typeof globalThis.navigator === 'object' && globalThis.navigator.share) {
    try {
      await globalThis.navigator.share({ title, text, url });
      return true;
    } catch {
      return false;
    }
  }

  if (!hasWindow) {
    return false;
  }

  const encodedText = encodeURIComponent(`${text} ${url}`);
  globalThis.window.open(
    `https://twitter.com/intent/tweet?text=${encodedText}`,
    '_blank',
    'noopener,noreferrer'
  );
  return true;
}

export function downloadCanvasScreenshot(filenamePrefix = 'solarpunk-layout') {
  if (typeof document === 'undefined') {
    return false;
  }

  const canvas = document.querySelector('canvas');
  if (!(canvas instanceof HTMLCanvasElement)) {
    return false;
  }

  const dataUrl = canvas.toDataURL('image/png');
  const link = document.createElement('a');
  const stamp = new Date().toISOString().replaceAll(':', '-').replaceAll('.', '-');
  link.href = dataUrl;
  link.download = `${filenamePrefix}-${stamp}.png`;
  link.click();
  return true;
}
