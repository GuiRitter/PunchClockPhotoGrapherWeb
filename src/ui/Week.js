import React/*, { useState }*/ from 'react';

import { buildCell, buildRow, buildTable } from '../util/html';
import { compareForNumber, getDayOfWeekAbrv, matchesDay } from '../util/model';

import DayOfWeek from './DayOfWeek';

const moment = require('moment');

function padDate(date) {
	return (date + '').padStart(2, '0');
}

function getISO8601(dayList) {
	const monthList = dayList.reduce((previousList, currentDay) => {
		const month = padDate(currentDay.month);
		return previousList.concat(previousList.includes(month) ? [] : month);
	}, []);
	if (monthList.length === 1) {
		return `${monthList[0]}-${padDate(dayList[0].number)}/${padDate(dayList.slice(-1)[0].number)}`;
	} else {
		return `${monthList[0]}-${padDate(dayList[0].number)}/${monthList[1]}-${padDate(dayList.slice(-1)[0].number)}`;
	}
}

function Week(props) {

	const dayList = props.dateTimeList.reduce((previousList, currentDateTime) => {
		let item = previousList.find(matchesDay(currentDateTime));
		if (!item) {
			item = {
				number: moment(currentDateTime).date(),
				month: moment(currentDateTime).month(),
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
			buildCell('space', null),
			buildCell(
				'header',
				<input
					className='week_header_button'
					onClick={() => alert('TO DO')}
					type='button'
					value={getISO8601(dayList)}
				/>,
				{ colSpan: (2 * dateTimeCountMax) - 1 }
			),
			buildCell(
				'delete',
				<input
					onClick={() => alert('TO DO')}
					type='button'
					value='×'
				/>,
				{ className: 'punch_time_×' }
			)
		),
		dayList.map(item => <DayOfWeek
			key={item.number}
			{...item}
		/>)
	);
}

export default Week;
