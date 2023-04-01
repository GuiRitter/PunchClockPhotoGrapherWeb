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
		props.dateTimeList.map(dateTime => buildCell(
			dateTime,
			moment(dateTime).format('HH:mm'),
			{ className: 'punch_time' }
		))
	);

	return props.dayOfWeek;
}

export default DayOfWeek;
