import React/*, { useState }*/ from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { buildCell, buildRow } from '../util/html';
import { getLog } from '../util/log';
import { compareForNumber, getDayOfWeekAbrv, matchesDay } from '../util/model';

import { showPhoto, signOut } from '../flux/action/index';

const moment = require('moment');

function DayOfWeek(props) {

	return buildRow(
		props.number,
		props.dateTimeList.map(dateTime => buildCell(
			dateTime,
			moment(dateTime).format('HH:mm'),
			{ className: 'punch_time' }
		))
	);

	return props.dayOfWeek;
}

export default DayOfWeek;
