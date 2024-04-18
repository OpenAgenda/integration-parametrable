'use strict';

const labels = require('../i18n/index');

module.exports =  function (req, res, next) {
  req.data.totalLabel = req.app.locals.config.total.label ? req.app.locals.config.total.label[res.locals.lang] : labels[res.locals.lang].totalLabel;
  req.data.totalLabelPlural = req.app.locals.config.total.labelPlural ? req.app.locals.config.total.labelPlural[res.locals.lang] : labels[res.locals.lang].totalLabelPlural;
  next();
}