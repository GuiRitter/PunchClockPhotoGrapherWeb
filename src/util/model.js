const moment = require('moment');

export const getDayOfWeekInitial = dateTime => {
	let day = moment(dateTime).day();
	switch (day) {
		case 0: return 'S';
		case 1: return 'M';
		case 2: return 'T';
		case 3: return 'W';
		case 4: return 'T';
		case 5: return 'F';
		case 6: return 'S';
		default: return null;
	}
}

export const matchesDay = dateTime => item => moment(dateTime).date() === item.number;

export const matchesWeek = week => item => week === item.week;