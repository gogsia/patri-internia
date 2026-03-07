'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { EffectComposer, Pixelation } from '@react-three/postprocessing';
import { Leva } from 'leva';
import { Suspense, useState } from 'react';
import { useSceneControls } from '@/components/leva/SceneControls';
import EditableFurniture from '@/components/3d/EditableFurniture';
import DesignerModel from '@/components/3d/DesignerModel';
import FloorGrid from '@/components/3d/FloorGrid';
import PhotoDropzone from '@/components/PhotoDropzone';
import type { FurnitureItem } from '@/types';
import RoomEnvironment from './RoomEnvironment';

type SolarpunkRoomProps = {
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

export default function SolarpunkRoom({
  furniture = [],
  selectedId = null,
  designerModelUrl = null,
  onSelectChange = () => {},
  onFurnitureMove,
  onFurnitureMoveEnd,
  onDesignerModelReady = () => {},
  onClearDesignerModel = () => {},
}: Readonly<SolarpunkRoomProps>) {
  const controls = useSceneControls();
  const [isDraggingFurniture, setIsDraggingFurniture] = useState(false);
  const [showDropzone, setShowDropzone] = useState(false);

  const showClearButton = designerModelUrl && !showDropzone;
  const showImportButton = !designerModelUrl && !showDropzone;
  const showUploadDialog = showDropzone;

  return (
    <>
      <Leva collapsed oneLineLabels />
      {showUploadDialog && (
        <PhotoDropzone
          onModelReady={(glbUrl) => {
            onDesignerModelReady(glbUrl);
            setShowDropzone(false);
          }}
        />
      )}
      {showClearButton && (
        <button
          type="button"
          onClick={() => {
            onClearDesignerModel();
            setShowDropzone(false);
          }}
          className="pointer-events-auto absolute left-4 top-20 z-30 rounded-lg border border-red-400/50 bg-red-900/70 px-3 py-2 text-xs font-semibold text-red-100 backdrop-blur hover:bg-red-800/80"
        >
          ✕ Clear Model
        </button>
      )}
      {showImportButton && (
        <button
          type="button"
          onClick={() => setShowDropzone(true)}
          className="pointer-events-auto absolute left-4 top-20 z-30 rounded-lg border border-emerald-300/50 bg-emerald-900/70 px-3 py-2 text-xs font-semibold text-emerald-100 backdrop-blur hover:bg-emerald-800/80"
        >
          Import Designer Photo
        </button>
      )}
      <Canvas
        camera={{ position: [0, 5, 12], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        className="h-screen w-full"
      >
        <PerspectiveCamera makeDefault position={[0, 5, 12]} fov={50} />

        <ambientLight
          intensity={controls.ambientIntensity}
          color={controls.ambientColor}
        />
        <pointLight
          position={[10, 15, 10]}
          intensity={controls.pointLightIntensity}
          color={controls.pointLightColor}
        />
        <directionalLight
          position={[-10, 10, 5]}
          intensity={0.8}
          color="#ffffff"
        />

        <Suspense fallback={null}>
          <RoomEnvironment />
        </Suspense>

        <FloorGrid visible={controls.showGrid} size={20} divisions={20} />

        <EditableFurniture
          items={furniture}
          selectedId={selectedId}
          onSelectChange={onSelectChange}
          onMove={onFurnitureMove}
          onMoveEnd={onFurnitureMoveEnd}
          onDragStateChange={setIsDraggingFurniture}
        />

        {designerModelUrl ? (
          <Suspense fallback={null}>
            <DesignerModel url={designerModelUrl} />
          </Suspense>
        ) : null}

        {controls.enablePixelation ? (
          <EffectComposer>
            <Pixelation granularity={controls.pixelSize} />
          </EffectComposer>
        ) : null}

        <OrbitControls
          enabled={!isDraggingFurniture}
          autoRotate={controls.autoRotate && !isDraggingFurniture}
          autoRotateSpeed={controls.autoRotateSpeed}
          enableZoom
          enablePan
          minDistance={5}
          maxDistance={50}
        />
      </Canvas>
    </>
  );
}
