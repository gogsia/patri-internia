'use client';

import { useState } from 'react';

export default function KeyboardShortcuts() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="pointer-events-auto fixed bottom-4 left-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600/80 text-white shadow-lg backdrop-blur transition hover:bg-emerald-500"
        aria-label="Show keyboard shortcuts"
      >
        <span className="text-lg font-bold">?</span>
      </button>
    );
  }

  return (
    <div className="pointer-events-auto fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="max-h-[90vh] w-[min(90vw,42rem)] overflow-auto rounded-2xl border border-emerald-400/30 bg-emerald-950/95 p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-emerald-100">
            ⌨️ Keyboard Shortcuts
          </h2>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-lg px-3 py-1 text-xl text-emerald-300 hover:bg-emerald-900/50"
            aria-label="Close shortcuts"
          >
            ×
          </button>
        </div>

        <div className="space-y-6">
          {/* Navigation & Camera */}
          <section>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-300">
              Camera & Navigation
            </h3>
            <div className="space-y-2 text-sm">
              <ShortcutRow keys={['Left Drag']} action="Rotate camera" />
              <ShortcutRow keys={['Right Drag']} action="Pan camera" />
              <ShortcutRow keys={['Scroll']} action="Zoom in/out" />
              <ShortcutRow keys={['Click']} action="Select furniture" />
            </div>
          </section>

          {/* Furniture Position */}
          <section>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-300">
              Position Control
            </h3>
            <div className="space-y-2 text-sm">
              <ShortcutRow keys={['↑']} action="Move forward (0.5 units)" />
              <ShortcutRow keys={['↓']} action="Move backward (0.5 units)" />
              <ShortcutRow keys={['←']} action="Move left (0.5 units)" />
              <ShortcutRow keys={['→']} action="Move right (0.5 units)" />
              <ShortcutRow keys={['Drag']} action="Free movement in 3D space" />
            </div>
          </section>

          {/* Rotation & Scale */}
          <section>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-300">
              Rotation & Scale
            </h3>
            <div className="space-y-2 text-sm">
              <ShortcutRow
                keys={['Q']}
                action="Rotate counterclockwise (15°)"
              />
              <ShortcutRow keys={['E']} action="Rotate clockwise (15°)" />
              <ShortcutRow keys={['+']} action="Scale up (10%)" />
              <ShortcutRow keys={['-']} action="Scale down (10%)" />
            </div>
          </section>

          {/* Editing */}
          <section>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-300">
              Editing
            </h3>
            <div className="space-y-2 text-sm">
              <ShortcutRow keys={['Delete']} action="Delete selected item" />
              <ShortcutRow
                keys={['Ctrl', 'D']}
                action="Duplicate selected item"
              />
              <ShortcutRow keys={['Esc']} action="Deselect current item" />
            </div>
          </section>

          {/* History */}
          <section>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-300">
              History
            </h3>
            <div className="space-y-2 text-sm">
              <ShortcutRow keys={['Ctrl', 'Z']} action="Undo last action" />
              <ShortcutRow keys={['Ctrl', 'Y']} action="Redo action" />
              <ShortcutRow
                keys={['Ctrl', 'Shift', 'Z']}
                action="Redo action (alt)"
              />
            </div>
          </section>

          {/* Tips */}
          <section className="rounded-lg border border-emerald-500/30 bg-emerald-900/20 p-4">
            <h3 className="mb-2 text-sm font-semibold text-emerald-200">
              💡 Pro Tips
            </h3>
            <ul className="space-y-1 text-xs text-emerald-300">
              <li>• Hold Shift while dragging for precise movement</li>
              <li>• Use grid overlay (Leva panel) for alignment</li>
              <li>• Combine arrow keys for diagonal movement</li>
              <li>• Save layouts regularly using the right panel</li>
              <li>
                • Photo-to-3D: Drag interior photos to import as 3D models
              </li>
            </ul>
          </section>
        </div>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded-lg bg-emerald-500 px-6 py-2 text-sm font-semibold text-emerald-950 hover:bg-emerald-400"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}

function ShortcutRow({ keys, action }: { keys: string[]; action: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-1">
        {keys.map((key, i) => (
          <span key={i}>
            <kbd className="rounded border border-emerald-400/40 bg-emerald-900/50 px-2 py-1 text-xs font-semibold text-emerald-200">
              {key}
            </kbd>
            {i < keys.length - 1 && (
              <span className="mx-1 text-emerald-400">+</span>
            )}
          </span>
        ))}
      </div>
      <span className="text-emerald-100">{action}</span>
    </div>
  );
}
