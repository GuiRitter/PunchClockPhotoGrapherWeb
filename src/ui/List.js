import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { buildCell, buildRow, buildTable } from '../util/html';
import { getLog } from '../util/log';
import { matchesWeek } from '../util/model';

import { getList, showPhoto, signOut } from '../flux/action/index';

import Week from './Week';

const log = getLog('List.');

function List(props) {

	const dispatch = useDispatch();

	const list = useSelector(state => ((state || {}).reducer || {}).data || []);

	log('List');

	const [outPutField, setOutPutField] = useState(null);

	const weekList = list.reduce((previousList, currentRow) => {
		let item = previousList.find(matchesWeek(currentRow.week));
		if (!item) {
			item = {
				week: currentRow.week,
				dateTimeList: []
			};
			previousList = previousList.concat(item);
		}
		item.dateTimeList = item.dateTimeList.concat(currentRow.date_time);
		return previousList;
	}, []).map(item => <Week
		key={item.week}
		{...item}
	/>);

	return <><img
		id='out_put'
		alt='The composite of the photos will appear in this box.'
		ref={ref => { if (ref && (ref !== outPutField)) { setOutPutField(ref); } }}
	/>{weekList}{buildTable(
		{ key: 'menu_table' },
		buildRow(
			'refresh',
			buildCell(
				'refresh',
				<input
					onClick={() => dispatch(getList())}
					type='button'
					value='Refresh'
				/>
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
	)}</>;
}

export default List;
