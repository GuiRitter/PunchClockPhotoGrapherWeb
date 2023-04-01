import React/*, { useState }*/ from 'react';

import { buildCell, buildRow, buildTable } from '../util/html';
import { compareForNumber, getDayOfWeekAbrv, matchesDay } from '../util/model';

import DayOfWeek from './DayOfWeek';

const moment = require('moment');

function Week(props) {

	const dayList = props.dateTimeList.reduce((previousList, currentDateTime) => {
		let item = previousList.find(matchesDay(currentDateTime));
		if (!item) {
			item = {
				number: moment(currentDateTime).date(),
				dayOfWeek: getDayOfWeekAbrv(currentDateTime),
				dateTimeList: []
			};
			previousList = previousList.concat(item);
		}
		item.dateTimeList = item.dateTimeList.concat(currentDateTime).sort();
		return previousList;
	}, []).sort(compareForNumber);

	const dateTimeCountMax = dayList.reduce((previousCount, currentItem) => Math.max(previousCount, currentItem.dateTimeList.length), 0);

	return buildTable(
		{
			key: `week_${props.week}_table`,
			className: 'week_table'
		},
		buildRow(
			'header',
			buildCell(
				'header',
				props.week,
				{ colSpan: dateTimeCountMax + 1 }
			)
		),
		dayList.map(item => <DayOfWeek
			key={item.number}
			{...item}
		/>)
	);
}

export default Week;
