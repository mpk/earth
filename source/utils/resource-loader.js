/**
 *	Resource loader
 */
import THREE from 'three';

export default {

	/**
	 *	Load the specified resources.
	 *
	 *	@param {object} resources - Format { [name]: path, ... }
	 *	@return {Promise}
	 */
	load( resources ) {
		let resourceNames = Object.keys(resources);

		return Promise.all(resourceNames.map(( name ) => {
			// Assign resources to the loaders
			let path = resources[name];

			if (String.endsWith(path, '.png') || String.endsWith(path, '.jpg')) {
				return loadTexture(path);
			} else if (String.endsWith(path, '.json')) {
				return loadJSON(path);
			}
		})).then(( loadedResources ) => {
			// Gather loaded resources and return resource map
			let resourceMap = {};

			loadedResources.forEach(( resource, index ) => {
				resourceMap[resourceNames[index]] = resource;
			});

			return resourceMap;
		});
	}

};

/**
 *	Load texture.
 *
 *	@param {string} path
 *	@return {Promise}
 */
function loadTexture( path ) {
	let textureLoader = new THREE.TextureLoader();

	return new Promise(( resolve, reject ) => {
		textureLoader.load(path, resolve, null, () => {
			reject(`Cannot load resource: ${path}`);
		});
	});
}

/**
 *	Load and parse JSON file.
 *
 *	@param {string} path
 *	@return {Promise}
 */
function loadJSON( path ) {
	return new Promise(( resolve, reject ) => {
		let resource = new XMLHttpRequest();

		resource.addEventListener('loadend', () => {
			if (resource.status == 200) {
				let responseData;

				try {
					responseData = JSON.parse(resource.responseText);
				} catch ( ex ) {
					console.error('Cannot parse JSON.');
				}

				if (responseData) {
					resolve(responseData);
				} else {
					reject(`Cannot parse JSON resource: ${path}`);
				}
			} else {
				reject(`Cannot load resource: ${path}`);
			}
		});

		resource.open('GET', path, true);
		resource.send(null);
	});
}