'use client';

import { useMemo } from 'react';
import { useGLTF } from '@react-three/drei';

type DesignerModelProps = {
  url: string;
};

export default function DesignerModel({ url }: Readonly<DesignerModelProps>) {
  const gltf = useGLTF(url);
  const cloned = useMemo(() => gltf.scene.clone(), [gltf.scene]);

  return <primitive object={cloned} position={[0, 0, 0]} scale={0.9} />;
}
