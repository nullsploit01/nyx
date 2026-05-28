uniform float phase;
uniform vec3 moonColor;
uniform float tilt;

float random(vec2 st) {
    return fract(
        sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123
    );
}

float circle(vec2 uv, vec2 pos, float radius) {
    return smoothstep(radius, radius - 0.12, distance(uv, pos));
}

void main() {

    vec2 uv = gl_PointCoord * 2.0 - 1.0;
    
    float s = sin(tilt);
    float c = cos(tilt);
    uv = mat2(c, -s, s,  c) * uv;

    float r = dot(uv, uv);

    // outside moon circle
    if (r > 1.0) discard;

    // sphere normal
    vec3 normal = normalize(vec3(uv, pow(1.0 - r, 0.2)));

    // light direction
    float phaseRad = radians(phase);

    vec3 lightDir = normalize(vec3(-cos(phaseRad), 0.0, 0.25));

    // diffuse lighting
    float illumination = (1.0 - cos(phaseRad)) * 0.5;

    float curve =   sqrt(max(0.0, 1.0 - uv.y * uv.y)) * abs(sin(phaseRad)) * 0.12;

    float terminator =
        uv.x -
        curve +
        (illumination * 2.0 - 1.0);

    float diffuse = smoothstep(-0.16, 0.16, terminator);
    float sphereShade = pow(normal.z, 0.7) * 0.35 + 0.65;
    diffuse *= sphereShade;

    float ambient = 0.02;
    diffuse = max(diffuse, ambient);

    // subtle rim glow
    float edge = 1.0 - smoothstep(0.85, 1.0, sqrt(r));

    // only glow on lit side
    float glow = edge * pow(diffuse, 2.0) * 0.03;
    vec3 baseColor = mix(vec3(0.58), moonColor, 0.42);

    float halo = 1.0 - smoothstep(0.6, 2.5, length(uv));
    halo *= pow(diffuse, 0.7) * 0.18;
    halo *= smoothstep(-0.2, 0.8, dot(normal, lightDir));
    
    // noise
    float noise1 = random(floor(uv * 25.0));
    float noise2 = random(floor(uv * 8.0));

    float noise = mix(
        noise1,
        noise2,
        0.3
    );

    vec2 mariaUv = uv;
    mariaUv.x += (noise - 0.5) * 0.12;
    mariaUv.y += (noise - 0.5) * 0.08;

    float maria = 0.0;
    maria += circle(mariaUv, vec2(-0.28, 0.18), 0.28);
    maria += circle(mariaUv, vec2(-0.05, 0.02), 0.18);
    maria += circle(mariaUv, vec2(0.12, -0.22), 0.2);
    maria += circle(mariaUv, vec2(0.25, 0.18), 0.14);
    maria += circle(mariaUv, vec2(-0.18, -0.12), 0.09);
    maria += circle(mariaUv, vec2(0.05, 0.26), 0.07);
    maria += circle(mariaUv, vec2(0.32, -0.08), 0.06);
    maria += circle(mariaUv, vec2(-0.36, 0.04), 0.05);
    maria += circle(mariaUv, vec2(0.0, 0.0), 0.42) * 0.18;
    maria *= 0.85 + noise * 0.3;
    maria = clamp(maria, 0.0, 0.8);

    float edgeFade = smoothstep(1.0, 0.3, sqrt(r));
    maria *= edgeFade;

    baseColor *= 1.0 - maria * 1.0;
    baseColor *= 1.0 + noise * diffuse * 0.03;

    vec3 color = baseColor * diffuse + vec3(1.0) * glow;
    vec3 finalColor = color + vec3(1.0) * halo;
    float alpha = max(diffuse, halo);

    gl_FragColor = vec4(finalColor, alpha);
}