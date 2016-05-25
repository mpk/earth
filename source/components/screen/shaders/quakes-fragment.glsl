precision highp float;

#define FALLOFF_TIME 8000000.0 // ~90 days

varying float quakeTime;

uniform vec3 pointColor;
uniform float frameTime;

void main() {
	float opacity = max(1.0 - (frameTime - quakeTime) / FALLOFF_TIME, 0.0) * max(min(frameTime - quakeTime, 1.0), 0.0);

	gl_FragColor = vec4(pointColor, opacity);
}