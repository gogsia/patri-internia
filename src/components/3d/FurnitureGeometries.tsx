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
  | 'sofa'
  | 'bookshelf'
  | 'rug'
  | 'desk'
  | 'mirror'
  | 'vase'
  | 'curtain'
  | 'bed'
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

function SofaGeometry({
  scale: s,
  isSelected,
  selectedEmissive,
  emissiveIntensity: ei,
  customProps: cp,
}: TypeRendererProps) {
  return (
    <group>
      {/* Base / seat */}
      <mesh position={[0, 0.25 * s, 0]}>
        <boxGeometry args={[1.4 * s, 0.3 * s, 0.7 * s]} />
        <meshStandardMaterial
          {...(cp || {
            color: isSelected ? '#6a8a7a' : '#4a6a5a',
            emissive: selectedEmissive,
            emissiveIntensity: ei * 0.5,
            roughness: 0.8,
            metalness: 0.05,
          })}
        />
      </mesh>
      {/* Back rest */}
      <mesh position={[0, 0.55 * s, -0.28 * s]}>
        <boxGeometry args={[1.4 * s, 0.35 * s, 0.15 * s]} />
        <meshStandardMaterial
          {...(cp || {
            color: isSelected ? '#7a9a8a' : '#5a7a6a',
            emissive: selectedEmissive,
            emissiveIntensity: ei * 0.5,
            roughness: 0.8,
            metalness: 0.05,
          })}
        />
      </mesh>
      {/* Left arm */}
      <mesh position={[-0.62 * s, 0.4 * s, 0]}>
        <boxGeometry args={[0.15 * s, 0.5 * s, 0.7 * s]} />
        <meshStandardMaterial
          {...(cp || {
            color: isSelected ? '#6a8a7a' : '#4a6a5a',
            emissive: selectedEmissive,
            emissiveIntensity: ei * 0.5,
            roughness: 0.8,
            metalness: 0.05,
          })}
        />
      </mesh>
      {/* Right arm */}
      <mesh position={[0.62 * s, 0.4 * s, 0]}>
        <boxGeometry args={[0.15 * s, 0.5 * s, 0.7 * s]} />
        <meshStandardMaterial
          {...(cp || {
            color: isSelected ? '#6a8a7a' : '#4a6a5a',
            emissive: selectedEmissive,
            emissiveIntensity: ei * 0.5,
            roughness: 0.8,
            metalness: 0.05,
          })}
        />
      </mesh>
      {/* Cushions */}
      <mesh position={[-0.3 * s, 0.42 * s, 0.02 * s]}>
        <boxGeometry args={[0.5 * s, 0.08 * s, 0.55 * s]} />
        <meshStandardMaterial
          {...(cp || {
            color: isSelected ? '#8aaa9a' : '#6a9a7a',
            emissive: selectedEmissive,
            emissiveIntensity: ei * 0.3,
            roughness: 0.9,
            metalness: 0,
          })}
        />
      </mesh>
      <mesh position={[0.3 * s, 0.42 * s, 0.02 * s]}>
        <boxGeometry args={[0.5 * s, 0.08 * s, 0.55 * s]} />
        <meshStandardMaterial
          {...(cp || {
            color: isSelected ? '#8aaa9a' : '#6a9a7a',
            emissive: selectedEmissive,
            emissiveIntensity: ei * 0.3,
            roughness: 0.9,
            metalness: 0,
          })}
        />
      </mesh>
    </group>
  );
}

