import * as state from '../../constant/state';
import { API_URL } from '../../constant/system';

import * as type from '../type';

import * as axios from './axios';

// import { getLog } from '../../util/log';

// const log = getLog('flux.action.index.');

// const doesNothing = ({
// 	type: type.NO_OP
// });

export const compose = week => dispatch => {
	dispatch(axios.get(
		`${API_URL}/week/compose?week=${week}`,
		null,
		response => setTimeout(() => document.getElementById('out_put').src = `data:image/png;base64,${response.data}`, 1000),
		null
	));
};

export const deletePhoto = dateTime => dispatch => {
	if (window.confirm(`confirm delete photo ${dateTime}?`)) {
		dispatch(axios.del(
			`${API_URL}/photo/${encodeURIComponent(dateTime)}`,
			null,
			response => dispatch(getList()),
			null
		));
	}
};

export const getList = () => dispatch => {
	dispatch(axios.get(
		`${API_URL}/photo/list`,
		null,
		value => dispatch({
			type: type.GET_DATA,
			data: value.data
		}),
		null
	));
};

export const put = (dateTime, dataURI, videoField) => dispatch => {
	dispatch(axios.post(
		`${API_URL}/photo/put`,
		{ dateTime, dataURI },
		null,
		null,
		error => alert(error ? (error.message || error.cause || (error.toString ? error.toString() : JSON.stringify(error))) : 'Unknown error'),
		() => dispatch(showList(videoField))
	));
};

export const restoreFromLocalStorage = () => ({
	type: type.RESTORE_FROM_LOCAL_STORAGE
});

export const setSizes = (height, videoWidth, videoHeight, sx, sy) => ({
	type: type.SET_SIZES,
	height,
	videoWidth,
	videoHeight,
	sx,
	sy
});

const setState = state => ({
	type: type.NAVIGATION,
	state
});

export const setStreaming = streaming => ({
	type: type.SET_STREAMING,
	streaming
});

export const showList = videoField => dispatch => {
	if (videoField && videoField.srcObject && videoField.srcObject.getTracks) {
		videoField.srcObject.getTracks().forEach(track => {
			if (track.readyState === 'live') {
				track.stop();
			}
		});
	}
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
