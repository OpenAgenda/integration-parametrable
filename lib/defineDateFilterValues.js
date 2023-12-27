const moment = require('moment-timezone');
moment.locale('fr');

module.exports =  function defineDateFilterValues({begin, end, timeZone}) {
	const tz = timeZone;
	let cursor = new Date(begin);
	let endDate = new Date(end);
	
	const result = [];

	let nextDate = cursor
				
	while (nextDate <= endDate) {
		result.push({
			lte: moment(nextDate).tz(timeZone).startOf('day').format(),
			gte: moment(nextDate).tz(timeZone).endOf('day').format(),
			labels: { 
				full: moment(nextDate).format('dddd DD MMM'),
				day: moment(nextDate).format('dddd'),
				dayNumber: moment(nextDate).format('DD') ,
				dayMonth: moment(nextDate).format('MMM'),
				dayYear: moment(nextDate).format('YYYY'),
			}
		});
		nextDate.setDate(nextDate.getDate() + 1)
	}
	return result;
}