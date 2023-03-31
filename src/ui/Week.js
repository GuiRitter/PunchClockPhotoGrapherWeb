import React/*, { useState }*/ from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getLog } from '../util/log';
import { getDayOfWeekInitial, matchesDay } from '../util/model';

import { showPhoto, signOut } from '../flux/action/index';

const moment = require('moment');

const log = getLog('Week.');

function Week(props) {

	const dayList = props.dateTimeList.reduce((previousList, currentDateTime) => {
		let item = previousList.find(matchesDay(currentDateTime));
		if (!item) {
			item = {
				number: moment(dateTime).date(),
				dayOfWeek: getDayOfWeekInitial(dateTime),
				dateTimeList: []
			};
			previousList = previousList.concat(item);
		}
		item.dateTimeList = item.dateTimeList.concat(currentDateTime);
		return previousList;
	}, []).sort();

	log('Week');

	return buildTable(
		{ key: `week_${props.week}_table` },
		buildRow(
			'header',
			buildCell(
				'header',
				props.week,
				{ colSpan: dayList.length }
			)
		),
		buildRow(
			'photo',
			buildCell(
				'photo',
				<input
					onClick={() => dispatch(showPhoto())}
					type='button'
					value='Take photo'
				/>
			)
		),
		buildRow(
			'sign out',
			buildCell(
				'sign out',
				<input
					onClick={() => dispatch(signOut())}
					type='button'
					value='Sign out'
				/>
			)
		)
	);

	return <p>{props.week}</p>;
}

export default Week;
