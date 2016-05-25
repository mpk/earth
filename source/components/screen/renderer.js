/**
 *	WebGL renderer
 */
import Emitter from 'component-emitter';
import math from 'math';
import THREE from 'three';
import Earth from './objects/earth';
import Quakes from './objects/quakes';
import Skydome from './objects/skydome';
import { PixelRatio } from '../../utils';

class Renderer {

	/**
	 *	@param {HTMLCanvasElement} canvas
	 *	@param {object} resources
	 */
	constructor( canvas, resources ) {
		THREE.Euler.DefaultOrder = 'YXZ';

		this.scene = new THREE.Scene();
		this.camera = new THREE.PerspectiveCamera(CameraFOV, 1, CameraNear, CameraFar);

		this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
		this.renderer.sortObjects = false;
		canvas.addEventListener('webglcontextlost', () => this.emit('crash'));

		this.objects = {};
		this.objects.earth = new Earth(this.scene, resources, { radius: EarthRadius });
		this.objects.skydome = new Skydome(this.scene, resources);
		this.objects.points = new Quakes(this.scene, resources);

		this.needsRender = true;

		this.handlePaint = this.handlePaint.bind(this);
		this.handlePaint();
	}

	/**
	 *	Update visible points.
	 *
	 *	@param {PointListSlice} pointList
	 */
	setPoints( pointList ) {
		this.objects.points.update(pointList);

		this.needsRender = true;
	}

	/**
	 *	Update selected points.
	 *
	 *	@param {Array.<Point>} points
	 */
	setSelectedPoints( points ) {
		this.objects.points.updateSelected(points);

		this.needsRender = true;
	}

	/**
	 *	Update animation frame time.
	 *
	 *	@param {number} frameTime
	 */
	setFrameTime( frameTime ) {
		this.objects.points.updateFrameTime(frameTime);

		this.needsRender = true;
	}

	/**
	 *	Update camera parameters.
	 *
	 *	@param {GeoPoint} cameraPosition
	 *	@param {number} cameraDistance
	 */
	setCamera( cameraPosition, cameraDistance ) {
		let cameraRotationX = -math.toRadians(cameraPosition.lat);
		let cameraRotationY = math.toRadians(cameraPosition.lon);

		this.camera.position.x = cameraDistance * Math.sin(cameraRotationY) * Math.cos(cameraRotationX);
		this.camera.position.y = cameraDistance * -Math.sin(cameraRotationX);
		this.camera.position.z = cameraDistance * Math.cos(cameraRotationY) * Math.cos(cameraRotationX);
		this.camera.rotation.x = cameraRotationX;
		this.camera.rotation.y = cameraRotationY;

		this.objects.points.setScaleFactor(this.getScale(cameraDistance));

		this.needsRender = true;
	}

	/**
	 *	Update renderer size.
	 *
	 *	@param {number} width
	 *	@param {number} height
	 */
	setSize( width, height ) {
		this.renderer.setPixelRatio(PixelRatio);
		this.renderer.setSize(width, height);

		this.camera.aspect = width / height;
		this.camera.updateProjectionMatrix();

		this.needsRender = true;
	}

	/**
	 *	Find position on Earth surface from the specified screen coordinates.
	 *	Returns null if the coordinates are outside Earth.
	 *
	 *	@param {number} screenX
	 *	@param {number} screenY
	 *	@return {?Vector3}
	 */
	getPosition( screenX, screenY ) {
		// Create ray
		tmpPosition.setFromMatrixPosition(this.camera.matrixWorld);
		tmpDirection.set(screenX, screenY, 0.5).unproject(this.camera).sub(tmpPosition).normalize();

		// Calculate intersection with Earth (sphere)
		let a = tmpDirection.lengthSq();
		let b = 2 * tmpPosition.dot(tmpDirection);
		let c = tmpPosition.lengthSq() - EarthRadius ** 2;

		let det = b ** 2 - 4 * a * c;
		if (det > 0) {
			let t = Math.min((-b - Math.sqrt(det)) / (2 * a), (-b + Math.sqrt(det)) / (2 * a));
			tmpIntersection.copy(tmpDirection).multiplyScalar(t).add(tmpPosition);

			return tmpIntersection;
		}

		return null;
	}

	/**
	 *	Calculate scale factor for fixed-size objects.
	 *
	 *	@param {number} cameraDistance
	 *	@return {number}
	 */
	getScale( cameraDistance ) {
		tmpCamera.position.z = cameraDistance;
		tmpCamera.updateMatrixWorld(true);
		let tmpSize = (new THREE.Vector3(1, 0, 1)).project(tmpCamera);

		return tmpSizeRef.x / tmpSize.x;
	}

	/**
	 *	@private
	 */
	handlePaint() {
		window.requestAnimationFrame(this.handlePaint);

		if (this.needsRender) {
			this.renderer.render(this.scene, this.camera);
			this.needsRender = false;
		}
	}

}

Emitter(Renderer.prototype);

const CameraFOV = 30;
const CameraNear = 0.1;
const CameraFar = 16;
const EarthRadius = 1;

// Variables for getPosition()
let tmpPosition = new THREE.Vector3();
let tmpDirection = new THREE.Vector3();
let tmpIntersection = new THREE.Vector3();

// Variables for getScale()
let tmpCamera = new THREE.PerspectiveCamera(CameraFOV, 1, CameraNear, CameraFar);
let tmpSizeRef = new THREE.Vector3(1, 0, 1);
tmpCamera.position.z = 1.5;
tmpCamera.updateMatrixWorld(true);
tmpSizeRef.project(tmpCamera);

export const RendererError = {
	InitFailure: 'InitFailure',
	Crash: 'Crash'
};

export default Renderer;