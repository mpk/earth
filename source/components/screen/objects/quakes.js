/**
 *	Earthquakes groups
 */
import { readFileSync } from 'fs';
import math from 'math';
import THREE from 'three';
import QuakesGroup from './quakes-group';
import options from '../../../options';

class Quakes {

	/**
	 *	@param {THREE.Scene} scene
	 */
	constructor( scene ) {
		// Create shared material
		let baseMaterial = this.createMaterial();

		// Each integer magnitude has separate mesh
		this.quakeGroups = options.quakeGroups.map(( group, index ) => {
			let groupMaterial = baseMaterial.clone();
			groupMaterial.uniforms.pointColor.value = new THREE.Color(parseInt(group.color.substr(1, 6), 16));

			return new QuakesGroup(scene, MaxInstances / (8 ** index), groupMaterial);
		});

		// Selected quakes has separate mesh
		let groupMaterial = baseMaterial.clone();
		groupMaterial.uniforms.pointColor.value = new THREE.Color(parseInt(options.selectedQuakeColor.substr(1, 6), 16));

		this.selectedQuakesGroup = new QuakesGroup(scene, MaxInstancesSelected, groupMaterial);
	}

	/**
	 *	Update visible quakes.
	 *
	 *	@param {PointListSlice} pointList
	 */
	update( pointList ) {
		this.quakeGroups.forEach(( group ) => group.reset());

		// Assign quakes to groups
		pointList.forEach(( quake ) => {
			let groupIndex = quake.magnitudeFloor - options.quakeGroups[0].magnitude;
			this.quakeGroups[groupIndex].add(quake);
		});

		this.quakeGroups.forEach(( group ) => group.update());
	}

	/**
	 *	Update selected quakes.
	 *
	 *	@param {Array.<Point>} points
	 */
	updateSelected( points ) {
		this.selectedQuakesGroup.reset();

		points.forEach(( quake ) => this.selectedQuakesGroup.add(quake));

		this.selectedQuakesGroup.update();
	}

	/**
	 *	Update animation frame time.
	 *
	 *	@param {number} frameTime
	 */
	updateFrameTime( frameTime ) {
		this.quakeGroups.forEach(( group ) => {
			group.mesh.material.transparent = !!frameTime;
			group.mesh.material.uniforms.frameTime.value = frameTime / 1000;
		});
	}

	/**
	 *	Scale the geometries with the specified factor.
	 *
	 *	@param {number} scaleFactor
	 */
	setScaleFactor( scaleFactor ) {
		this.quakeGroups.forEach(( group, index ) => {
			let magnitudeScaleFactor = math.mapLinearClamp(index, 0, 5, 1, 2);
			group.setScaleFactor(scaleFactor * magnitudeScaleFactor);
		});

		this.selectedQuakesGroup.setScaleFactor(scaleFactor);
	}

	/**
	 *	@private
	 *	@return {THREE.Material}
	 */
	createMaterial() {
		return new THREE.RawShaderMaterial({
			uniforms: {
				pointColor: { type: 'c', value: null },
				scaleFactor: { type: 'f', value: 1 },
				frameTime: { type: 'f', value: 0 }
			},
			depthTest: false,
			depthWrite: false,
			vertexShader: readFileSync('source/components/screen/shaders/quakes-vertex.glsl', 'utf8'),
			fragmentShader: readFileSync('source/components/screen/shaders/quakes-fragment.glsl', 'utf8')
		});
	}

}

const MaxInstances = 131072;
const MaxInstancesSelected = 4096;

export default Quakes;