attribute float size;
attribute float hasRing;

varying vec3 vColor;
varying float vHasRing;

uniform float telescopeZoom;

void main() {
    vColor = color;
    vHasRing = hasRing;

    vec4 mvPosition =
        modelViewMatrix *
        vec4(position, 1.0);

    gl_Position =
        projectionMatrix *
        mvPosition;

    gl_PointSize =
        size * telescopeZoom *
        (300.0 / -mvPosition.z);
}