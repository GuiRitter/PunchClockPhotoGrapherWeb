import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { buildCell, buildRow, buildTable, getOffset } from '../util/html';
import { getLog } from '../util/log';

import { put, setHeight, setStreaming, showList } from '../flux/action/index';

const moment = require('moment');

const log = getLog('Photo.');

function componentDidUpdate(props/*, prevProps*/, dispatch, videoField, canvasField, viewFinderField, previewField, streaming, width) {
	if ((!videoField) || (!canvasField) || (!viewFinderField) || (!previewField) || streaming) {
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

				const difference = Math.max(width, height) - Math.min(width, height);
				const size = difference / 2;
				const offSet = getOffset(videoField);

				document.querySelector(':root').style.setProperty('--view-finder-width', `${width}px`);
				document.querySelector(':root').style.setProperty('--view-finder-height', `${height}px`);
				document.querySelector(':root').style.setProperty('--view-finder-top', `${offSet.top}px`);
				document.querySelector(':root').style.setProperty('--view-finder-left', `${offSet.left}px`);
				document.querySelector(':root').style.setProperty(
					'--view-finder-box-shadow',
					(height > width)
						? `inset 0 ${size}px #00000080, inset 0 -${size}px #00000080`
						: `inset ${size}px 0 #00000080, inset -${size}px 0 #00000080`
				);

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
	const height = useSelector(state => ((state || {}).reducer || {}).height || null);

	log('Photo', { streaming, width, height });

	const [videoField, setVideoField] = useState(null);
	const [canvasField, setCanvasField] = useState(null);
	const [viewFinderField, setViewFinderField] = useState(null);
	const [previewField, setPreviewField] = useState(null);

	useEffect(() => {
		if (didMountRef.current) {
			componentDidUpdate(props/*, prevProps*/, dispatch, videoField, canvasField, viewFinderField, previewField, streaming, width);
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
			'take preview',
			buildCell(
				'take preview',
				<input
					onClick={() => {
						const context = canvasField.getContext('2d');
						if (width && height) {
							canvasField.width = width;
							canvasField.height = height;
							context.drawImage(videoField, 0, 0, width, height);
							const dataURI = canvasField.toDataURL('image/png');
							previewField.setAttribute('src', dataURI);
						}
					}}
					type='button'
					value='Take photo'
				/>
			)
		),
		buildRow(
			'preview',
			buildCell(
				'preview',
				<img
					id='photo'
					alt='The screen capture will appear in this box.'
					ref={ref => { if (ref && (ref !== previewField)) { setPreviewField(ref); } }}
				/>
			)
		),
		buildRow(
			'photo',
			buildCell(
				'photo',
				<input
					onClick={() => {
						const context = canvasField.getContext('2d');
						if (width && height) {
							const dataURI = previewField.getAttribute('src');
							dispatch(put(moment().format(), dataURI));
						}
					}}
					type='button'
					value='Save photo'
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
	> </canvas><div
		id='view_finder'
		ref={ref => { if (ref && (ref !== viewFinderField)) { setViewFinderField(ref); } }}
	></div></>;
}

export default Photo;
