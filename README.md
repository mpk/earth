# earth

Visualization of earthquakes from 2010 to 2016.

![Screenshot](https://dl.dropboxusercontent.com/u/841468/external/earth-screenshot.png)

## Technology

The visualization uses ES6, [Three.js](https://github.com/mrdoob/three.js) (WebGL), [React](http://facebook.github.io/react/) and [Redux](https://github.com/rackt/redux).

## Building

In order to run the visualization on a local web server, it is necessary to run the build step:

- Install [node.js](https://nodejs.org/) (at least version 5.0).

- In the project root folder, create a folder named `build` and run:
```bash
npm install

npm run development # Development version
npm run release # Production (minified) version
```

### Tests

In the project root folder, run:
```bash
npm test
```
Open `localhost:9876` (Karma test runner) in a browser and see the results in the console.

## License

MIT

Earthquakes data: [USGS](http://earthquake.usgs.gov/)

Earth texture: [NASA Visible Earth](http://visibleearth.nasa.gov/)

Stars texture: [NASA Scientific Visualization Studio](https://svs.gsfc.nasa.gov/)