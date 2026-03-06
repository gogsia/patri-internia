import type { RoomLayout } from '@/types';

const STORAGE_KEY = 'solarpunk-layouts-v1';

export function getLayouts(): Record<string, RoomLayout> {
  if (globalThis.window === undefined) {
    return {};
  }

  try {
    const raw = globalThis.window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, RoomLayout>) : {};
  } catch {
    return {};
  }
}

export function saveLayout(layout: RoomLayout): Record<string, RoomLayout> {
  const layouts = getLayouts();
  layouts[layout.id] = layout;
  globalThis.window.localStorage.setItem(STORAGE_KEY, JSON.stringify(layouts));
  return layouts;
}

export function removeLayout(layoutId: string): Record<string, RoomLayout> {
  const layouts = getLayouts();
  delete layouts[layoutId];
  globalThis.window.localStorage.setItem(STORAGE_KEY, JSON.stringify(layouts));
  return layouts;
}
