'use client';

import Scene from '@/components/Scene';

export default function Home() {
  return (
    <main className="relative w-full h-screen overflow-hidden">
      <Scene furniture={[]} onFurnitureMove={() => {}} />
      
      {/* UI Overlay */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <h1 className="text-3xl font-bold text-solarpunk-lime drop-shadow-lg">
          Solarpunk Interiors
        </h1>
        <p className="text-sm text-gray-300">3D Immersive Design Explorer</p>
      </div>

      {/* Help Text */}
      <div className="absolute bottom-4 right-4 z-20 text-xs text-gray-400 pointer-events-none text-right">
        <p>🖱️ Drag to rotate | 🔍 Scroll to zoom | ⌘ Scroll to pan</p>
      </div>
    </main>
  );
}
