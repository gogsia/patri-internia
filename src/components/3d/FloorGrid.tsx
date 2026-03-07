'use client';

interface FloorGridProps {
  size?: number;
  divisions?: number;
  color1?: string;
  color2?: string;
  visible?: boolean;
}

export default function FloorGrid({
  size = 20,
  divisions = 20,
  color1 = '#555555',
  color2 = '#333333',
  visible = true,
}: Readonly<FloorGridProps>) {
  if (!visible) return null;

  return (
    <gridHelper
      args={[size, divisions, color1, color2]}
      position={[0, 0.01, 0]}
    />
  );
}
