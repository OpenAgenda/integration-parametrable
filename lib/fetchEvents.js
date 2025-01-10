export default ({ filter, namespaces }) =>
  (req, res, next) => {
    const transform = req.app.get('transforms').event.listItem;

    req.app
    .get('proxy')
    .list(req.app.locals.agenda.uid, filter)
    .then(
      ({ events }) => {
        req.data[namespaces.events] = events.map(e => transform(e, req, res));
        req.data[namespaces.has] = !!events.length;
        return next();
      },
      err => next()
    );
  };

