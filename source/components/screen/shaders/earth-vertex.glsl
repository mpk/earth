varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
	vUv = uv;
	vNormal = normalize(normalMatrix * normal);

	vec4 worldPosition = modelViewMatrix * vec4(position, 1.0);
	vWorldPosition = worldPosition.xyz;

	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}