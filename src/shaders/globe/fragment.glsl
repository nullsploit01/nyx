varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {

    vec3 viewDirection = normalize(cameraPosition - vWorldPosition);

    float fresnel = pow(1.0 - max(dot(viewDirection, -vNormal), 0.0), 3.0);
    float rim = smoothstep(0.4, 1.0, fresnel);

    vec3 color = vec3(0.5, 0.65, 1.0) * rim;
    gl_FragColor = vec4(color, rim);
}