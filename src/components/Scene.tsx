'use client';

import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';
import type { FurnitureItem } from '@/types';

const SolarpunkRoom = dynamic(() => import('@/experiences/SolarpunkRoom'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="inline-block h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-[#7ddf64]"></div>
        <p className="mt-4 text-lg text-[#7ddf64]">Loading 3D Scene...</p>
      </div>
    </div>
  ),
});

type SceneProps = {
  furniture?: FurnitureItem[];
  selectedId?: string | null;
  onSelectChange?: (id: string | null) => void;
  onFurnitureMove: (id: string, nextPosition: [number, number, number]) => void;
};

export default function Scene({
  furniture = [],
  selectedId = null,
  onSelectChange = () => {},
  onFurnitureMove,
}: Readonly<SceneProps>) {
  return (
    <Suspense fallback={<div>Loading Scene...</div>}>
      <SolarpunkRoom
        furniture={furniture}
        selectedId={selectedId}
        onSelectChange={onSelectChange}
        onFurnitureMove={onFurnitureMove}
      />
    </Suspense>
  );
}
