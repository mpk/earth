/**
 *	Earthquake group mesh
 */
import THREE from 'three';

class QuakesGroup {

	/**
	 *	@param {THREE.Scene} scene
	 *	@param {number} maxInstances
	 *	@param {THREE.Material} material
	 */
	constructor( scene, maxInstances, material ) {
		this.mesh = new THREE.Mesh(this.createGeometry(maxInstances), material);
		this.mesh.frustumCulled = false;

		scene.add(this.mesh);

		this.offsetAttr = this.mesh.geometry.getAttribute('offset');
		this.quakeCount = 0;
	}

	/**
	 *	Reset this group.
	 */
	reset() {
		this.quakeCount = 0;
	}

	/**
	 *	Add quake to this group.
	 *
	 *	@param {Quake} quake
	 */
	add( quake ) {
		this.offsetAttr.array[this.quakeCount * 3] = quake.rotation.x;
		this.offsetAttr.array[this.quakeCount * 3 + 1] = quake.rotation.y;
		this.offsetAttr.array[this.quakeCount * 3 + 2] = quake.time / 1000;

		this.quakeCount += 1;
	}

	/**
	 *	Update the buffers.
	 */
	update() {
		this.offsetAttr.needsUpdate = true;
		this.mesh.geometry.maxInstancedCount = this.quakeCount;
	}

	/**
	 *	Scale the geometry with the specified factor.
	 *
	 *	@param {number} scaleFactor
	 */
	setScaleFactor( scaleFactor ) {
		this.mesh.material.uniforms.scaleFactor.value = scaleFactor;
	}

	/**
	 *	Create instanced geometry (circles).
	 *
	 *	@private
	 *	@param {number} maxInstances
	 *	@return {THREE.Geometry}
	 */
	createGeometry( maxInstances ) {
		let geometry = new THREE.InstancedBufferGeometry();

		let positionAttr = new THREE.BufferAttribute(new Float32Array(Segments * 3 * 3), 3);
		let thetaLength = (Math.PI * 2) / Segments;

		for (let i = 0; i < Segments; i += 1) {
			positionAttr.setXYZ(i * 3, 0, Elevation, 0);
			positionAttr.setXYZ(i * 3 + 1, Math.sin((i + 1) * thetaLength) * Radius, Elevation, -Math.cos((i + 1) * thetaLength) * Radius);
			positionAttr.setXYZ(i * 3 + 2, Math.sin(i * thetaLength) * Radius, Elevation, -Math.cos(i * thetaLength) * Radius);
		}

		geometry.addAttribute('position', positionAttr);

		let offsetAttr = new THREE.InstancedBufferAttribute(new Float32Array(maxInstances * 3), 3, 1);
		offsetAttr.setDynamic(true);

		geometry.addAttribute('offset', offsetAttr);
		geometry.maxInstancedCount = 0;

		return geometry;
	}

}

const Segments = 6;
const Radius = 0.00075;
const Elevation = 1;

export default QuakesGroup;