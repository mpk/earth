/**
 *	Point on Earth
 */
import math from 'math';
import THREE from 'three';
import GeoPoint from '../utils/geo-point';

class Point {

	/**
	 *	@param {{ id: string, time: number, coords: { lat: number, lon: number } }} point
	 */
	constructor( point ) {
		this.id = point.id;
		this.time = point.time;

		this.coords = GeoPoint.fromObject(point.coords);
		this.position = this.toCartesian(this.coords);

		// Precalculate position on Earth for better performance
		this.rotation = new THREE.Vector2(
			math.mapLinear(this.coords.lat, 90, -90, 0, Math.PI),
			math.mapLinear(this.coords.lon, -180, 180, -Math.PI, Math.PI)
		);
	}

	/**
	 *	Calculate Cartesian coordinates for geo point.
	 *	Assumes Earth has unit radius, +X axis is Asia, +Y axis is north pole, +Z axis is Africa.
	 *
	 *	@private
	 *	@param {GeoPoint} coords
	 *	@return {THREE.Vector3}
	 */
	toCartesian( coords ) {
		return new THREE.Vector3(
			Math.cos(math.toRadians(coords.lat)) * Math.sin(math.toRadians(coords.lon)),
			Math.sin(math.toRadians(coords.lat)),
			Math.cos(math.toRadians(coords.lat)) * Math.cos(math.toRadians(coords.lon))
		);
	}

}

export default Point;