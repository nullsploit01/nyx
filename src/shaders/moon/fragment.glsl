uniform float phase;
uniform vec3 moonColor;

void main() {

    vec2 uv = gl_PointCoord * 2.0 - 1.0;
    float r = dot(uv, uv);

    // outside moon circle
    if (r > 1.0) discard;

    // sphere normal
    vec3 normal = normalize(vec3(uv, sqrt(1.0 - r)));

    // light direction
    vec3 lightDir = normalize(vec3(phase, 0.0, 0.2));

    // diffuse lighting
    float diffuse = max(dot(normal, lightDir), 0.0);

    // soften terminator
    diffuse = smoothstep(0.0, 0.15, diffuse);

    // subtle rim glow
    float rim = 1.0 - smoothstep( 0.7, 1.0, sqrt(r));

    vec3 color = moonColor * (diffuse + rim * 0.08);
    gl_FragColor = vec4(color, 1.0);
}