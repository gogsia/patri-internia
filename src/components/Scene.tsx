'use client';

import dynamic from 'next/dynamic';
import React, { Component, Suspense } from 'react';
import type { FurnitureItem } from '@/types';

class SceneErrorBoundary extends Component<
  { children: React.ReactNode },
  { error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex items-center justify-center h-screen bg-[#0d1a0d]">
          <div className="text-center p-8">
            <p className="text-[#7ddf64] text-lg font-medium">3D scene failed to load</p>
            <p className="text-gray-400 text-sm mt-2">{this.state.error.message}</p>
            <button
              className="mt-4 px-4 py-2 bg-[#2d5016] text-[#7ddf64] rounded text-sm hover:bg-[#3a6a1e]"
              type="button"
              onClick={() => this.setState({ error: null })}
            >
              Retry
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

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
  designerModelUrl?: string | null;
  onSelectChange?: (id: string | null) => void;
  onFurnitureMove: (id: string, nextPosition: [number, number, number]) => void;
  onFurnitureMoveEnd: (
    id: string,
    finalPosition: [number, number, number]
  ) => void;
  onDesignerModelReady?: (glbUrl: string) => void;
  onClearDesignerModel?: () => void;
};

export default function Scene({
  furniture = [],
  selectedId = null,
  designerModelUrl = null,
  onSelectChange = () => {},
  onFurnitureMove,
  onFurnitureMoveEnd,
  onDesignerModelReady = () => {},
  onClearDesignerModel = () => {},
}: Readonly<SceneProps>) {
  return (
    <SceneErrorBoundary>
      <Suspense fallback={<div>Loading Scene...</div>}>
        <SolarpunkRoom
          furniture={furniture}
          selectedId={selectedId}
          designerModelUrl={designerModelUrl}
          onSelectChange={onSelectChange}
          onFurnitureMove={onFurnitureMove}
          onFurnitureMoveEnd={onFurnitureMoveEnd}
          onDesignerModelReady={onDesignerModelReady}
          onClearDesignerModel={onClearDesignerModel}
        />
      </Suspense>
    </SceneErrorBoundary>
  );
}
