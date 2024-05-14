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

function isEmpty(value) {
  if ([null, undefined].includes(value)) {
    return true;
  }

  if (typeof value === 'string' && value.length === 0) {
    return true;
  }

  return false;
}

module.exports = function formatAdditionalFields(schema, data, options = {}) {
  const {
    lang = 'fr',
    AdditionalFieldSelection,
    hideEmptyFields = false,
  } = options;
  return schema.fields
    .filter(f => (f.schemaType !== 'event') && (!AdditionalFieldSelection || AdditionalFieldSelection.includes(f.field)))
    .map(field => ({
      field,
      value: data[field.field],
    }))
    .map(({ field, value }) => ({
      display: hideEmptyFields ? !isEmpty(value) : true,
      label: flattenLabel(field.label, lang),
      formatAsLink: field.fieldType === 'link',
      formatAsFile: !!value?.filename,
      formatAsMarkdown: field.fieldType === 'markdown',
      field,
      value,
      formatted: formatValue(field, value, options),
    }))
    .filter(({ value }) => value !== undefined);
}