function BookshelfGeometry({
  scale: s,
  isSelected,
  selectedEmissive,
  emissiveIntensity: ei,
  customProps: cp,
}: TypeRendererProps) {
  return (
    <group>
      {/* Frame */}
      <mesh position={[0, 0.75 * s, 0]}>
        <boxGeometry args={[0.9 * s, 1.5 * s, 0.3 * s]} />
        <meshStandardMaterial
          {...(cp || {
            color: isSelected ? '#8a7a5f' : '#6a5a3f',
            emissive: selectedEmissive,
            emissiveIntensity: ei * 0.3,
            roughness: 0.8,
            metalness: 0.1,
          })}
        />
      </mesh>
      {/* Shelves */}
      {[0.3, 0.6, 0.9, 1.2].map((y) => (
        <mesh key={y} position={[0, y * s, 0.02 * s]}>
          <boxGeometry args={[0.8 * s, 0.04 * s, 0.26 * s]} />
          <meshStandardMaterial
            {...(cp || {
              color: isSelected ? '#9a8a6f' : '#7a6a4f',
              emissive: selectedEmissive,
              emissiveIntensity: ei * 0.3,
              roughness: 0.7,
              metalness: 0.1,
            })}
          />
        </mesh>
      ))}
      {/* Books (colored blocks) */}
      <mesh position={[-0.2 * s, 0.48 * s, 0.02 * s]}>
        <boxGeometry args={[0.15 * s, 0.22 * s, 0.18 * s]} />
        <meshStandardMaterial
          color={isSelected ? '#c47a7a' : '#a45a5a'}
          emissive={selectedEmissive}
          emissiveIntensity={ei * 0.2}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0.0 * s, 0.46 * s, 0.02 * s]}>
        <boxGeometry args={[0.12 * s, 0.18 * s, 0.18 * s]} />
        <meshStandardMaterial
          color={isSelected ? '#7a9ac4' : '#5a7aa4'}
          emissive={selectedEmissive}
          emissiveIntensity={ei * 0.2}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
      <mesh position={[0.15 * s, 0.47 * s, 0.02 * s]}>
        <boxGeometry args={[0.1 * s, 0.2 * s, 0.18 * s]} />
        <meshStandardMaterial
          color={isSelected ? '#8ac47a' : '#6aa45a'}
          emissive={selectedEmissive}
          emissiveIntensity={ei * 0.2}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}

function RugGeometry({
  scale: s,
  isSelected,
  selectedEmissive,
  emissiveIntensity: ei,
  customProps: cp,
}: TypeRendererProps) {
  return (
    <group>
      <mesh position={[0, 0.02 * s, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.0 * s, 1.4 * s]} />
        <meshStandardMaterial
          {...(cp || {
            color: isSelected ? '#b89a6a' : '#9a7a4a',
            emissive: selectedEmissive,
            emissiveIntensity: ei * 0.3,
            roughness: 0.95,
            metalness: 0,
          })}
          side={2}
        />
      </mesh>
      {/* Border stripe */}
      <mesh position={[0, 0.025 * s, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.9 * s, 0.95 * s, 4]} />
        <meshStandardMaterial
          color={isSelected ? '#d4aa6a' : '#b48a4a'}
          emissive={selectedEmissive}
          emissiveIntensity={ei * 0.2}
          roughness={0.9}
          metalness={0}
          side={2}
        />
      </mesh>
    </group>
  );
}

function DeskGeometry({
  scale: s,
  isSelected,
  selectedEmissive,
  emissiveIntensity: ei,
  customProps: cp,
}: TypeRendererProps) {
  return (
    <group>
      {/* Desktop surface */}
      <mesh position={[0, 0.72 * s, 0]}>
        <boxGeometry args={[1.4 * s, 0.06 * s, 0.7 * s]} />
        <meshStandardMaterial
          {...(cp || {
            color: isSelected ? '#a09080' : '#806a5a',
            emissive: selectedEmissive,
            emissiveIntensity: ei * 0.4,
            roughness: 0.6,
            metalness: 0.15,
          })}
        />
      </mesh>
      {/* Left panel leg */}
      <mesh position={[-0.6 * s, 0.35 * s, 0]}>
        <boxGeometry args={[0.06 * s, 0.7 * s, 0.6 * s]} />
        <meshStandardMaterial
          {...(cp || {
            color: isSelected ? '#7a6a5a' : '#5a4a3a',
            emissive: selectedEmissive,
            emissiveIntensity: ei * 0.3,
            roughness: 0.7,
            metalness: 0.2,
          })}
        />
      </mesh>
      {/* Right panel leg */}
      <mesh position={[0.6 * s, 0.35 * s, 0]}>
        <boxGeometry args={[0.06 * s, 0.7 * s, 0.6 * s]} />
        <meshStandardMaterial
          {...(cp || {
            color: isSelected ? '#7a6a5a' : '#5a4a3a',
            emissive: selectedEmissive,
            emissiveIntensity: ei * 0.3,
            roughness: 0.7,
            metalness: 0.2,
          })}
        />
      </mesh>
      {/* Drawer */}
      <mesh position={[0.3 * s, 0.58 * s, 0.05 * s]}>
        <boxGeometry args={[0.5 * s, 0.15 * s, 0.5 * s]} />
        <meshStandardMaterial
          {...(cp || {
            color: isSelected ? '#8a7a6a' : '#6a5a4a',
            emissive: selectedEmissive,
            emissiveIntensity: ei * 0.3,
            roughness: 0.7,
            metalness: 0.15,
          })}
        />
      </mesh>
    </group>
  );
}

