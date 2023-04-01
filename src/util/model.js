const moment = require('moment');

export const compareForNumber = (itemA, itemB) => (itemA.number < itemB.number) ? -1 : (itemA.number > itemB.number) ? 1 : 0;

export const getDayOfWeekAbrv = dateTime => {
	let day = moment(dateTime).day();
	switch (day) {
		case 0: return 'Sun';
		case 1: return 'Mon';
		case 2: return 'Tue';
		case 3: return 'Wed';
		case 4: return 'Thu';
		case 5: return 'Fri';
		case 6: return 'Sat';
		default: return null;
	}
}

export const matchesDay = dateTime => item => moment(dateTime).date() === item.number;

export const matchesWeek = week => item => week === item.week;