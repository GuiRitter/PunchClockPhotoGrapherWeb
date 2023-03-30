import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { buildCell, buildRow, buildTable } from '../util/html';
import { getLog } from '../util/log';

import { setHeight, setStreaming, showList } from '../flux/action/index';

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

function componentDidUpdate(props/*, prevProps*/, dispatch, videoField, canvasField, streaming, width) {
	if ((!videoField) || (!canvasField) || streaming) {
		return;
	}

	navigator.mediaDevices.getUserMedia({
		audio: false,
		video: { facingMode: { exact: 'environment' } }
	}).then(stream => {
		videoField.srcObject = stream;
		videoField.play();
	}).catch(error => {
		log('componentDidUpdate', { error });
		alert((error && error.toString) ? error.toString() : error);
	});

	videoField.addEventListener(
		'canplay',
		ev => {
			if (!streaming) {
				let height = (videoField.videoHeight / videoField.videoWidth) * width;
				dispatch(setHeight(height));

				videoField.setAttribute('width', width);
				videoField.setAttribute('height', height);
				canvasField.setAttribute('width', width);
				canvasField.setAttribute('height', height);
				dispatch(setStreaming(true));
			}
		},
		false
	);
}

function Photo(props) {

	const didMountRef = useRef(false);
	const dispatch = useDispatch();

	const streaming = useSelector(state => ((state || {}).reducer || {}).streaming || false);
	const width = useSelector(state => ((state || {}).reducer || {}).width || null);

	log('Photo');

	const [videoField, setVideoField] = useState(null);
	const [canvasField, setCanvasField] = useState(null);

	useEffect(() => {
		if (didMountRef.current) {
			componentDidUpdate(props/*, prevProps*/, dispatch, videoField, canvasField, streaming, width);
		} else {
			didMountRef.current = true;
			// componentDidMount(props, dispatch);
		}
	});

	return <>{buildTable(
		{ key: 'table' },
		buildRow(
			'video',
			buildCell(
				'video',
				<video
					id='video'
					ref={ref => { if (ref && (ref !== videoField)) { setVideoField(ref); } }}
				>Video stream not available.</video>
			)
		),
		buildRow(
			'photo',
			buildCell(
				'photo',
				<input
					id='startbutton'
					onClick={() => alert('TO DO')}
					type='button'
					value='Take photo'
				/>
			)
		),
		buildRow(
			'back',
			buildCell(
				'back',
				<input
					onClick={() => dispatch(showList())}
					type='button'
					value='Back'
				/>
			)
		)
	)}<canvas
		id='canvas'
		ref={ref => { if (ref && (ref !== canvasField)) { setCanvasField(ref); } }}
	> </canvas></>;
}

export default Photo;
