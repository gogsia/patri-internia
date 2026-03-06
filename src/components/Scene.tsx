'use client';

import dynamic from 'next/dynamic';
import React, { Suspense } from 'react';

const SolarpunkRoom = dynamic(() => import('@/experiences/SolarpunkRoom'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-solarpunk-lime"></div>
        <p className="mt-4 text-lg text-solarpunk-lime">Loading 3D Scene...</p>
      </div>
    </div>
  ),
});

export default function Scene() {
  return (
    <Suspense fallback={<div>Loading Scene...</div>}>
      <SolarpunkRoom />
    </Suspense>
  );
}
