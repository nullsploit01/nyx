varying vec2 vUv;

void main() {

    vec3 baseColor = mix(vec3(0.16, 0.28, 0.12), vec3(0.32, 0.48, 0.24), vUv.y);
    float fresnel = pow(1.0 - abs(vUv.x - 0.5) * 1.0, 1.0);
    baseColor += fresnel * 0.04;
    gl_FragColor = vec4(baseColor, 1.0);
}