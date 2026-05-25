uniform float phase;
uniform vec3 moonColor;

float random(vec2 st) {
    return fract(
        sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123
    );
}

void main() {

    vec2 uv = gl_PointCoord * 2.0 - 1.0;
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

    vec3 color = baseColor * diffuse + vec3(1.0) * glow;
    
    // noise
    float noise1 = random(floor(uv * 25.0));
    float noise2 = random(floor(uv * 8.0));

    float noise = mix(
        noise1,
        noise2,
        0.3
    );

    color *= 1.0 + noise * diffuse * 0.03;
    gl_FragColor = vec4(color, 1.0);
}