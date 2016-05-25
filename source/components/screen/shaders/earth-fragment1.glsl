varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

uniform sampler2D tSurface;

void main() {
	vec3 surfaceColor = texture2D(tSurface, vUv + vec2(0.25, 0.0)).xyz;

	vec3 cameraToVertex = normalize(vWorldPosition);
	float glowColor = min(pow(abs(1.0 - dot(-cameraToVertex, vNormal)), 4.0), 0.75);

	gl_FragColor = vec4(surfaceColor + vec3(glowColor), 1.0);
}