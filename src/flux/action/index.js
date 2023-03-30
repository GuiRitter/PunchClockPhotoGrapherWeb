import * as state from '../../constant/state';
import { API_URL } from '../../constant/system';

import * as type from '../type';

import * as axios from './axios';

const moment = require('moment');

// const doesNothing = ({
// 	type: type.NO_OP
// });

export const restoreFromLocalStorage = () => ({
	type: type.RESTORE_FROM_LOCAL_STORAGE
});

const setState = state => ({
	type: type.NAVIGATION,
	state
});

export const setHeight = height => ({
	type: type.SET_HEIGHT,
	height
});

export const setStreaming = streaming => ({
	type: type.SET_STREAMING,
	streaming
});

export const showList = () => dispatch => {
	dispatch(setState(state.LIST));
	dispatch({
		type: type.RESET_MEDIA
	});
};

export const showPhoto = () => setState(state.PHOTO);

export const signIn = (login, password) => dispatch => {
	dispatch(axios.post(
		`${API_URL}/user/sign_in`,
		{ login, password },
		null,
		value => {
			if (!value) {
				alert('log in failed');
				return;
			}
			let data = value.data;
			if (!data) {
				alert('log in failed');
				return;
			}
			data = data.data;
			if (!data) {
				alert('log in failed');
				return;
			}
			let token = data.token;
			if (!token) {
				alert('log in failed');
				return;
			}
			dispatch({
				type: type.AUTHENTICATION,
				token
			})
		},
		null
	));
};

export const signOut = () => ({
	type: type.AUTHENTICATION,
	token: null
});
