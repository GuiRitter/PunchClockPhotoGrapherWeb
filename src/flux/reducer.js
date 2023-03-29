import * as type from './type';

import { LOCAL_STORAGE_NAME } from '../constant/system';
import * as state from '../constant/state';

import { getLog } from '../util/log';
import { updateLocalStorage } from '../util/persistence';

const moment = require('moment');

const log = getLog('flux.reducer.');

const initialState =
{
	abortMethod: null,
	data: [],
	isLoading: false,
	state: state.LIST,
	token: null
};

const reducer = (currentState = initialState, action) => {
	log('reducer', { currentState, action });

	let nextState = Object.assign({}, currentState);

	if ((!nextState.token) && (!nextState.workOffline)) {
		nextState.data = null;
	}

	switch (action.type) {

		case type.ABORT_REQUEST:
			return updateLocalStorage({
				...nextState,
				abortController: null,
				isLoading: false,
			});

		case type.AUTHENTICATION:
			return updateLocalStorage({
				...nextState,
				token: action.token
			});

		case type.ENABLE_ABORT_REQUEST:
			return updateLocalStorage({
				...nextState,
				abortMethod: nextState.isLoading ? action.abortMethod : null
			});

		case type.GET_DATA:
			return updateLocalStorage({
				...nextState,
				data: action.data
			});

		case type.LOADING:
			return updateLocalStorage({
				...nextState,
				abortController: action.isLoading ? nextState.abortController : null,
				isLoading: action.isLoading
			});

		case type.NAVIGATION:
			return updateLocalStorage({
				...nextState,
				state: action.state
			});

		case type.RESTORE_FROM_LOCAL_STORAGE:
			return JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME)) || initialState;

		default: return nextState;
	}
};

export default reducer;