function MirrorGeometry({
  scale: s,
  isSelected,
  selectedEmissive,
  emissiveIntensity: ei,
}: TypeRendererProps) {
  return (
    <group>
      {/* Frame */}
      <mesh position={[0, 1.0 * s, 0]}>
        <cylinderGeometry args={[0.5 * s, 0.5 * s, 0.05 * s, 32]} />
        <meshStandardMaterial
          color={isSelected ? '#c4aa7a' : '#a48a5a'}
          emissive={selectedEmissive}
          emissiveIntensity={ei * 0.3}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>
      {/* Mirror surface */}
      <mesh position={[0, 1.0 * s, 0.03 * s]}>
        <cylinderGeometry args={[0.44 * s, 0.44 * s, 0.02 * s, 32]} />
        <meshStandardMaterial
          color={isSelected ? '#e8f0ff' : '#c8d8f0'}
          emissive={isSelected ? '#8ab8e8' : '#4a7aaa'}
          emissiveIntensity={isSelected ? 0.6 : 0.3}
          roughness={0.05}
          metalness={0.95}
        />
      </mesh>
      {/* Stand */}
      <mesh position={[0, 0.4 * s, -0.1 * s]}>
        <cylinderGeometry args={[0.04 * s, 0.06 * s, 0.8 * s, 8]} />
        <meshStandardMaterial
          color={isSelected ? '#9a8a6a' : '#7a6a4a'}
          emissive={selectedEmissive}
          emissiveIntensity={ei * 0.3}
          roughness={0.5}
          metalness={0.5}
        />
      </mesh>
    </group>
  );
}

function VaseGeometry({
  scale: s,
  isSelected,
  selectedColor,
  selectedEmissive,
  emissiveIntensity: ei,
  customProps: cp,
}: TypeRendererProps) {
  return (
    <group>
      {/* Base */}
      <mesh position={[0, 0.08 * s, 0]}>
        <cylinderGeometry args={[0.12 * s, 0.15 * s, 0.16 * s, 16]} />
        <meshStandardMaterial
          {...(cp || {
            color: isSelected ? '#c4946a' : '#a47a4a',
            emissive: selectedEmissive,
            emissiveIntensity: ei * 0.3,
            roughness: 0.4,
            metalness: 0.3,
          })}
        />
      </mesh>
      {/* Body */}
      <mesh position={[0, 0.35 * s, 0]}>
        <sphereGeometry
          args={[0.2 * s, 16, 16, 0, Math.PI * 2, 0, Math.PI * 0.7]}
        />
        <meshStandardMaterial
          {...(cp || {
            color: isSelected ? '#c4946a' : '#a47a4a',
            emissive: selectedEmissive,
            emissiveIntensity: ei * 0.3,
            roughness: 0.4,
            metalness: 0.3,
          })}
        />
      </mesh>
      {/* Neck */}
      <mesh position={[0, 0.5 * s, 0]}>
        <cylinderGeometry args={[0.08 * s, 0.14 * s, 0.2 * s, 16]} />
        <meshStandardMaterial
          {...(cp || {
            color: isSelected ? '#c4946a' : '#a47a4a',
            emissive: selectedEmissive,
            emissiveIntensity: ei * 0.3,
            roughness: 0.4,
            metalness: 0.3,
          })}
        />
      </mesh>
      {/* Flower stems */}
      <mesh position={[0, 0.7 * s, 0]}>
        <cylinderGeometry args={[0.01 * s, 0.01 * s, 0.3 * s, 6]} />
        <meshStandardMaterial
          color="#4a7a3a"
          emissive="#2a4a1a"
          emissiveIntensity={0.1}
          roughness={0.7}
          metalness={0}
        />
      </mesh>
      <mesh position={[0, 0.88 * s, 0]}>
        <sphereGeometry args={[0.06 * s, 8, 8]} />
        <meshStandardMaterial
          color={isSelected ? selectedColor : '#e8a0c0'}
          emissive={isSelected ? '#c47090' : '#a05070'}
          emissiveIntensity={isSelected ? 0.4 : 0.2}
          roughness={0.5}
          metalness={0.1}
        />
      </mesh>
    </group>
  );
}

