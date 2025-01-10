import moment from 'moment-timezone';

export default function defineDateFilterValues({begin, end, timeZone, lang }) {
	moment.locale(lang);
	const endDate = new Date(end);
	let cursor = new Date(begin);
	
	const result = [];

	let nextDate = cursor
				
	while (nextDate <= endDate) {
		result.push({
			lte: moment(nextDate).tz(timeZone).startOf('day').format(),
			gte: moment(nextDate).tz(timeZone).endOf('day').format(),
			labels: { 
				full: moment(nextDate).format('dddd D MMMM'),
				day: moment(nextDate).format('dddd'),
				dayNumber: moment(nextDate).format('D') ,
				dayMonth: moment(nextDate).format('MMMM'),
				dayYear: moment(nextDate).format('YYYY'),
			}
		});
		nextDate.setDate(nextDate.getDate() + 1)
	}
	return result;
}