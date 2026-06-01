varying vec3 vColor;
varying float vHasRing;

void main() {
    vec2 uv =
        gl_PointCoord * 2.0 - 1.0;

    float d =
        length(uv);

    if (d > 1.0) {
        discard;
    }

    float core =
        smoothstep(
            0.4,
            0.0,
            d
        );

    float halo =
        pow(
            max(
                0.0,
                1.0 - d
            ),
            2.0
        );

    vec3 finalColor =
        vColor;

    float alpha =
        core +
        halo * 0.25;

    if (vHasRing > 0.5) {

        float ring =
            smoothstep(
                0.08,
                0.0,
                abs(d - 0.65)
            );

        finalColor +=
            vColor *
            ring *
            0.8;

        alpha +=
            ring *
            0.6;
    }

    gl_FragColor =
        vec4(
            finalColor,
            alpha
        );
}