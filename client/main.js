import { Meteor } from 'meteor/meteor';
import React from 'react';
import { render } from 'react-dom';
import { Route, Switch } from 'react-router';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';	
import { Provider } from 'react-redux';
import { connectRouter, ConnectedRouter, routerMiddleware } from 'connected-react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import VUmcHeader from '../imports/ui/components/VUmcHeader.js';
import AppView from '../imports/views/AppView.js';
import LoginView from '../imports/views/LoginView.js';
import { loggerMiddleware } from '../imports/ui/redux/middleware.js';
import './main.html'; 
import '../config/at-config.js';

const browserHistory = createBrowserHistory();

// namespace state domains the same way as reducers
const initialState = { 
	loginState: { isLoggedIn: true },
	loginState: { isLoggedIn: !!Meteor.userId() },
	tableState: { selectedRow: null },
};

const store = createStore(
	connectRouter(browserHistory)(combineReducers({ 
		/* reducers go here, whether inline or imported */		
		loginState: (state = initialState, action) => {
			switch (action.type) {
				case 'USER_LOGIN':
					if (!state.isLoggedIn) { // not logged in, so we can do things with a login action
						return { isLoggedIn: true }; // we are happy to be logging in 
					} else {
						return state;
					}
				case 'USER_LOGOUT':
					if (state.isLoggedIn) { // logged in, so we can do things with a logout action
						return { isLoggedIn: false }; // so happy
					} else {
						return state;
					}
				default:
					return state;
			}
		},
		tableState: (state = initialState, action) => {
			switch (action.type) {
				case 'SELECT_ROW':
					return { selectedRow: action.payload.row };
				case 'DESELECT_ROW':
					return { selectedRow: null };
				default:
					return state;
			}
		},
	})),
	initialState,
	compose(
		applyMiddleware(
			routerMiddleware(browserHistory),
			Meteor.isDevelopment ? loggerMiddleware : store => next => action => { next(action); }
		)
	)
);

Meteor.startup(() => {
	render(renderRoutes(), document.getElementById('render-target'));
});

function renderRoutes() {
	return (
		<div className="container top-level">
			<VUmcHeader/>
			<Provider store={store}>
				<ConnectedRouter history={browserHistory}>
					<Switch>
						<Route exact path="/login" component={LoginView} />
						<Route exact path="/" component={AppView} />
					</Switch>
				</ConnectedRouter>
			</Provider>
		</div>
	);
}