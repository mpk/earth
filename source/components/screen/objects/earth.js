/**
 *	Earth mesh
 */
import { readFileSync } from 'fs';
import THREE from 'three';

class Earth {

	/**
	 *	@param {THREE.Scene} scene
	 *	@param {object} resources
	 *	@param {object} options
	 *	@param {number} options.radius
	 */
	constructor( scene, resources, options ) {
		this.mesh1 = new THREE.Mesh(this.createGeometry(options.radius), this.createMaterial(resources.earthTexture));
		this.mesh2 = new THREE.Mesh(this.createGeometry(options.radius * 1.032), this.createAtmosphereMaterial());

		scene.add(this.mesh1);
		scene.add(this.mesh2);
	}

	/**
	 *	@private
	 *	@param {number} radius
	 *	@return {THREE.Geometry}
	 */
	createGeometry( radius ) {
		return new THREE.SphereBufferGeometry(radius, 64, 64);
	}

	/**
	 *	@private
	 *	@param {THREE.Texture} earthTexture
	 *	@return {THREE.Material}
	 */
	createMaterial( earthTexture ) {
		earthTexture.anisotropy = 4;
		earthTexture.wrapS = THREE.RepeatWrapping;

		return new THREE.ShaderMaterial({
			uniforms: {
				tSurface: { type: 't', value: earthTexture }
			},
			vertexShader: readFileSync('source/components/screen/shaders/earth-vertex.glsl', 'utf8'),
			fragmentShader: readFileSync('source/components/screen/shaders/earth-fragment1.glsl', 'utf8')
		});
	}

	/**
	 *	@private
	 *	@return {THREE.Material}
	 */
	createAtmosphereMaterial() {
		return new THREE.ShaderMaterial({
			uniforms: {},
			vertexShader: readFileSync('source/components/screen/shaders/earth-vertex.glsl', 'utf8'),
			fragmentShader: readFileSync('source/components/screen/shaders/earth-fragment2.glsl', 'utf8'),
			transparent: true,
			side: THREE.BackSide
		});
	}

}

export default Earth;