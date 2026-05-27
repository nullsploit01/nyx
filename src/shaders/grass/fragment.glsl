varying vec2 vUv;

void main() {
    vec3 bottomColor = vec3(0.03, 0.06, 0.02);
    vec3 topColor = vec3(0.08, 0.12, 0.05);
    vec3 baseColor = mix(bottomColor, topColor, vUv.y);
    gl_FragColor = vec4(baseColor, 1.0);
}