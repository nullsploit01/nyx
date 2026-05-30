uniform float time;
uniform vec3 glowColor;

void main() {
    vec2 uv = gl_PointCoord * 2.0 - 1.0;
    float d = length(uv);

    if (d > 1.0) {
        discard;
    }

    float halo =
        pow(
            max(0.0, 1.0 - d),
            2.0
        );

    float ring =
        smoothstep(
            0.06,
            0.0,
            abs(d - 0.7)
        );

    float pulse =
        1.0 +
        sin(time * 3.0) * 0.25;

    float alpha =
        halo * 0.15 +
        ring * pulse * 0.4;

    alpha = min(alpha, 1.0);

    if (alpha < 0.01) {
        discard;
    }

    vec3 finalColor =
        mix(
            glowColor,
            vec3(1.0),
            ring
        );

    gl_FragColor =
        vec4(
            finalColor,
            alpha
        );
}