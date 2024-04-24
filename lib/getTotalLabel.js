'use strict';

const { getFallbackedMessages, getLocaleValue } = require('@openagenda/intl');
const labels = require('../i18n/index');

const fallbackedLabels = getFallbackedMessages(labels);

module.exports =  function (req, res, next) {
  req.data.totalLabel = req.app.locals.config.total.label
    ? getLocaleValue(req.app.locals.config.total.label, res.locals.lang)
    : fallbackedLabels[res.locals.lang].totalLabel;
  req.data.totalLabelPlural = req.app.locals.config.total.labelPlural
    ? getLocaleValue(req.app.locals.config.total.labelPlural, res.locals.lang)
    : fallbackedLabels[res.locals.lang].totalLabelPlural;

  console.log(req.data.totalLabel, req.data.totalLabelPlural);

  next();
}
