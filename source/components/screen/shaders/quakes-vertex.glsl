precision highp float;

attribute vec3 position;
attribute vec3 offset;

varying float quakeTime;

uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;

uniform float scaleFactor;

void main() {
	float a = cos(offset.x);
	float b = sin(offset.x);
	float c = cos(offset.y);
	float d = sin(offset.y);
	float e = 1.0;
	float f = 0.0;

	float ce = c * e;
	float cf = c * f;
	float de = d * e;
	float df = d * f;

	mat4 mMatrix = mat4(
		ce + df * b, a * f, cf * b - de, 0.0,
		de * b - cf, a * e, df + ce * b, 0.0,
		a * d, -b, a * c, 0.0,
		0.0, 0.0, 0.0, 1.0);

	vec3 vPosition = position;
	vPosition.xz *= scaleFactor;

	quakeTime = offset.z;

	gl_Position = projectionMatrix * viewMatrix * mMatrix * vec4(vPosition, 1.0);
}