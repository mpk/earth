varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
	vec3 cameraToVertex = normalize(vWorldPosition);
	float glowIntensity = pow(abs(dot(cameraToVertex, vNormal)), 2.5) * 24.0;

	gl_FragColor = vec4(0.6, 0.75, 1.0, glowIntensity);
}