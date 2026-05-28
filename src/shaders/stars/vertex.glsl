attribute float size;
varying vec3 vColor;
uniform float telescopeZoom;

void main() {
    vColor = color;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);

    gl_PointSize = size * (300.0 / -mvPosition.z) * telescopeZoom;
    gl_Position = projectionMatrix * mvPosition;
}