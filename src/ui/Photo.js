import React/*, { useState }*/ from 'react';
import { useDispatch/*, useSelector*/ } from 'react-redux';

import { getLog } from '../util/log';

import { showList } from '../flux/action/index';

const log = getLog('Photo.');

// TODO https://developer.mozilla.org/en-US/docs/Web/API/Media_Capture_and_Streams_API/Taking_still_photos
function toDo() {
	navigator.mediaDevices.enumerateDevices().then(devices => {
		const backCamera = devices.find(device => device.label.includes('facing back'));
		navigator.mediaDevices.getUserMedia({ deviceId: backCamera.deviceId });
		// ...
	});
	// OR
	navigator.mediaDevices.getUserMedia({
		audio: false,
		video: { facingMode: { exact: 'environment' } }
	});
	// ...
}

function Photo(props) {

	const dispatch = useDispatch();

	log('Photo');

	return <input
		onClick={() => dispatch(showList())}
		type='button'
		value='back'
	/>;
}

export default Photo;
