/**
 *	Internationalization
 */
import Polyglot from 'node-polyglot';

const Phrases = {

	label: {
		coords: 'Coords',
		createdBy: 'Created by',
		dataSources: 'Data sources',
		depth: 'Depth',
		details: 'Details',
		earthquakeCount: '%{count} earthquake |||| %{count} earthquakes',
		filter: 'Filter',
		historicalEvents: 'Historical events',
		loadingData: 'Loading data...',
		magnitude: 'Magnitude',
		selectedCount: '%{count} selected',
		time: 'Time'
	},

	link: {
		detailsSite: 'Details on USGS site',
		historicalEvents: 'View historical events',
		startAnimation: 'Start animation',
		stopAnimation: 'Stop animation',
		view: 'View »'
	},

	text: {
		description: 'Earthquakes visualization 2010 - 2016',
		rendererCrash: 'An error occurred, please reload the page.',
		rendererInitFailure: 'Your browser does not support all necessary features to view this visualization.\nSee the developer console for technical details.',
		resourcesError: 'An error occurred during initialization, please try again later.\nSee the developer console for technical details.'
	}

};

let instance = new Polyglot({ phrases: Phrases });

export default instance.t.bind(instance);