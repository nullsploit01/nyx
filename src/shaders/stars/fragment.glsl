varying vec3 vColor;

void main() {
    float d = distance(gl_PointCoord, vec2(0.5));
    float strength = 1.0 - smoothstep(0.0, 0.18, d);
    strength = pow(strength, 3.0);
    strength *= 0.6;
    gl_FragColor = vec4(vColor, strength);
    #include <colorspace_fragment>
}