function CurtainGeometry({
  scale: s,
  isSelected,
  selectedEmissive,
  emissiveIntensity: ei,
  customProps: cp,
}: TypeRendererProps) {
  return (
    <group>
      {/* Rod */}
      <mesh position={[0, 1.6 * s, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.03 * s, 0.03 * s, 1.2 * s, 8]} />
        <meshStandardMaterial
          color={isSelected ? '#8a8a7a' : '#6a6a5a'}
          emissive={selectedEmissive}
          emissiveIntensity={ei * 0.2}
          roughness={0.3}
          metalness={0.7}
        />
      </mesh>
      {/* Left panel */}
      <mesh position={[-0.35 * s, 0.85 * s, 0]}>
        <boxGeometry args={[0.4 * s, 1.5 * s, 0.04 * s]} />
        <meshStandardMaterial
          {...(cp || {
            color: isSelected ? '#a0b8a0' : '#809880',
            emissive: selectedEmissive,
            emissiveIntensity: ei * 0.2,
            roughness: 0.9,
            metalness: 0,
            transparent: true,
            opacity: 0.85,
          })}
        />
      </mesh>
      {/* Right panel */}
      <mesh position={[0.35 * s, 0.85 * s, 0]}>
        <boxGeometry args={[0.4 * s, 1.5 * s, 0.04 * s]} />
        <meshStandardMaterial
          {...(cp || {
            color: isSelected ? '#a0b8a0' : '#809880',
            emissive: selectedEmissive,
            emissiveIntensity: ei * 0.2,
            roughness: 0.9,
            metalness: 0,
            transparent: true,
            opacity: 0.85,
          })}
        />
      </mesh>
    </group>
  );
}

function BedGeometry({
  scale: s,
  isSelected,
  selectedEmissive,
  emissiveIntensity: ei,
  customProps: cp,
}: TypeRendererProps) {
  return (
    <group>
      {/* Frame / mattress base */}
      <mesh position={[0, 0.2 * s, 0]}>
        <boxGeometry args={[1.2 * s, 0.2 * s, 1.8 * s]} />
        <meshStandardMaterial
          {...(cp || {
            color: isSelected ? '#8a7a5f' : '#6a5a3f',
            emissive: selectedEmissive,
            emissiveIntensity: ei * 0.3,
            roughness: 0.8,
            metalness: 0.1,
          })}
        />
      </mesh>
      {/* Mattress */}
      <mesh position={[0, 0.38 * s, 0.05 * s]}>
        <boxGeometry args={[1.1 * s, 0.15 * s, 1.65 * s]} />
        <meshStandardMaterial
          {...(cp || {
            color: isSelected ? '#e8e0d0' : '#d0c8b8',
            emissive: selectedEmissive,
            emissiveIntensity: ei * 0.2,
            roughness: 0.9,
            metalness: 0,
          })}
        />
      </mesh>
      {/* Headboard */}
      <mesh position={[0, 0.65 * s, -0.82 * s]}>
        <boxGeometry args={[1.2 * s, 0.7 * s, 0.08 * s]} />
        <meshStandardMaterial
          {...(cp || {
            color: isSelected ? '#9a8a6f' : '#7a6a4f',
            emissive: selectedEmissive,
            emissiveIntensity: ei * 0.3,
            roughness: 0.7,
            metalness: 0.15,
          })}
        />
      </mesh>
      {/* Pillow */}
      <mesh position={[0, 0.5 * s, -0.55 * s]}>
        <boxGeometry args={[0.7 * s, 0.1 * s, 0.35 * s]} />
        <meshStandardMaterial
          color={isSelected ? '#f0ece5' : '#e0d8c8'}
          emissive={selectedEmissive}
          emissiveIntensity={ei * 0.2}
          roughness={0.95}
          metalness={0}
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
  sofa: SofaGeometry,
  bookshelf: BookshelfGeometry,
  rug: RugGeometry,
  desk: DeskGeometry,
  mirror: MirrorGeometry,
  vase: VaseGeometry,
  curtain: CurtainGeometry,
  bed: BedGeometry,
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
