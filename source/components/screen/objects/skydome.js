/**
 *	Stars skydome mesh
 */
import THREE from 'three';

class Skydome {

	/**
	 *	@param {THREE.Scene} scene
	 *	@param {object} resources
	 */
	constructor( scene, resources ) {
		this.mesh = new THREE.Mesh(this.createGeometry(), this.createMaterial(resources.starsTexture));

		scene.add(this.mesh);
	}

	/**
	 *	@private
	 *	@return {THREE.Geometry}
	 */
	createGeometry() {
		return new THREE.SphereBufferGeometry(Radius, 16, 16);
	}

	/**
	 *	@private
	 *	@param {THREE.Texture} starsTexture
	 *	@return {THREE.Material}
	 */
	createMaterial( starsTexture ) {
		return new THREE.MeshBasicMaterial({
			map: starsTexture,
			depthWrite: false,
			side: THREE.BackSide
		});
	}

}

const Radius = 4;

export default Skydome;