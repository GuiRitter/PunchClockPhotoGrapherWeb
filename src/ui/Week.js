import React/*, { useState }*/ from 'react';
import { useDispatch } from 'react-redux';

import { buildCell, buildRow, buildTable } from '../util/html';
import { getLog } from '../util/log';
import { compareForMonthAndNumber, getDayOfWeekAbrv, matchesDay } from '../util/model';

import { compose, deleteWeek } from '../flux/action/index';

import DayOfWeek from './DayOfWeek';

const moment = require('moment');

const log = getLog('Week.');

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

function getYear(dayList) {
	return moment(dayList.reduce((_, day) => day.dateTimeList, []).reduce((_, dateTime) => dateTime, '')).year();
}

function Week(props) {

	const dispatch = useDispatch();

	const dayList = props.dateTimeList.reduce((previousList, currentDateTime) => {
		let item = previousList.find(matchesDay(currentDateTime));
		if (!item) {
			item = {
				number: moment(currentDateTime).date(),
				month: moment(currentDateTime).month() + 1,
				dayOfWeek: getDayOfWeekAbrv(currentDateTime),
				dateTimeList: []
			};
			previousList = previousList.concat(item);
		}
		item.dateTimeList = item.dateTimeList.concat(currentDateTime).sort();
		return previousList;
	}, []).sort(compareForMonthAndNumber);

	const dateTimeCountMax = dayList.reduce((previousCount, currentItem) => Math.max(previousCount, currentItem.dateTimeList.length), 0);

	const iso8601 = getISO8601(dayList);

	const year = getYear(dayList);

	log('Week', { dateTimeList: props.dateTimeList, dayList, dateTimeCountMax, iso8601, year });

	return buildTable(
		{
			key: `week_${props.week}_table`,
			className: 'week_table'
		},
		buildRow(
			'header',
			buildCell(
				'space',
				<a
					id={`download_anchor_${props.week}`}
					download={`${year}-${iso8601.replace('/', '／')}.png`}
				>💾</a>,
				{ className: 'text_align_center' }
			),
			buildCell(
				'header',
				<input
					className='week_header_button'
					onClick={() => dispatch(compose(props.week))}
					type='button'
					value={iso8601}
				/>,
				{ colSpan: (2 * dateTimeCountMax) - 1 }
			),
			buildCell(
				'delete',
				<input
					onClick={() => dispatch(deleteWeek(props.week, iso8601))}
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
