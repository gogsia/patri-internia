'use client';
import type { JSX } from 'react';
import { getMaterialByName } from '@/lib/materials';

type FurnitureType =
  | 'plant'
  | 'panel'
  | 'tower'
  | 'chair'
  | 'table'
  | 'lamp'
  | 'default';

interface FurnitureGeometryProps {
  type: FurnitureType;
  scale: number;
  isSelected: boolean;
  materialName?: string;
}

/** Shared values derived once and passed to each type renderer. */
interface TypeRendererProps {
  scale: number;
  isSelected: boolean;
  selectedColor: string;
  selectedEmissive: string;
  emissiveIntensity: number;
  customProps: Record<string, unknown> | null;
}

// ---------------------------------------------------------------------------
// Material helpers
// ---------------------------------------------------------------------------

function buildCustomProps(
  materialName: string | undefined,
  isSelected: boolean,
  selectedEmissive: string
): Record<string, unknown> | null {
  if (!materialName) return null;

  const mat = getMaterialByName(materialName);

  return {
    color: `#${mat.color.getHexString()}`,
    emissive: isSelected ? selectedEmissive : `#${mat.emissive.getHexString()}`,
    emissiveIntensity: isSelected
      ? Math.max(mat.emissiveIntensity || 0, 0.35)
      : mat.emissiveIntensity || 0,
    roughness: mat.roughness,
    metalness: mat.metalness,
    transparent: mat.transparent,
    opacity: mat.opacity,
  };
}

// ---------------------------------------------------------------------------
// Per-type renderers (each is a plain function → low cognitive complexity)
// ---------------------------------------------------------------------------

function PlantGeometry({
  scale: s,
  isSelected,
  selectedColor,
  selectedEmissive,
  emissiveIntensity: ei,
  customProps: cp,
}: TypeRendererProps) {
  return (
    <group>
      <mesh position={[0, 0.15 * s, 0]}>
        <cylinderGeometry args={[0.25 * s, 0.3 * s, 0.3 * s, 16]} />
        <meshStandardMaterial
          {...(cp || {
            color: isSelected ? '#8b6f47' : '#5c4033',
            emissive: selectedEmissive,
            emissiveIntensity: ei * 0.5,
            roughness: 0.8,
            metalness: 0.1,
          })}
        />
      </mesh>
      <mesh position={[0, 0.5 * s, 0]}>
        <cylinderGeometry args={[0.08 * s, 0.1 * s, 0.4 * s, 12]} />
        <meshStandardMaterial
          {...(cp || {
            color: isSelected ? '#6fb356' : '#4a7c59',
            emissive: selectedEmissive,
            emissiveIntensity: ei,
            roughness: 0.6,
            metalness: 0.1,
          })}
        />
      </mesh>
      <mesh position={[0, 0.85 * s, 0]}>
        <sphereGeometry args={[0.35 * s, 16, 16]} />
        <meshStandardMaterial
          {...(cp || {
            color: isSelected ? selectedColor : '#86c26f',
            emissive: isSelected ? '#4a9938' : '#2d5016',
            emissiveIntensity: isSelected ? 0.4 : 0.15,
            roughness: 0.5,
            metalness: 0.2,
          })}
        />
      </mesh>
      <mesh position={[0.25 * s, 0.75 * s, 0.1 * s]}>
        <sphereGeometry args={[0.15 * s, 12, 12]} />
        <meshStandardMaterial
          {...(cp || {
            color: isSelected ? selectedColor : '#7ddf64',
            emissive: isSelected ? '#4a9938' : '#2d5016',
            emissiveIntensity: isSelected ? 0.4 : 0.15,
            roughness: 0.5,
            metalness: 0.2,
          })}
        />
      </mesh>
      <mesh position={[-0.2 * s, 0.8 * s, -0.15 * s]}>
        <sphereGeometry args={[0.12 * s, 12, 12]} />
        <meshStandardMaterial
          {...(cp || {
            color: isSelected ? selectedColor : '#9aeb7f',
            emissive: isSelected ? '#4a9938' : '#2d5016',
            emissiveIntensity: isSelected ? 0.4 : 0.15,
            roughness: 0.5,
            metalness: 0.2,
          })}
        />
      </mesh>
    </group>
  );
}

