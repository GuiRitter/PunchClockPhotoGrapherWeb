import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { buildCell, buildRow, buildTable, getOffset } from '../util/html';
import { getLog } from '../util/log';

import { put, setHeight, setStreaming, showList } from '../flux/action/index';

const moment = require('moment');

const log = getLog('Photo.');

function componentDidUpdate(props/*, prevProps*/, dispatch, videoField, canvasField, viewFinderField, previewField, yearField, monthField, dayField, hourField, minuteField, streaming, width) {
	if ((!videoField) || (!canvasField) || (!viewFinderField) || (!previewField) || (!yearField) || (!monthField) || (!dayField) || (!hourField) || (!minuteField) || streaming) {
		return;
	}

	if (!navigator.mediaDevices) {
		alert('Access to media devices disabled due to unsafe context.');
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
				const letterBox = difference / 2;
				const offSet = getOffset(videoField);
				const windowBox = Math.min(width, height) * 0.2;

				log('componentDidUpdate.canplay', {
					videoWidth: videoField.videoWidth,
					videoHeight: videoField.videoHeight,
					width,
					height,
					letterBox,
					windowBox,
					offSet
				});

				document.querySelector(':root').style.setProperty('--view-finder-width', `${width}px`);
				document.querySelector(':root').style.setProperty('--view-finder-height', `${height}px`);
				document.querySelector(':root').style.setProperty('--view-finder-top', `${offSet.top}px`);
				document.querySelector(':root').style.setProperty('--view-finder-left', `${offSet.left}px`);
				document.querySelector(':root').style.setProperty(
					'--view-finder-box-shadow',
					(height > width)
						? `inset ${windowBox}px ${letterBox + windowBox}px #00000080, inset -${windowBox}px -${letterBox + windowBox}px #00000080`
						: `inset ${letterBox + windowBox}px ${windowBox}px #00000080, inset -${letterBox + windowBox}px -${windowBox}px #00000080`
				);

				videoField.setAttribute('width', width);
				videoField.setAttribute('height', height);
				canvasField.setAttribute('width', width);
				canvasField.setAttribute('height', height);
				dispatch(setStreaming(true));

				const now = moment();
				yearField.value = now.format('YYYY');
				monthField.value = now.format('MM');
				dayField.value = now.format('DD');
				hourField.value = now.format('HH');
				minuteField.value = now.format('mm');
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
	const [yearField, setYearField] = useState(null);
	const [monthField, setMonthField] = useState(null);
	const [dayField, setDayField] = useState(null);
	const [hourField, setHourField] = useState(null);
	const [minuteField, setMinuteField] = useState(null);

	useEffect(() => {
		if (didMountRef.current) {
			componentDidUpdate(props/*, prevProps*/, dispatch, videoField, canvasField, viewFinderField, previewField, yearField, monthField, dayField, hourField, minuteField, streaming, width);
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
				>Video stream not available.</video>,
				{ colSpan: 9 }
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
				/>,
				{ colSpan: 9 }
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
				/>,
				{ colSpan: 9 }
			)
		),
		buildRow(
			'date and time',
			buildCell(
				'year',
				<input
					className='year_field'
					ref={ref => { if (ref && (ref !== yearField)) { setYearField(ref); } }}
				/>
			),
			buildCell('year month separator', '-'),
			buildCell(
				'month',
				<input
					className='month_field text_align_center'
					ref={ref => { if (ref && (ref !== monthField)) { setMonthField(ref); } }}
				/>
			),
			buildCell('month day separator', '-'),
			buildCell(
				'day',
				<input
					className='day_field text_align_center'
					ref={ref => { if (ref && (ref !== dayField)) { setDayField(ref); } }}
				/>
			),
			buildCell('day hour separator', 'T'),
			buildCell(
				'hour',
				<input
					className='hour_field text_align_center'
					ref={ref => { if (ref && (ref !== hourField)) { setHourField(ref); } }}
				/>
			),
			buildCell('hour minute separator', ':'),
			buildCell(
				'minute',
				<input
					className='minute_field text_align_center'
					ref={ref => { if (ref && (ref !== minuteField)) { setMinuteField(ref); } }}
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
							let dateTime = moment(yearField.value)
								.month(Number(monthField.value) - 1)
								.date(dayField.value)
								.hour(hourField.value)
								.minute(minuteField.value)
							// TODO crop out view finder before sending
							dispatch(put(dateTime.format(), dataURI));
						}
					}}
					type='button'
					value='Save photo'
				/>,
				{ colSpan: 9 }
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
				/>,
				{ colSpan: 9 }
			)
		)
	)}<canvas
		id='canvas'
		ref={ref => { if (ref && (ref !== canvasField)) { setCanvasField(ref); } }}
	></canvas><div
		id='view_finder'
		ref={ref => { if (ref && (ref !== viewFinderField)) { setViewFinderField(ref); } }}
	></div></>;
}

export default Photo;
