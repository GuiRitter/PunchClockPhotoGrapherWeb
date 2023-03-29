import axios from 'axios';

import * as type from '../type';
import * as httpMethod from '../../constant/httpMethod';
import { UNAUTHORIZED } from '../../constant/httpResponseStatusCode';
import { CANCELED_ERROR } from '../../constant/index';

import { signOut } from './index';

import { getLog } from '../../util/log';

const log = getLog('flux.action.axios.');

const axiosInstance = axios.create({ headers: { 'Access-Control-Allow-Origin': '*' } });

export const abortRequest = () => (dispatch, getState) => {
	log('abortRequest', { state: getState() });
	(getState().reducer.abortMethod || (() => {}))();
	dispatch({
		type: type.ABORT_REQUEST
	});
};

const getAxiosWithAbortController = (method, url, data, config, getState) => {
	log('getAxiosWithAbortController', { method, url, data, config });
	let abortController = new AbortController();
	let abortMethod = abortController.abort.bind(abortController);
	config = {
		signal: abortController.signal,
		...config
	};
	let token = getState().reducer.token;
	if (token) {
		config.headers = {
			...config.headers,
			token
		};
	}
	let result = {
		abortMethod
	};
	switch (method) {
		case httpMethod.GET:
			result.runAxios = () => axiosInstance.get(url, config);
			break;
		case httpMethod.POST:
			result.runAxios = () => axiosInstance.post(url, data, config);
			break;
		default:
			result.runAxios = () => axiosInstance.request({
				method,
				url,
				data,
				...config
			});
			break;
	}
	return result;
}

export const get = (url, config, thenFunction, catchFunction, finallyFunction) => (dispatch, getState) => {
	log('get', { url, config, then: !!thenFunction, catch: !!catchFunction, finally: !!finallyFunction });
	dispatch(requestAndShowLoading(getAxiosWithAbortController(httpMethod.GET, url, null, config, getState), thenFunction, catchFunction, finallyFunction));
};

const enableAbortRequest = abortMethod => {
	log('enableAbortRequest', { abortMethod: !!abortMethod });
	return ({
		type: type.ENABLE_ABORT_REQUEST,
		abortMethod
	});
};

export const post = (url, data, config, thenFunction, catchFunction, finallyFunction) => (dispatch, getState) => {
	log('post', { url, data, config, then: !!thenFunction, catch: !!catchFunction, finally: !!finallyFunction });
	dispatch(requestAndShowLoading(getAxiosWithAbortController(httpMethod.POST, url, data, config, getState), thenFunction, catchFunction, finallyFunction));
};

const request = (axiosAndController, thenFunction, catchFunction, finallyFunction) => (dispatch, getState) => {
	log('request', { axiosAndController: !!axiosAndController, then: !!thenFunction, catch: !!catchFunction, finally: !!finallyFunction });
	axiosAndController.runAxios()
		.then(thenFunction)
		.catch(reason => {
			if (reason && reason.response && (reason.response.status === UNAUTHORIZED)) {
				dispatch(signOut());
				alert(reason.response.data.error);
			} else if (reason && reason.response && reason.response.data && reason.response.data.error) {
				alert(reason.response.data.error);
			} else if (reason && (reason.code === CANCELED_ERROR)) {
				// do nothing
			} else if (reason) {
				alert(reason.message);
			} else {
				alert('unknown error');
			}
			if (catchFunction) {
				catchFunction(reason);
			}
		})
		.finally(() => {
			if (finallyFunction) {
				finallyFunction();
			}
			dispatch(showLoading(false))
		});
	dispatch(enableAbortRequest(axiosAndController.abortMethod));
};

const requestAndShowLoading = (axiosAndController, thenFunction, catchFunction, finallyFunction) => dispatch => {
	log('requestAndShowLoading', { axiosAndController: !!axiosAndController, then: !!thenFunction, catch: !!catchFunction, finally: !!finallyFunction });
	dispatch(showLoading(true));
	dispatch(request(axiosAndController, thenFunction, catchFunction, finallyFunction));
};

const showLoading = isLoading => {
	log('showLoading', { isLoading });
	return ({
		type: type.LOADING,
		isLoading
	});
};
