import React/*, { useState }*/ from 'react';
import { useDispatch } from 'react-redux';

import { buildCell, buildRow } from '../util/html';
import { deletePhoto } from '../flux/action';

const moment = require('moment');

function DayOfWeek(props) {

	const dispatch = useDispatch();

	return buildRow(
		props.number,
		buildCell(
			'header',
			props.dayOfWeek,
			{ className: 'punch_time' }
		),
		props.dateTimeList.flatMap(dateTime => [
			buildCell(
				dateTime,
				moment(dateTime).format('HH:mm'),
				{ className: 'punch_time' }
			),
			buildCell(
				dateTime + '_×',
				<input
					onClick={() => dispatch(deletePhoto(dateTime))}
					type='button'
					value='×'
				/>,
				{ className: 'punch_time_×' }
			)
		])
	);
}

export default DayOfWeek;