function PanelGeometry({
  scale: s,
  isSelected,
  selectedEmissive,
  emissiveIntensity: ei,
}: TypeRendererProps) {
  return (
    <group>
      <mesh position={[0, 0.1 * s, 0]}>
        <boxGeometry args={[0.6 * s, 0.2 * s, 0.6 * s]} />
        <meshStandardMaterial
          color={isSelected ? '#5a5a5a' : '#3a3a3a'}
          emissive={selectedEmissive}
          emissiveIntensity={ei * 0.5}
          roughness={0.7}
          metalness={0.4}
        />
      </mesh>
      <mesh position={[0, 0.5 * s, 0]}>
        <cylinderGeometry args={[0.06 * s, 0.08 * s, 0.6 * s, 12]} />
        <meshStandardMaterial
          color={isSelected ? '#6a6a6a' : '#4a4a4a'}
          emissive={selectedEmissive}
          emissiveIntensity={ei * 0.5}
          roughness={0.6}
          metalness={0.5}
        />
      </mesh>
      <mesh position={[0.15 * s, 0.75 * s, 0]} rotation={[0, 0, Math.PI / 6]}>
        <cylinderGeometry args={[0.04 * s, 0.04 * s, 0.4 * s, 8]} />
        <meshStandardMaterial
          color={isSelected ? '#6a6a6a' : '#4a4a4a'}
          emissive={selectedEmissive}
          emissiveIntensity={ei * 0.5}
          roughness={0.6}
          metalness={0.5}
        />
      </mesh>
      <mesh position={[0.35 * s, 0.95 * s, 0]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[0.8 * s, 0.05 * s, 0.6 * s]} />
        <meshStandardMaterial
          color={isSelected ? '#4a9fd9' : '#1a5a8a'}
          emissive={isSelected ? '#2a6fa9' : '#0a3a5a'}
          emissiveIntensity={isSelected ? 0.5 : 0.2}
          roughness={0.2}
          metalness={0.6}
        />
      </mesh>
      <mesh position={[0.35 * s, 0.98 * s, 0]} rotation={[0, 0, Math.PI / 6]}>
        <boxGeometry args={[0.02 * s, 0.01 * s, 0.6 * s]} />
        <meshStandardMaterial
          color="#888888"
          emissive={selectedEmissive}
          emissiveIntensity={ei}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
    </group>
  );
}

function TowerGeometry({
  scale: s,
  isSelected,
  selectedColor,
  selectedEmissive,
  emissiveIntensity: ei,
}: TypeRendererProps) {
  return (
    <group>
      <mesh position={[0, 0.15 * s, 0]}>
        <cylinderGeometry args={[0.35 * s, 0.4 * s, 0.3 * s, 16]} />
        <meshStandardMaterial
          color={isSelected ? '#aaaaaa' : '#7a7a7a'}
          emissive={selectedEmissive}
          emissiveIntensity={ei * 0.5}
          roughness={0.4}
          metalness={0.6}
          transparent
          opacity={0.8}
        />
      </mesh>
      <mesh position={[0, 0.8 * s, 0]}>
        <cylinderGeometry args={[0.08 * s, 0.08 * s, 1.3 * s, 12]} />
        <meshStandardMaterial
          color={isSelected ? '#6a6a6a' : '#4a4a4a'}
          emissive={selectedEmissive}
          emissiveIntensity={ei * 0.5}
          roughness={0.6}
          metalness={0.5}
        />
      </mesh>
      <mesh position={[0, 0.5 * s, 0]}>
        <torusGeometry args={[0.3 * s, 0.12 * s, 8, 16]} />
        <meshStandardMaterial
          color={isSelected ? selectedColor : '#86c26f'}
          emissive={isSelected ? '#4a9938' : '#2d5016'}
          emissiveIntensity={isSelected ? 0.4 : 0.2}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0, 0.85 * s, 0]}>
        <torusGeometry args={[0.28 * s, 0.11 * s, 8, 16]} />
        <meshStandardMaterial
          color={isSelected ? selectedColor : '#7ddf64'}
          emissive={isSelected ? '#4a9938' : '#2d5016'}
          emissiveIntensity={isSelected ? 0.4 : 0.2}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0, 1.2 * s, 0]}>
        <torusGeometry args={[0.26 * s, 0.1 * s, 8, 16]} />
        <meshStandardMaterial
          color={isSelected ? selectedColor : '#9aeb7f'}
          emissive={isSelected ? '#4a9938' : '#2d5016'}
          emissiveIntensity={isSelected ? 0.4 : 0.2}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0, 1.5 * s, 0]}>
        <coneGeometry args={[0.2 * s, 0.2 * s, 8]} />
        <meshStandardMaterial
          color={isSelected ? '#6a6a6a' : '#4a4a4a'}
          emissive={selectedEmissive}
          emissiveIntensity={ei * 0.5}
          roughness={0.5}
          metalness={0.6}
        />
      </mesh>
    </group>
  );
}

