'use client';

import { useState } from 'react';
import { downloadCanvasScreenshot, shareDesign } from '@/lib/share';

type ToolbarProps = {
  selectedId?: string | null;
  canUndo?: boolean;
  canRedo?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  onDelete?: () => void;
};

export default function Toolbar({
  selectedId = null,
  canUndo = false,
  canRedo = false,
  onUndo = () => {},
  onRedo = () => {},
  onDelete = () => {},
}: Readonly<ToolbarProps>) {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <nav
        aria-label="Design actions"
        className="absolute left-4 top-4 z-30 flex flex-wrap gap-2 rounded-xl border border-[#355139] bg-black/45 p-2 backdrop-blur-sm"
      >
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
          onClick={() => shareDesign('Solarpunk Interiors', 'Check out this design from Solarpunk Interiors.')}
          aria-label="Share design"
          className="rounded-md bg-[#7ddf64] px-3 py-2 text-xs font-semibold text-[#0f1713] hover:brightness-95"
        >
          Share
        </button>
        {selectedId ? (
          <button
            onClick={onDelete}
            aria-label="Delete selected furniture (or press Delete key)"
            className="rounded-md border border-[#5d2f2f] bg-[#321717] px-3 py-2 text-xs font-semibold text-zinc-100 hover:bg-[#4a1f1f]"
          >
            Delete
          </button>
        ) : null}
      </nav>

      {showHelp ? (
        <section
          role="dialog"
          aria-modal="true"
          aria-label="Help and controls"
          className="absolute inset-0 z-40 flex items-center justify-center bg-black/50 p-4"
        >
          <div className="w-full max-w-md rounded-2xl border border-[#355139] bg-[#101913] p-5 text-zinc-100 shadow-2xl">
            <h2 className="mb-2 text-lg font-semibold text-[#a8ef8b]">Controls</h2>
            <ul className="space-y-1 text-sm text-zinc-200">
              <li>Drag mouse: orbit camera</li>
              <li>Mouse wheel: zoom in/out</li>
              <li>Right-click + drag: pan</li>
              <li>Click furniture to select</li>
              <li>Drag furniture in 3D to move it</li>
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
        </section>
      ) : null}
    </>
  );
}
