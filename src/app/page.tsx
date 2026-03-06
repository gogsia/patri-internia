'use client';

export default function Home() {
  return (
    <main className="relative w-full h-screen bg-gray-900">
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-solarpunk-lime mb-4 drop-shadow-lg">
            Solarpunk Interiors
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            3D Immersive Interior Design Explorer
          </p>
          <div className="animate-pulse">
            <p className="text-sm text-gray-400">
              Phase 1 Setup Complete ✓
            </p>
            <p className="text-xs text-gray-500 mt-4">
              Ready for 3D Canvas & Components
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
