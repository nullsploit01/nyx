uniform float time;

varying vec2 vUv;

void main() {
    vUv = uv;
    vec3 transformed = position;

    // taper blade
    transformed.x *= (1.0 - uv.y * 0.7);

    vec4 mvPosition = vec4(transformed, 1.0);

    #ifdef USE_INSTANCING
    mvPosition = instanceMatrix * mvPosition;
    #endif

    float dispPower = 1.0 - cos(uv.y * 3.1415926 * 0.5);
    float wind = sin(time * 2.0 + mvPosition.x * 1.7 + mvPosition.z * 1.3) * 0.12;
    float wind2 = sin(time * 4.0 + mvPosition.x * 4.0) * 0.03;

    mvPosition.x += (wind + wind2) * dispPower;
    vec4 modelViewPosition = modelViewMatrix * mvPosition;

    gl_Position = projectionMatrix * modelViewPosition;
}