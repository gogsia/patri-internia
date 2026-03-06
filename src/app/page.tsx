'use client';

import Scene from '@/components/Scene';

export default function Home() {
  return (
    <main className="relative h-screen w-full overflow-hidden">
      <Scene
        furniture={[]}
        onFurnitureMove={() => {}}
        onFurnitureMoveEnd={() => {}}
      />

      <div className="pointer-events-none absolute left-4 top-4 z-20">
        <h1 className="text-3xl font-bold text-solarpunk-lime drop-shadow-lg">
          Solarpunk Interiors
        </h1>
        <p className="text-sm text-gray-300">3D Immersive Design Explorer</p>
      </div>

      <div className="pointer-events-none absolute bottom-4 right-4 z-20 text-right text-xs text-gray-400">
        <p>Drag to rotate, scroll to zoom, right-drag to pan</p>
      </div>
    </main>
  );
}
