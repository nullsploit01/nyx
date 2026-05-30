uniform vec3 glowColor;

void main() {
    vec2 uv = gl_PointCoord * 2.0 - 1.0;
    float d = length(uv);

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

    vec3 color =
        vec3(0.8, 0.9, 1.0);

    float alpha =
        halo * 0.6 +
        ring * pulse * 2.0;

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