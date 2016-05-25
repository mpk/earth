/**
 *	Bootstrap
 */
import React from 'react';
import ReactDOM from 'react-dom';
import * as reactRedux from 'react-redux';
import * as redux from 'redux';
import reduxThunk from 'redux-thunk';
import actions from './actions';
import utils from './utils';
import Container from './components/container';
import rootReducer from './reducers/root';
import { RendererError } from './components/screen/renderer';

document.addEventListener('DOMContentLoaded', () => {
	let createStore = redux.applyMiddleware(reduxThunk)(redux.createStore);
	let store = createStore(rootReducer);

	ReactDOM.render(
		<reactRedux.Provider store={store}>
			<Container />
		</reactRedux.Provider>,
		document.getElementById('render-container')
	);

	if (utils.hasWebGL()) {
		store.dispatch(actions.loadResources({
			earthTexture: 'static/textures/earth.jpg',
			starsTexture: 'static/textures/stars.jpg'
		}));
	} else {
		store.dispatch(actions.reportRendererError(RendererError.InitFailure));
	}
});