function ChairGeometry({
  scale: s,
  isSelected,
  selectedEmissive,
  emissiveIntensity: ei,
}: TypeRendererProps) {
  return (
    <group>
      <mesh position={[0, 0.25 * s, 0]}>
        <cylinderGeometry args={[0.35 * s, 0.3 * s, 0.5 * s, 16]} />
        <meshStandardMaterial
          color={isSelected ? '#7a6a4f' : '#5a4a3f'}
          emissive={selectedEmissive}
          emissiveIntensity={ei * 0.5}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0, 0.55 * s, 0]}>
        <boxGeometry args={[0.6 * s, 0.1 * s, 0.5 * s]} />
        <meshStandardMaterial
          color={isSelected ? '#9aeb7f' : '#7ddf64'}
          emissive={isSelected ? '#4a9938' : '#2d5016'}
          emissiveIntensity={isSelected ? 0.3 : 0.1}
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>
      <mesh position={[0, 0.95 * s, -0.2 * s]}>
        <boxGeometry args={[0.6 * s, 0.7 * s, 0.1 * s]} />
        <meshStandardMaterial
          color={isSelected ? '#86c26f' : '#6fb356'}
          emissive={isSelected ? '#4a9938' : '#2d5016'}
          emissiveIntensity={isSelected ? 0.3 : 0.1}
          roughness={0.6}
          metalness={0.2}
        />
      </mesh>
      <mesh position={[-0.3 * s, 0.7 * s, 0]}>
        <boxGeometry args={[0.08 * s, 0.25 * s, 0.4 * s]} />
        <meshStandardMaterial
          color={isSelected ? '#7a6a4f' : '#5a4a3f'}
          emissive={selectedEmissive}
          emissiveIntensity={ei * 0.5}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0.3 * s, 0.7 * s, 0]}>
        <boxGeometry args={[0.08 * s, 0.25 * s, 0.4 * s]} />
        <meshStandardMaterial
          color={isSelected ? '#7a6a4f' : '#5a4a3f'}
          emissive={selectedEmissive}
          emissiveIntensity={ei * 0.5}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}

function TableGeometry({
  scale: s,
  isSelected,
  selectedEmissive,
  emissiveIntensity: ei,
}: TypeRendererProps) {
  return (
    <group>
      <mesh position={[0, 0.7 * s, 0]}>
        <boxGeometry args={[1.2 * s, 0.08 * s, 0.8 * s]} />
        <meshStandardMaterial
          color={isSelected ? '#9a8a6f' : '#7a6a4f'}
          emissive={selectedEmissive}
          emissiveIntensity={ei * 0.5}
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>
      <mesh position={[-0.5 * s, 0.35 * s, 0.35 * s]}>
        <cylinderGeometry args={[0.05 * s, 0.06 * s, 0.7 * s, 8]} />
        <meshStandardMaterial
          color={isSelected ? '#6a5a4f' : '#4a3a2f'}
          emissive={selectedEmissive}
          emissiveIntensity={ei * 0.5}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0.5 * s, 0.35 * s, 0.35 * s]}>
        <cylinderGeometry args={[0.05 * s, 0.06 * s, 0.7 * s, 8]} />
        <meshStandardMaterial
          color={isSelected ? '#6a5a4f' : '#4a3a2f'}
          emissive={selectedEmissive}
          emissiveIntensity={ei * 0.5}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[-0.5 * s, 0.35 * s, -0.35 * s]}>
        <cylinderGeometry args={[0.05 * s, 0.06 * s, 0.7 * s, 8]} />
        <meshStandardMaterial
          color={isSelected ? '#6a5a4f' : '#4a3a2f'}
          emissive={selectedEmissive}
          emissiveIntensity={ei * 0.5}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0.5 * s, 0.35 * s, -0.35 * s]}>
        <cylinderGeometry args={[0.05 * s, 0.06 * s, 0.7 * s, 8]} />
        <meshStandardMaterial
          color={isSelected ? '#6a5a4f' : '#4a3a2f'}
          emissive={selectedEmissive}
          emissiveIntensity={ei * 0.5}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0, 0.4 * s, 0]}>
        <boxGeometry args={[1.0 * s, 0.05 * s, 0.6 * s]} />
        <meshStandardMaterial
          color={isSelected ? '#6a5a4f' : '#4a3a2f'}
          emissive={selectedEmissive}
          emissiveIntensity={ei * 0.5}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}

