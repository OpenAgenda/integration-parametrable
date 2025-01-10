import moment from 'moment';
moment.locale('fr');

const fZ = n => (n > 9 ? '' : '0') + n;

const formatDate = date => ({
  day: fZ(date.getDate()),
  month: moment(date).format('MMMM')
});

export default event => {
  const firstTiming = new Date(event.timings?.[0].begin);
  const lastTiming = new Date(event.timings?.[event.timings?.length - 1].begin);

  const dayCount = Math.ceil((lastTiming.getTime() - firstTiming.getTime()) / 1000 / 60 / 60 / 24);
  
  return {
    uniqueDay: dayCount <= 1,
    firstDate: formatDate(firstTiming),
    lastDate: formatDate(lastTiming)
  };
}