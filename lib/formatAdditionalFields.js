'use strict';

const flattenLabel = require('./flattenLabel');

function formatValue(field, value, options) {
  const {
    lang,
  } = options;
  if (field.options) {
    return field.options
      .filter(o => [].concat(value).includes(o.id))
      .map(o => flattenLabel(o.label, lang));
  }

  return value;
}

module.exports = function formatAdditionalFields(schema, data, options = {}) {
  const {
    lang = 'fr',
    selection,
  } = options;
  return schema.fields
    .filter(f => (f.schemaType !== 'event') && (!selection || selection.includes(f.field)))
    .map(field => ({
      field,
      value: data[field.field],
    }))
    .map(({ field, value }) => ({
        label: flattenLabel(field.label, lang),
        formatAsLink: field.fieldType === 'link',
        formatAsFile: !!value?.filename,
        field,
        value,
        formatted: formatValue(field, value, options),
    }))
    .filter(({ value }) => value !== undefined);
}