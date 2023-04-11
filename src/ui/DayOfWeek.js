import React/*, { useState }*/ from 'react';

import { buildCell, buildRow } from '../util/html';

const moment = require('moment');

function DayOfWeek(props) {

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
					onClick={() => alert('TO DO')}
					type='button'
					value='×'
				/>,
				{ className: 'punch_time_×' }
			)
		])
	);

	return props.dayOfWeek;
}

export default DayOfWeek;
