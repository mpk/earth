/**
 *	Insert header to output files
 */
'use strict';

let fs = require('fs');
let pkg = require('../package');

const Project = [
	`${pkg.name} ${pkg.version}`,
	`(c) ${(new Date()).getFullYear()} mpk ~ https://github.com/mpk`
];

const Files = {
	'build/build.js': [
		'bem-class-names - https://github.com/mpk/bem-class-names',
		'bezier-easing - https://github.com/gre/bezier-easing',
		'emitter - https://github.com/component/emitter',
		'math - https://github.com/mpk/math',
		'moment - https://github.com/moment/moment',
		'polyglot.js - https://github.com/airbnb/polyglot.js',
		'react - https://github.com/facebook/react',
		'react-redux - https://github.com/rackt/react-redux',
		'redux - https://github.com/rackt/redux',
		'redux-actions - https://github.com/acdlite/redux-actions',
		'redux-thunk - https://github.com/gaearon/redux-thunk',
		'three.js - https://github.com/mrdoob/three.js'
	],
	'build/build.css': [
		'normalize.css - https://github.com/necolas/normalize.css'
	]
};

for (let path in Files) {
	let contents = fs.readFileSync(path, 'utf8');
	fs.writeFileSync(path, `/**\n *\t${Project.join('\n *\t')}\n *\n *\t${Files[path].join('\n *\t')}\n */\n${contents}`);
}