function LampGeometry({
  scale: s,
  isSelected,
  selectedEmissive,
  emissiveIntensity: ei,
}: TypeRendererProps) {
  return (
    <group>
      <mesh position={[0, 0.1 * s, 0]}>
        <cylinderGeometry args={[0.15 * s, 0.2 * s, 0.2 * s, 16]} />
        <meshStandardMaterial
          color={isSelected ? '#5a5a5a' : '#3a3a3a'}
          emissive={selectedEmissive}
          emissiveIntensity={ei * 0.3}
          roughness={0.6}
          metalness={0.5}
        />
      </mesh>
      <mesh position={[0, 0.6 * s, 0]}>
        <cylinderGeometry args={[0.06 * s, 0.08 * s, 0.9 * s, 12]} />
        <meshStandardMaterial
          color={isSelected ? '#6a6a6a' : '#4a4a4a'}
          emissive={isSelected ? '#4a9938' : '#1a3a1a'}
          emissiveIntensity={isSelected ? 0.2 : 0.1}
          roughness={0.6}
          metalness={0.4}
        />
      </mesh>
      <mesh position={[0, 1.15 * s, 0]}>
        <sphereGeometry
          args={[0.35 * s, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]}
        />
        <meshStandardMaterial
          color={isSelected ? '#d4ff99' : '#b6ff99'}
          emissive={isSelected ? '#9aeb7f' : '#7ddf64'}
          emissiveIntensity={isSelected ? 0.8 : 0.5}
          roughness={0.3}
          metalness={0.1}
          transparent
          opacity={0.9}
        />
      </mesh>
      <mesh position={[0, 1.05 * s, 0]}>
        <sphereGeometry args={[0.15 * s, 12, 12]} />
        <meshBasicMaterial
          color={isSelected ? '#d4ff99' : '#b6ff99'}
          transparent
          opacity={0.8}
        />
      </mesh>
      <mesh position={[0, 1.1 * s, 0]}>
        <torusGeometry args={[0.25 * s, 0.03 * s, 8, 16]} />
        <meshStandardMaterial
          color="#7ddf64"
          emissive="#4a9938"
          emissiveIntensity={isSelected ? 0.6 : 0.3}
          roughness={0.4}
          metalness={0.2}
        />
      </mesh>
    </group>
  );
}

function DefaultGeometry({
  scale: s,
  isSelected,
  selectedColor,
  selectedEmissive,
  emissiveIntensity: ei,
}: TypeRendererProps) {
  return (
    <mesh>
      <boxGeometry args={[0.8 * s, 0.8 * s, 0.8 * s]} />
      <meshStandardMaterial
        color={isSelected ? selectedColor : '#86c26f'}
        emissive={selectedEmissive}
        emissiveIntensity={ei}
        metalness={0.1}
        roughness={0.7}
      />
    </mesh>
  );
}

// ---------------------------------------------------------------------------
// Lookup map & public component
// ---------------------------------------------------------------------------

const TYPE_RENDERERS: Record<
  FurnitureType,
  (props: TypeRendererProps) => JSX.Element
> = {
  plant: PlantGeometry,
  panel: PanelGeometry,
  tower: TowerGeometry,
  chair: ChairGeometry,
  table: TableGeometry,
  lamp: LampGeometry,
  default: DefaultGeometry,
};

export function FurnitureGeometry({
  type,
  scale,
  isSelected,
  materialName,
}: Readonly<FurnitureGeometryProps>) {
  const selectedColor = '#b6ff99';
  const selectedEmissive = '#2f6d25';
  const emissiveIntensity = isSelected ? 0.35 : 0;
  const customProps = buildCustomProps(
    materialName,
    isSelected,
    selectedEmissive
  );

  const Renderer = TYPE_RENDERERS[type] ?? DefaultGeometry;

  return (
    <Renderer
      scale={scale}
      isSelected={isSelected}
      selectedColor={selectedColor}
      selectedEmissive={selectedEmissive}
      emissiveIntensity={emissiveIntensity}
      customProps={customProps}
    />
  );
}
