'use strict';

module.exports =  function (req, res, next){
  req.data.totalLabel = req.app.locals.config.total.totalLabel[res.locals.lang];
  req.data.totalLabelPlural = req.app.locals.config.total.totalLabelPlural[res.locals.lang];
  next();
}