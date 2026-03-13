'use client';

import { useState } from 'react';
import { downloadCanvasScreenshot, shareDesign } from '@/lib/share';

type ToolbarProps = {
  selectedId?: string | null;
  canUndo?: boolean;
  canRedo?: boolean;
  canClear?: boolean;
  hasFurniture?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
  onClear?: () => void;
  onMaterialPicker?: () => void;
  onSaveTemplate?: () => void;
  onCopyLink?: () => void;
  onExportJson?: () => void;
  onImportJson?: () => void;
};

export default function Toolbar({
  selectedId = null,
  canUndo = false,
  canRedo = false,
  canClear = false,
  hasFurniture = false,
  onUndo = () => {},
  onRedo = () => {},
  onDuplicate = () => {},
  onDelete = () => {},
  onClear = () => {},
  onMaterialPicker = () => {},
  onSaveTemplate = () => {},
  onCopyLink = () => {},
  onExportJson = () => {},
  onImportJson = () => {},
}: Readonly<ToolbarProps>) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <nav
        aria-label="Design actions"
        className="absolute left-4 top-4 z-30 flex flex-wrap gap-2 rounded-xl border border-[#355139] bg-black/45 p-2 backdrop-blur-sm"
      >
        {selectedId && (
          <>
            <button
              onClick={onMaterialPicker}
              aria-label="Change material"
              className="rounded-md border border-[#4a6f4f] bg-[#1a3a1f] px-3 py-2 text-xs font-semibold text-zinc-100 hover:bg-[#2a4a2f]"
            >
              🎨 Material
            </button>
            <button
              onClick={onDuplicate}
              aria-label="Duplicate selected furniture (Ctrl+D)"
              className="rounded-md border border-[#314a35] bg-[#16241a] px-3 py-2 text-xs font-semibold text-zinc-100 hover:bg-[#1e3224]"
            >
              Duplicate
            </button>
            <button
              onClick={onDelete}
              aria-label="Delete selected furniture (or press Delete key)"
              className="rounded-md border border-[#5d2f2f] bg-[#321717] px-3 py-2 text-xs font-semibold text-zinc-100 hover:bg-[#4a1f1f]"
            >
              Delete
            </button>

            <div className="w-px bg-[#314a35]"></div>
          </>
        )}

        {hasFurniture && (
          <>
            <button
              onClick={onSaveTemplate}
              aria-label="Save current layout as template"
              className="rounded-md border border-[#4a6f4f] bg-[#1a3a1f] px-3 py-2 text-xs font-semibold text-zinc-100 hover:bg-[#2a4a2f]"
            >
              💾 Save Template
            </button>
            <div className="w-px bg-[#314a35]"></div>
          </>
        )}

        <button
          onClick={onUndo}
          disabled={!canUndo}
          aria-label="Undo (Ctrl+Z)"
          title="Undo"
          className="rounded-md border border-[#314a35] bg-[#16241a] px-3 py-2 text-xs font-semibold text-zinc-100 hover:bg-[#1e3224] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ↶ Undo
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          aria-label="Redo (Ctrl+Y)"
          title="Redo"
          className="rounded-md border border-[#314a35] bg-[#16241a] px-3 py-2 text-xs font-semibold text-zinc-100 hover:bg-[#1e3224] disabled:opacity-30 disabled:cursor-not-allowed"
        >
          ↷ Redo
        </button>

        <div className="w-px bg-[#314a35]"></div>

        <button
          onClick={() => setShowHelp((v) => !v)}
          aria-label="Toggle help"
          className="rounded-md border border-[#314a35] bg-[#16241a] px-3 py-2 text-xs font-semibold text-zinc-100 hover:bg-[#1e3224]"
        >
          Help
        </button>
        <button
          onClick={() => downloadCanvasScreenshot()}
          aria-label="Download screenshot"
          className="rounded-md border border-[#314a35] bg-[#16241a] px-3 py-2 text-xs font-semibold text-zinc-100 hover:bg-[#1e3224]"
        >
          Screenshot
        </button>
        <button
          onClick={() =>
            shareDesign(
              'Solarpunk Interiors',
              'Check out this design from Solarpunk Interiors.'
            )
          }
          aria-label="Share design"
          className="rounded-md bg-[#7ddf64] px-3 py-2 text-xs font-semibold text-[#0f1713] hover:brightness-95"
        >
          Share
        </button>
        <button
          type="button"
          onClick={onCopyLink}
          aria-label="Copy shareable link to clipboard"
          className="rounded-md border border-[#314a35] bg-[#16241a] px-3 py-2 text-xs font-semibold text-zinc-100 hover:bg-[#1e3224]"
        >
          Copy Link
        </button>

        <div className="w-px bg-[#314a35]"></div>

        <button
          type="button"
          onClick={onExportJson}
          aria-label="Export layout as JSON file"
          className="rounded-md border border-[#314a35] bg-[#16241a] px-3 py-2 text-xs font-semibold text-zinc-100 hover:bg-[#1e3224]"
        >
          Export
        </button>
        <button
          type="button"
          onClick={onImportJson}
          aria-label="Import layout from JSON file"
          className="rounded-md border border-[#314a35] bg-[#16241a] px-3 py-2 text-xs font-semibold text-zinc-100 hover:bg-[#1e3224]"
        >
          Import
        </button>

        <div className="w-px bg-[#314a35]"></div>

        <button
          onClick={onClear}
          disabled={!canClear}
          aria-label="Clear all furniture"
          className="rounded-md border border-[#5d2f2f] bg-[#321717] px-3 py-2 text-xs font-semibold text-zinc-100 hover:bg-[#4a1f1f] disabled:cursor-not-allowed disabled:opacity-30"
        >
          Clear All
        </button>
      </nav>

      {showHelp ? (
        <dialog
          open
          aria-label="Help and controls"
          className="absolute inset-0 z-40 flex items-center justify-center bg-black/50 p-4"
        >
          <div className="w-full max-w-md rounded-2xl border border-[#355139] bg-[#101913] p-5 text-zinc-100 shadow-2xl">
            <h2 className="mb-2 text-lg font-semibold text-[#a8ef8b]">
              Controls
            </h2>
            <ul className="space-y-1 text-sm text-zinc-200">
              <li>Drag mouse: orbit camera</li>
              <li>Mouse wheel: zoom in/out</li>
              <li>Right-click + drag: pan</li>
              <li>Click furniture to select</li>
              <li>Drag furniture in 3D to move it</li>
              <li>🎨 Material button: change material</li>
              <li>Ctrl+D to duplicate selected item</li>
              <li>Press Delete to remove selected item</li>
              <li>Press Escape to deselect</li>
              <li>Ctrl+Z to undo, Ctrl+Y to redo</li>
            </ul>
            <button
              onClick={() => setShowHelp(false)}
              className="mt-4 rounded-md bg-[#7ddf64] px-3 py-2 text-sm font-semibold text-[#0f1713]"
            >
              Close
            </button>
          </div>
        </dialog>
      ) : null}
    </>
  );
}
