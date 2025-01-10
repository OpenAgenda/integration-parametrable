import { getFallbackedMessages, getLocaleValue } from '@openagenda/intl';
import labels from '../i18n/index.js';

const fallbackedLabels = getFallbackedMessages(labels);

export default function (req, res, next) {
  req.data.totalLabel = req.app.locals.config.total.label
    ? getLocaleValue(req.app.locals.config.total.label, res.locals.lang)
    : fallbackedLabels[res.locals.lang].totalLabel;
  req.data.totalLabelPlural = req.app.locals.config.total.labelPlural
    ? getLocaleValue(req.app.locals.config.total.labelPlural, res.locals.lang)
    : fallbackedLabels[res.locals.lang].totalLabelPlural;
  next();
}
