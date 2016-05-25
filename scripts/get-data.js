/**
 *	Download and process data from USGS
 */
'use strict';

let fs = require('fs');
let got = require('got');
let moment = require('moment');
let zopfli = require('node-zopfli');

// Download per-quarter data
function getData( year, quarter ) {
	let date = moment.utc({ year, months: quarter * 3 });

	let startTime = date.clone().startOf('month').format('YYYY-MM-DD HH:mm:ss');
	let endTime = date.clone().add(2, 'month').endOf('month').format('YYYY-MM-DD HH:mm:ss');

	let path = `http://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startTime}&minmagnitude=4&endtime=${endTime}&orderby=time`;

	got(path).then(( response ) => {
		let data = JSON.parse(response.body);
		let earthquakes = data.features.map(( feature ) => {
			return {
				id: feature.id,
				time: feature.properties.time,
				coords: { lat: feature.geometry.coordinates[1], lon: feature.geometry.coordinates[0] },
				data: {
					magnitude: feature.properties.mag,
					place: feature.properties.place,
					depth: feature.geometry.coordinates[2]
				}
			};
		});

		let input = new Buffer(JSON.stringify(earthquakes));
		let result = zopfli.gzipSync(input, {});

		fs.writeFileSync(`${date.format('YYYY-MM')}.json.gz`, result);

		console.info(`[info] Saved data for Q${quarter + 1} ${year} (${earthquakes.length} entries).`);

		instance.next();
	}).catch(( error ) => {
		console.error(`[error] Cannot get data for Q${quarter + 1} ${year}.`);
		console.error(error);
	});
}

// Download data for year
function* saveData( year ) {
	yield getData(year, 0);
	yield getData(year, 1);
	yield getData(year, 2);
	yield getData(year, 3);
}

let instance = saveData(2015);
instance.next();