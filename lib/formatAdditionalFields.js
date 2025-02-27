import flattenLabel from './flattenLabel.js';

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
  
  if (Array.isArray(value) && value.length === 0) {
    return true;
  }

  return false;
}

export default function formatAdditionalFields(schema, data, options = {}) {
  const {
    lang = 'fr',
    additionalFieldSelection,
    hideEmptyFields = false,
  } = options;

  return schema.fields
    .filter(f => (f.schemaType !== 'event') && (!additionalFieldSelection || additionalFieldSelection.includes(f.field)))
    .map(field => ({
      field,
      value: data[field.field],
    }))
    .map(({ field, value }) => ({
      display: hideEmptyFields ? !isEmpty(value) : true,
      label: flattenLabel(field.label, lang),
      formatAsLink: field.fieldType === 'link',
      formatAsImage: field.fieldType === 'image',
      formatAsFile: field.fieldType === 'file',
      formatAsMarkdown: field.fieldType === 'markdown',
      field,
      value,
      formatted: formatValue(field, value, options),
    }))
    .filter(({ value }) => value !== undefined);
}