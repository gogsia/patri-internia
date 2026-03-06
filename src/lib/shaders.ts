import * as THREE from 'three';
import pixelVertexShader from '@/experiences/shaders/pixel.vert';
import pixelFragmentShader from '@/experiences/shaders/pixel.frag';

export function createPixelShaderMaterial(texture?: THREE.Texture, pixelSize = 24) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTexture: { value: texture ?? new THREE.Texture() },
      uPixelSize: { value: pixelSize },
      uTime: { value: 0 },
      uGlowColor: { value: new THREE.Color('#7ddf64') },
    },
    vertexShader: pixelVertexShader,
    fragmentShader: pixelFragmentShader,
  });
}
