const pixelFragmentShader = /* glsl */ `
uniform sampler2D uTexture;
uniform float uPixelSize;
uniform float uTime;
uniform vec3 uGlowColor;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
  vec2 uv = floor(vUv * uPixelSize) / uPixelSize;
  vec4 baseColor = texture2D(uTexture, uv);

  vec3 viewDir = normalize(cameraPosition - vWorldPosition);
  float fresnel = 1.0 - max(dot(normalize(vNormal), viewDir), 0.0);
  float pulse = 0.5 + 0.5 * sin(uTime * 1.25);
  float glowAmount = pow(fresnel, 2.0) * 0.25 * pulse;

  vec3 finalRgb = mix(baseColor.rgb, uGlowColor, glowAmount);
  gl_FragColor = vec4(finalRgb, baseColor.a);
}
`;

export default pixelFragmentShader;
