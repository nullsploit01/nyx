void main() {
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = 140.0 * (300.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
}