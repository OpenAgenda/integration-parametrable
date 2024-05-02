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

function getRegistrationValue(data, type) {
  const registrationEntry = data.registration.find(entry => entry.type === type);
  return {
    value: registrationEntry ? registrationEntry.value : undefined,
    formatted: registrationEntry ? registrationEntry.formatted : undefined
  };
}

module.exports = function formatFields(schema, data, options = {}) {
  const {
    lang = 'fr',
    fieldSelection,
  } = options;
  
  const fields = schema.fields
  .filter(f => (f.schemaType === 'event') && (!fieldSelection || fieldSelection.includes(f.field)))
  .map(field => ({
    field,
    value: data[field.field],
  }))
  .map(({ field, value }) => { 
      return {
        conditions: field.field === 'conditions',
        age:field.field === 'age',
        field,
        value,
        formatted: formatValue(field, value, options),
      }
    })
  .filter(({ value }) => value !== undefined);
  if (fieldSelection.includes('dateRange')) {
    fields.push(
      {
        dateRange: true,
        field: "dateRange",
        value: data.dateRange,
        formatted: flattenLabel(data.dateRange, lang),
      }
    )
  }
  if (fieldSelection.includes('location')) {
    fields.push(
      {
        location: true,
        field: "location",
        value: data.location,
        formatted: data.location,
      }
    )
  }
  if (fieldSelection.includes('registration')) {
    const emailInfo = getRegistrationValue(data, 'email');
    const phoneInfo = getRegistrationValue(data, 'phone');
    const linkInfo = getRegistrationValue(data, 'link');
    fields.push(
      {
        email: true,
        field: "email",
        value: emailInfo.value,
        formatted: emailInfo.value
      },
      {
        phone: true,
        field: "phone",
        value: phoneInfo.value,
        formatted: phoneInfo.value
      },
      {
        link: true,
        field: "link",
        value: linkInfo.value,
        formatted: linkInfo.value
      }
    )
  }
  return fields;
}

