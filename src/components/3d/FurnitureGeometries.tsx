'use client';
import { getMaterialByName } from '@/lib/materials';

interface FurnitureGeometryProps {
  type: 'plant' | 'panel' | 'tower' | 'chair' | 'table' | 'lamp' | 'default';
  scale: number;
  isSelected: boolean;
  materialName?: string;
}

export function FurnitureGeometry({
  type,
  scale,
  isSelected,
  materialName,
}: Readonly<FurnitureGeometryProps>) {
  const selectedColor = '#b6ff99';
  const selectedEmissive = '#2f6d25';
  const emissiveIntensity = isSelected ? 0.35 : 0;

  // Get custom material if provided
  const customMaterial = materialName ? getMaterialByName(materialName) : null;

  // Helper to get material properties for custom material - preserves selection glow
  const getCustomMaterialProps = () => {
    if (!customMaterial) return null;

    const color = `#${customMaterial.color.getHexString()}`;
    const emissive = isSelected
      ? selectedEmissive
      : `#${customMaterial.emissive.getHexString()}`;
    const emissiveIntensity = isSelected
      ? Math.max(customMaterial.emissiveIntensity || 0, 0.35)
      : customMaterial.emissiveIntensity || 0;

    return {
      color,
      emissive,
      emissiveIntensity,
      roughness: customMaterial.roughness,
      metalness: customMaterial.metalness,
      transparent: customMaterial.transparent,
      opacity: customMaterial.opacity,
    };
  };

  const customProps = getCustomMaterialProps();

  // Solar Succulent - Sphere plant on cylinder stem
  if (type === 'plant') {
    return (
      <group>
        {/* Pot */}
        <mesh position={[0, 0.15 * scale, 0]}>
          <cylinderGeometry
            args={[0.25 * scale, 0.3 * scale, 0.3 * scale, 16]}
          />
          <meshStandardMaterial
            {...(customProps || {
              color: isSelected ? '#8b6f47' : '#5c4033',
              emissive: selectedEmissive,
              emissiveIntensity: emissiveIntensity * 0.5,
              roughness: 0.8,
              metalness: 0.1,
            })}
          />
        </mesh>
        {/* Stem */}
        <mesh position={[0, 0.5 * scale, 0]}>
          <cylinderGeometry
            args={[0.08 * scale, 0.1 * scale, 0.4 * scale, 12]}
          />
          <meshStandardMaterial
            {...(customProps || {
              color: isSelected ? '#6fb356' : '#4a7c59',
              emissive: selectedEmissive,
              emissiveIntensity: emissiveIntensity,
              roughness: 0.6,
              metalness: 0.1,
            })}
          />
        </mesh>
        {/* Main sphere cluster */}
        <mesh position={[0, 0.85 * scale, 0]}>
          <sphereGeometry args={[0.35 * scale, 16, 16]} />
          <meshStandardMaterial
            {...(customProps || {
              color: isSelected ? selectedColor : '#86c26f',
              emissive: isSelected ? '#4a9938' : '#2d5016',
              emissiveIntensity: isSelected ? 0.4 : 0.15,
              roughness: 0.5,
              metalness: 0.2,
            })}
          />
        </mesh>
        {/* Small sphere accents */}
        <mesh position={[0.25 * scale, 0.75 * scale, 0.1 * scale]}>
          <sphereGeometry args={[0.15 * scale, 12, 12]} />
          <meshStandardMaterial
            {...(customProps || {
              color: isSelected ? selectedColor : '#7ddf64',
              emissive: isSelected ? '#4a9938' : '#2d5016',
              emissiveIntensity: isSelected ? 0.4 : 0.15,
              roughness: 0.5,
              metalness: 0.2,
            })}
          />
        </mesh>
        <mesh position={[-0.2 * scale, 0.8 * scale, -0.15 * scale]}>
          <sphereGeometry args={[0.12 * scale, 12, 12]} />
          <meshStandardMaterial
            {...(customProps || {
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

  // Solar Panel Station - Flat panel on stand
  if (type === 'panel') {
    return (
      <group>
        {/* Base */}
        <mesh position={[0, 0.1 * scale, 0]}>
          <boxGeometry args={[0.6 * scale, 0.2 * scale, 0.6 * scale]} />
          <meshStandardMaterial
            color={isSelected ? '#5a5a5a' : '#3a3a3a'}
            emissive={selectedEmissive}
            emissiveIntensity={emissiveIntensity * 0.5}
            roughness={0.7}
            metalness={0.4}
          />
        </mesh>
        {/* Support pole */}
        <mesh position={[0, 0.5 * scale, 0]}>
          <cylinderGeometry
            args={[0.06 * scale, 0.08 * scale, 0.6 * scale, 12]}
          />
          <meshStandardMaterial
            color={isSelected ? '#6a6a6a' : '#4a4a4a'}
            emissive={selectedEmissive}
            emissiveIntensity={emissiveIntensity * 0.5}
            roughness={0.6}
            metalness={0.5}
          />
        </mesh>
        {/* Angled panel arm */}
        <mesh
          position={[0.15 * scale, 0.75 * scale, 0]}
          rotation={[0, 0, Math.PI / 6]}
        >
          <cylinderGeometry
            args={[0.04 * scale, 0.04 * scale, 0.4 * scale, 8]}
          />
          <meshStandardMaterial
            color={isSelected ? '#6a6a6a' : '#4a4a4a'}
            emissive={selectedEmissive}
            emissiveIntensity={emissiveIntensity * 0.5}
            roughness={0.6}
            metalness={0.5}
          />
        </mesh>
        {/* Solar panel - main surface */}
        <mesh
          position={[0.35 * scale, 0.95 * scale, 0]}
          rotation={[0, 0, Math.PI / 6]}
        >
          <boxGeometry args={[0.8 * scale, 0.05 * scale, 0.6 * scale]} />
          <meshStandardMaterial
            color={isSelected ? '#4a9fd9' : '#1a5a8a'}
            emissive={isSelected ? '#2a6fa9' : '#0a3a5a'}
            emissiveIntensity={isSelected ? 0.5 : 0.2}
            roughness={0.2}
            metalness={0.6}
          />
        </mesh>
        {/* Panel grid lines */}
        <mesh
          position={[0.35 * scale, 0.98 * scale, 0]}
          rotation={[0, 0, Math.PI / 6]}
        >
          <boxGeometry args={[0.02 * scale, 0.01 * scale, 0.6 * scale]} />
          <meshStandardMaterial
            color="#888888"
            emissive={selectedEmissive}
            emissiveIntensity={emissiveIntensity}
            roughness={0.3}
            metalness={0.7}
          />
        </mesh>
      </group>
    );
  }

  // Hydroponic Tower - Stacked structure with greenery
  if (type === 'tower') {
    return (
      <group>
        {/* Base tank */}
        <mesh position={[0, 0.15 * scale, 0]}>
          <cylinderGeometry
            args={[0.35 * scale, 0.4 * scale, 0.3 * scale, 16]}
          />
          <meshStandardMaterial
            color={isSelected ? '#aaaaaa' : '#7a7a7a'}
            emissive={selectedEmissive}
            emissiveIntensity={emissiveIntensity * 0.5}
            roughness={0.4}
            metalness={0.6}
            transparent
            opacity={0.8}
          />
        </mesh>
        {/* Central support column */}
        <mesh position={[0, 0.8 * scale, 0]}>
          <cylinderGeometry
            args={[0.08 * scale, 0.08 * scale, 1.3 * scale, 12]}
          />
          <meshStandardMaterial
            color={isSelected ? '#6a6a6a' : '#4a4a4a'}
            emissive={selectedEmissive}
            emissiveIntensity={emissiveIntensity * 0.5}
            roughness={0.6}
            metalness={0.5}
          />
        </mesh>
        {/* Tier 1 */}
        <mesh position={[0, 0.5 * scale, 0]}>
          <torusGeometry args={[0.3 * scale, 0.12 * scale, 8, 16]} />
          <meshStandardMaterial
            color={isSelected ? selectedColor : '#86c26f'}
            emissive={isSelected ? '#4a9938' : '#2d5016'}
            emissiveIntensity={isSelected ? 0.4 : 0.2}
            roughness={0.6}
            metalness={0.1}
          />
        </mesh>
        {/* Tier 2 */}
        <mesh position={[0, 0.85 * scale, 0]}>
          <torusGeometry args={[0.28 * scale, 0.11 * scale, 8, 16]} />
          <meshStandardMaterial
            color={isSelected ? selectedColor : '#7ddf64'}
            emissive={isSelected ? '#4a9938' : '#2d5016'}
            emissiveIntensity={isSelected ? 0.4 : 0.2}
            roughness={0.6}
            metalness={0.1}
          />
        </mesh>
        {/* Tier 3 */}
        <mesh position={[0, 1.2 * scale, 0]}>
          <torusGeometry args={[0.26 * scale, 0.1 * scale, 8, 16]} />
          <meshStandardMaterial
            color={isSelected ? selectedColor : '#9aeb7f'}
            emissive={isSelected ? '#4a9938' : '#2d5016'}
            emissiveIntensity={isSelected ? 0.4 : 0.2}
            roughness={0.6}
            metalness={0.1}
          />
        </mesh>
        {/* Top cap */}
        <mesh position={[0, 1.5 * scale, 0]}>
          <coneGeometry args={[0.2 * scale, 0.2 * scale, 8]} />
          <meshStandardMaterial
            color={isSelected ? '#6a6a6a' : '#4a4a4a'}
            emissive={selectedEmissive}
            emissiveIntensity={emissiveIntensity * 0.5}
            roughness={0.5}
            metalness={0.6}
          />
        </mesh>
      </group>
    );
  }

  // Eco Chair - Organic curved seating
  if (type === 'chair') {
    return (
      <group>
        {/* Base/Legs */}
        <mesh position={[0, 0.25 * scale, 0]}>
          <cylinderGeometry
            args={[0.35 * scale, 0.3 * scale, 0.5 * scale, 16]}
          />
          <meshStandardMaterial
            color={isSelected ? '#7a6a4f' : '#5a4a3f'}
            emissive={selectedEmissive}
            emissiveIntensity={emissiveIntensity * 0.5}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
        {/* Seat */}
        <mesh position={[0, 0.55 * scale, 0]}>
          <boxGeometry args={[0.6 * scale, 0.1 * scale, 0.5 * scale]} />
          <meshStandardMaterial
            color={isSelected ? '#9aeb7f' : '#7ddf64'}
            emissive={isSelected ? '#4a9938' : '#2d5016'}
            emissiveIntensity={isSelected ? 0.3 : 0.1}
            roughness={0.6}
            metalness={0.2}
          />
        </mesh>
        {/* Backrest */}
        <mesh position={[0, 0.95 * scale, -0.2 * scale]}>
          <boxGeometry args={[0.6 * scale, 0.7 * scale, 0.1 * scale]} />
          <meshStandardMaterial
            color={isSelected ? '#86c26f' : '#6fb356'}
            emissive={isSelected ? '#4a9938' : '#2d5016'}
            emissiveIntensity={isSelected ? 0.3 : 0.1}
            roughness={0.6}
            metalness={0.2}
          />
        </mesh>
        {/* Armrest Left */}
        <mesh position={[-0.3 * scale, 0.7 * scale, 0]}>
          <boxGeometry args={[0.08 * scale, 0.25 * scale, 0.4 * scale]} />
          <meshStandardMaterial
            color={isSelected ? '#7a6a4f' : '#5a4a3f'}
            emissive={selectedEmissive}
            emissiveIntensity={emissiveIntensity * 0.5}
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
        {/* Armrest Right */}
        <mesh position={[0.3 * scale, 0.7 * scale, 0]}>
          <boxGeometry args={[0.08 * scale, 0.25 * scale, 0.4 * scale]} />
          <meshStandardMaterial
            color={isSelected ? '#7a6a4f' : '#5a4a3f'}
            emissive={selectedEmissive}
            emissiveIntensity={emissiveIntensity * 0.5}
            roughness={0.7}
            metalness={0.1}
          />
        </mesh>
      </group>
    );
  }

  // Work Table - Sustainable desk surface
  if (type === 'table') {
    return (
      <group>
        {/* Table Top */}
        <mesh position={[0, 0.7 * scale, 0]}>
          <boxGeometry args={[1.2 * scale, 0.08 * scale, 0.8 * scale]} />
          <meshStandardMaterial
            color={isSelected ? '#9a8a6f' : '#7a6a4f'}
            emissive={selectedEmissive}
            emissiveIntensity={emissiveIntensity * 0.5}
            roughness={0.7}
            metalness={0.2}
          />
        </mesh>
        {/* Leg 1 */}
        <mesh position={[-0.5 * scale, 0.35 * scale, 0.35 * scale]}>
          <cylinderGeometry
            args={[0.05 * scale, 0.06 * scale, 0.7 * scale, 8]}
          />
          <meshStandardMaterial
            color={isSelected ? '#6a5a4f' : '#4a3a2f'}
            emissive={selectedEmissive}
            emissiveIntensity={emissiveIntensity * 0.5}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
        {/* Leg 2 */}
        <mesh position={[0.5 * scale, 0.35 * scale, 0.35 * scale]}>
          <cylinderGeometry
            args={[0.05 * scale, 0.06 * scale, 0.7 * scale, 8]}
          />
          <meshStandardMaterial
            color={isSelected ? '#6a5a4f' : '#4a3a2f'}
            emissive={selectedEmissive}
            emissiveIntensity={emissiveIntensity * 0.5}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
        {/* Leg 3 */}
        <mesh position={[-0.5 * scale, 0.35 * scale, -0.35 * scale]}>
          <cylinderGeometry
            args={[0.05 * scale, 0.06 * scale, 0.7 * scale, 8]}
          />
          <meshStandardMaterial
            color={isSelected ? '#6a5a4f' : '#4a3a2f'}
            emissive={selectedEmissive}
            emissiveIntensity={emissiveIntensity * 0.5}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
        {/* Leg 4 */}
        <mesh position={[0.5 * scale, 0.35 * scale, -0.35 * scale]}>
          <cylinderGeometry
            args={[0.05 * scale, 0.06 * scale, 0.7 * scale, 8]}
          />
          <meshStandardMaterial
            color={isSelected ? '#6a5a4f' : '#4a3a2f'}
            emissive={selectedEmissive}
            emissiveIntensity={emissiveIntensity * 0.5}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
        {/* Center brace */}
        <mesh position={[0, 0.4 * scale, 0]}>
          <boxGeometry args={[1.0 * scale, 0.05 * scale, 0.6 * scale]} />
          <meshStandardMaterial
            color={isSelected ? '#6a5a4f' : '#4a3a2f'}
            emissive={selectedEmissive}
            emissiveIntensity={emissiveIntensity * 0.5}
            roughness={0.8}
            metalness={0.1}
          />
        </mesh>
      </group>
    );
  }

  // Bioluminescent Lamp - Glowing mushroom-like light
  if (type === 'lamp') {
    return (
      <group>
        {/* Base */}
        <mesh position={[0, 0.1 * scale, 0]}>
          <cylinderGeometry
            args={[0.15 * scale, 0.2 * scale, 0.2 * scale, 16]}
          />
          <meshStandardMaterial
            color={isSelected ? '#5a5a5a' : '#3a3a3a'}
            emissive={selectedEmissive}
            emissiveIntensity={emissiveIntensity * 0.3}
            roughness={0.6}
            metalness={0.5}
          />
        </mesh>
        {/* Stem */}
        <mesh position={[0, 0.6 * scale, 0]}>
          <cylinderGeometry
            args={[0.06 * scale, 0.08 * scale, 0.9 * scale, 12]}
          />
          <meshStandardMaterial
            color={isSelected ? '#6a6a6a' : '#4a4a4a'}
            emissive={isSelected ? '#4a9938' : '#1a3a1a'}
            emissiveIntensity={isSelected ? 0.2 : 0.1}
            roughness={0.6}
            metalness={0.4}
          />
        </mesh>
        {/* Light shade - mushroom cap */}
        <mesh position={[0, 1.15 * scale, 0]}>
          <sphereGeometry
            args={[0.35 * scale, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]}
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
        {/* Glow orb inside */}
        <mesh position={[0, 1.05 * scale, 0]}>
          <sphereGeometry args={[0.15 * scale, 12, 12]} />
          <meshBasicMaterial
            color={isSelected ? '#d4ff99' : '#b6ff99'}
            transparent
            opacity={0.8}
          />
        </mesh>
        {/* Accent rings */}
        <mesh position={[0, 1.1 * scale, 0]}>
          <torusGeometry args={[0.25 * scale, 0.03 * scale, 8, 16]} />
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

  // Default fallback - Enhanced box
  return (
    <mesh>
      <boxGeometry args={[0.8 * scale, 0.8 * scale, 0.8 * scale]} />
      <meshStandardMaterial
        color={isSelected ? selectedColor : '#86c26f'}
        emissive={selectedEmissive}
        emissiveIntensity={emissiveIntensity}
        metalness={0.1}
        roughness={0.7}
      />
    </mesh>
  );
}
