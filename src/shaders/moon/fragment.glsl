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
    vec3 lightDir = normalize(vec3(phase, 0.0, 0.12));

    // diffuse lighting
    float diffuse = max(dot(normal, lightDir), 0.0);  
    float sphereShade = normal.z * 0.15 + 0.85;
    diffuse *= sphereShade;

    float ambient = (1.0 - abs(phase)) * 0.02;
    diffuse = max(diffuse, ambient);

    // soften terminator
    diffuse = smoothstep(0.0, 0.07, diffuse);

    // subtle rim glow
    float edge = 1.0 - smoothstep(0.85, 1.0, sqrt(r));

    // only glow on lit side
    float glow = edge * pow(diffuse, 2.0) * 0.03;
    vec3 baseColor = mix(vec3(0.82), moonColor, 0.25);

    
    // noise
    float noise1 = random(floor(uv * 25.0));
    float noise2 = random(floor(uv * 8.0));

    float noise = mix(
        noise1,
        noise2,
        0.3
    );

    vec2 mariaUv = uv;
    mariaUv.x += (noise - 0.5) * 0.08;
    mariaUv.y += (noise - 0.5) * 0.05;

    float maria = 0.0;
    maria += circle(mariaUv, vec2(-0.28, 0.18), 0.28);
    maria += circle(mariaUv, vec2(-0.05, 0.02), 0.18);
    maria += circle(mariaUv, vec2(0.12, -0.22), 0.2);
    maria += circle(mariaUv, vec2(0.25, 0.18), 0.14);
    maria *= 0.85 + noise * 0.3;
    maria = clamp(maria, 0.0, 1.0);

    float edgeFade = smoothstep(1.0, 0.3, sqrt(r));
    maria *= edgeFade;

    baseColor *= 1.0 - maria * 0.08;
    baseColor *= 1.0 + noise * diffuse * 0.03;

    vec3 color = baseColor * diffuse + vec3(1.0) * glow;

    color *= 1.0 + noise * diffuse * 0.03;
    color *= 1.0 - maria * diffuse * 0.06;
    gl_FragColor = vec4(color, 1.0);
}