// const log = require('@openagenda/agenda-portal/lib/Log')('server');

import '@openagenda/agenda-portal/utils/loadEnvironment.js';
import Portal from '@openagenda/agenda-portal';

// Set options as a parameter, environment variable, or rc file.

import extractDate from './lib/extractDate.js';
import defineDateFilterValues from './lib/defineDateFilterValues.js';
import fetchEvents from './lib/fetchEvents.js';
import isFirstPage from './lib/isFirstPage.js';
import hasActiveFilter from './lib/hasActiveFilter.js';
import getTotalLabel from './lib/getTotalLabel.js';
import formatAdditionalFields from './lib/formatAdditionalFields.js';
import formatFields from './lib/formatFields.js';
import flattenLabel from './lib/flattenLabel.js';

function optionToLabel(options, id, lang) {
  const foundOption = options.find(v => v.id === id);
  if (foundOption) {
    return flattenLabel(foundOption.label, lang);
  }
}

function formatBoolean(value) {
  if (typeof value === 'boolean') {
    return value ? 'Oui' : 'Non';
  }
  return value;
}

function extractLabelFromArray(inputEvent, key) {
  let value = inputEvent;

  if (!key || typeof key !== 'string') {
    return null;
  }

  const keys = key.split('.');

  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = value[k];
    } else {
      return null;
    }
  }

  if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object' && value[0].hasOwnProperty('label')) {
    const labelValue = value[0].label;
    return typeof labelValue === 'object' ? Object.values(labelValue)[0] : labelValue;
  }
  
  return value;
}


const keyMoreLabel = process.env.STYLES_LIST_KEY_MORE_LABEL?.split(',');
const keyMoreSlug = process.env.STYLES_LIST_KEY_MORE?.split(',');

function eventHook(inputEvent, { agenda, lang, styles }) {

  inputEvent.fullImage = (inputEvent.image?.variants ?? []).find(v => v.type === 'full')?.filename;

  inputEvent.additionalFields = formatAdditionalFields(agenda.schema, inputEvent, {
    lang,
    additionalFieldSelection: process.env.CONFIG_SELECTED_ADDITIONAL_FIELD?.split(','),
    hideEmptyFields: process.env.CONFIG_HIDE_EMPTY_ADDITIONAL_FIELD === '1',
  });

  inputEvent.fields = formatFields(agenda.schema, inputEvent, {
    lang,
    fieldSelection: process.env.CONFIG_SELECTED_FIELD?.split(','),
  });

  agenda.linkPastEvents = process.env.PORTAL_FORCE_PASSED_DISPLAY === '1' ? false : true;

  const currentEvents = agenda.summary.publishedEvents.current;
  const upcomingEvents = agenda.summary.publishedEvents.upcomingEvents;
  if (currentEvents === 0 && upcomingEvents === 0) {
    agenda.noEvents = "Tous les événements sont passés"
  }

  if (inputEvent.age.min === null && inputEvent.age.max === null) {
    inputEvent.age = false;
  }

  if (process.env.CONFIG_DEFAULT_IMAGE) {
    inputEvent.defaultImage = process.env.CONFIG_DEFAULT_IMAGE
  }

  inputEvent.registration = !inputEvent.registration
    ? inputEvent.registration
    : inputEvent.registration.reduce((group, obj) => {
      const type = obj.type
      if(group[type] == null) group[type] = []
      group[type].push(obj)
      return group
    }, {})

  inputEvent.linkWithoutContext = inputEvent.link.split('?').shift();

  const res = agenda.schema.fields.filter(f => !!f.options).reduce((event, field) => {
    if (event[field.field] === undefined) {
      return event;
    }

    return Object.assign(event, {
      [field.field]: [].concat(event[field.field])
        .map(id => field.options.find(o => o.id === id))
    });
  }, inputEvent);

  Object.assign(res, extractDate(res))

  if (inputEvent.location) {
    if (inputEvent.location.name) {
      inputEvent.location.fullAddress = inputEvent.location.name;
      if (inputEvent.location.address) {
        inputEvent.location.fullAddress += ", " + inputEvent.location.address;
      }
    } else if (inputEvent.location.address) {
        inputEvent.location.fullAddress = inputEvent.location.address;
    } else if (inputEvent.location.city) {
        inputEvent.location.fullAddress = inputEvent.location.city;
    } else {
        inputEvent.location.fullAddress = [];
    }
  }
  
  if (process.env.CONFIG_EVENT_DEFAULT_REGISTRATION) {
    const defaultRegistration = process.env.CONFIG_EVENT_DEFAULT_REGISTRATION.split(',');

    inputEvent.registration.default = {
      label: defaultRegistration[0],
      value: defaultRegistration[1]
    };
  }

  const keyCategory = process.env.STYLES_LIST_KEY_CATEGORY;

  inputEvent.extractCategory = [].concat(inputEvent[keyCategory])
    .filter(v => !!v)
    .map(({ label }) => flattenLabel(label, lang))
    .shift();

  const keyLocation = process.env.STYLES_LIST_KEY_LOCATION;
  inputEvent.extractLocation = extractLabelFromArray(inputEvent, keyLocation);

  if(inputEvent.extractLocation){
    const keyLocationLabel = process.env.STYLES_LIST_KEY_LOCATION_LABEL;
    inputEvent.extractLocationLabel = inputEvent[keyLocationLabel] ? keyLocationLabel + ' : ' : 'Lieu :';
  } 
  
  inputEvent.more = keyMoreLabel?.map((label, index,) => {
    const slugData = inputEvent[keyMoreSlug[index]];
    if (Array.isArray(slugData)) {
        return {
            label,
            slug: slugData.map(value => value.label[lang]),
        };
    } else {
        return {
            label,
            slug: slugData,
        };
    }
  });

  if (process.env.STYLES_TYPE_LIST === 'line') {
    styles.listDisplay.lineType = true;
  }

  return res;
}

const titles = process.env.STYLES_ADDITIONAL_TITLE_FILTER?.split(',');
const slugs = process.env.STYLES_ADDITIONAL_SLUG_FILTER?.split(',');
const imgs = process.env.STYLES_ADDITIONAL_IMG_FILTER?.split(',');
const sorts = process.env.STYLES_ADDITIONAL_SORT_FILTER?.split(',');
const aggSizes = process.env.STYLES_ADDITIONAL_AGG_SIZE_FILTER?.split(',');
const pageSizes = process.env.STYLES_ADDITIONAL_PAGE_SIZE_FILTER?.split(',');
const searchMinSizes = process.env.STYLES_ADDITIONAL_SEARCH_MIN_SIZE_FILTER?.split(',');

const additionalFilters = titles?.map((title, index) => ({
  title,
  slug: slugs[index],
  img: imgs[index],
  sort: sorts?.[index],
  aggSize: (aggSizes?.[index] ?? '')?.length ? parseInt(aggSizes[index], 10) : undefined,
  pageSize: (pageSizes?.[index] ?? '')?.length ? parseInt(pageSizes[index], 10) : undefined,
  searchMinSize: (searchMinSizes?.[index] ?? '')?.length ? parseInt(searchMinSizes[index], 10) : undefined,
  aggType: {
    department: 'departments',
    city: 'cities',
    region: 'regions',
    locationUid: 'locations',
    adminLevel3: 'adminLevels3',
  }[slugs[index]] ?? 'additionalFields',
}));

const lang = process.env.PORTAL_LANG ?? 'fr';

const displayFeaturedSection = (process.env.CONFIG_FEATURED_SECTION ?? '0') !== '0';

const mapCoordinates = process.env.CONFIG_MAP_COORDINATES ? process.env.CONFIG_MAP_COORDINATES.split(',').map(parseFloat) : 0;


Portal({
  dir: import.meta.dirname,
  styles: {
    externeCssLink: process.env.EXTERNE_CSS_LINK,
    bgColor: process.env.STYLES_BG_COLOR || 'white',
    primaryColor: process.env.STYLES_PRIMARY_COLOR,
    secondaryColor: process.env.STYLES_SECONDARY_COLOR,
    bannerColor: process.env.STYLES_COLOR_BANNER,
    footerColor: process.env.STYLES_FOOTER_COLOR,
    noMargin: process.env.STYLES_NO_MARGIN,
    noShadows: process.env.STYLES_NO_SHADOWS,
    featuredBGColor: process.env.STYLES_FEATURED_BG_COLOR,
    featuredColor: process.env.STYLES_FEATURED_COLOR,
    periodFilterSizeBtn: process.env.STYLES_PERIOD_FILTER_SIZE_BTN,
    useSrcSetImages: process.env.STYLES_USE_SRCSET_IMG !== '0',

    banner: {
      displayBanner: process.env.STYLES_DISPLAY_BANNER,
      displayDarkerBanner: process.env.STYLES_DARKER_BANNER,
      imgBanner: process.env.STYLES_IMG_BANNER,
      logoBanner: process.env.STYLES_LOGO_BANNER,
    },
    filter: {
      additionalFilters,
      displayAdditionalFilter: process.env.STYLES_DISPLAY_ADDITIONAL_FILTER,
      additionalTitle: process.env.STYLES_ADDITIONAL_TITLE_FILTER,
      additionalLabel: process.env.STYLES_ADDITIONAL_LABEL_FILTER,
      displayCalendar: process.env.STYLES_DISPLAY_CALENDAR_FILTER,
      displayCalendarDefineRange: process.env.STYLES_DISPLAY_CALENDAR_DEFINE_RANGE,
      displayCity: process.env.STYLES_DISPLAY_CITY_FILTER,
      displayAttendanceMode: process.env.STYLES_DISPLAY_ATTENDANCEMODE_FILTER,
      displayKeywords: process.env.STYLES_DISPLAY_KEYWORDS_FILTER,
      displaySearch: process.env.STYLES_DISPLAY_SEARCH_FILTER,
      displayOnlySearch: process.env.STYLES_DISPLAY_ONLY_SEARCH_FILTER,
      displayMap: process.env.STYLES_DISPLAY_MAP_FILTER,
      mapHeight: process.env.STYLES_MAP_FILTER_HEIGHT ?? '220px',
      displayYoungAudienceFilter: process.env.STYLES_DISPLAY_YOUNG_AUDIENCE_FILTER,
    },
    noButton : {
      contribute: process.env.STYLES_NO_CONTRIBUTE_BUTTON,
      export: process.env.STYLES_NO_EXPORT_BUTTON,
    },
    listDisplay: {
      typeList: process.env.STYLES_TYPE_LIST,
    },
    list : {
      boldTitleFont: process.env.STYLES_BOLD_TITLE_FONT,
      displayDescription: process.env.STYLES_DISPLAY_LIST_DESCRIPTION,
      defineLocation: process.env.STYLES_DEFINE_LIST_LOCATION,
      displayAge: process.env.STYLES_DISPLAY_LIST_AGE,
      locationKey: process.env.STYLES_LIST_LOCATION,
      displayCategory: process.env.STYLES_DISPLAY_LIST_CATEGORY,
      categoryBGColor: process.env.STYLES_LIST_CATEGORY_BG_COLOR,
      categoryColor: process.env.STYLES_LIST_CATEGORY_COLOR,
      displayMore: process.env.STYLES_DISPLAY_LIST_MORE,
      itemImageHeight: process.env.STYLES_LIST_ITEM_IMAGE_HEIGHT ?? '170px',
      categoryTopPos: `${parseInt(process.env.STYLES_LIST_ITEM_IMAGE_HEIGHT ?? '142', 10) - 28}px`
    },
    event: {
      displayInfos: process.env.STYLES_DISPLAY_RIGHT_EVENT_INFOS,
    },
    footer: {
      displayFooter: process.env.STYLES_DISPLAY_FOOTER,
      onlyLogo: process.env.STYLES_LOGO_FOOTER && !process.env.STYLES_TEXT_LINK_PRINCIPAL && !process.env.STYLES_DISPLAY_LINK_FACEBOOK && !process.env.STYLES_DISPLAY_LINK_TWITTER && !process.env.STYLES_DISPLAY_LINK_INSTAGRAM && !process.env.STYLES_DISPLAY_LINK_YOUTUBE,
      logoFooter: process.env.STYLES_LOGO_FOOTER,
      linkPrincipal: process.env.STYLES_LINK_PRINCIPAL,
      textPrincipal: process.env.STYLES_TEXT_LINK_PRINCIPAL,
      displayLinkFacebook: process.env.STYLES_DISPLAY_LINK_FACEBOOK,
      displayLinkTwitter: process.env.STYLES_DISPLAY_LINK_TWITTER,
      displayLinkInstagram: process.env.STYLES_DISPLAY_LINK_INSTAGRAM,
      displayLinkYoutube: process.env.STYLES_DISPLAY_LINK_YOUTUBE,
      linkFacebook: process.env.STYLES_LINK_FACEBOOK,
      linkTwitter: process.env.STYLES_LINK_TWITTER,
      linkInstagram: process.env.STYLES_LINK_INSTAGRAM,
      linkYoutube: process.env.STYLES_LINK_YOUTUBE,
      linkOa: process.env.STYLES_DISPLAY_LINK_OA,
    },
    preview: {
      displayListBtn: process.env.STYLES_DISPLAY_LIST_BTN,
      linkListBtn: process.env.STYLES_LINK_LIST_BTN,
    }
  },
  config: {
    additionalFields: {
      displayAdditionalFieldsEvent: process.env.CONFIG_DISPLAY_ADDITIONAL_FIELDS_EVENT,
    },
    fields: {
      displayFieldsEvent: process.env.CONFIG_DISPLAY_FIELDS_EVENT,
    },
    displayPeriodFilter: process.env.CONFIG_DISPLAY_PERIOD_FILTER,
    defaultImage: process.env.CONFIG_DEFAULT_IMAGE,
    displayDate: process.env.CONFIG_DISPLAY_DATE,
    featured : {
      featuredSection: displayFeaturedSection,
    },
    total : {
      label: process.env.CONFIG_TOTAL_LABEL ? JSON.parse(process.env.CONFIG_TOTAL_LABEL) : undefined,
      labelPlural: process.env.CONFIG_TOTAL_LABEL_PLURAL ? JSON.parse(process.env.CONFIG_TOTAL_LABEL_PLURAL) : undefined,
    },
    contribute: {
      label: process.env.CONFIG_CONTRIBUTE_LABEL
    },
    backToList: {
      label: process.env.CONFIG_BACK_TO_LIST_LABEL
    },
    extraButton: {
      buttonLabel: process.env.CONFIG_EXTRA_BUTTON_LABEL,
      buttonLink: process.env.CONFIG_EXTRA_BUTTON_LINK
    },
    agendaNoIndex : process.env.CONFIG_AGENDA_NO_INDEX,
    event: process.env.CONFIG_EVENT_DEFAULT_REGISTRATION
  },
  root: process.env.PORTAL_ROOT || `http://localhost:${process.env.PORTAL_PORT}`,
  devServerPort: process.env.PORTAL_DEV_SERVER_PORT || 3001,
  // agenda uid
  uid: process.env.PORTAL_AGENDA_UID,
  // site language
  lang,
  // default timezone
  defaultTimezone: process.env.PORTAL_DEFAULT_TIMEZONE || 'Europe/Paris',
  // associated OA account key
  key: process.env.PORTAL_KEY,
  // views folder
  views: process.env.PORTAL_VIEWS_FOLDER,
  // main sass file
  sass: process.env.PORTAL_SASS_PATH,
  // main js file
  js: process.env.PORTAL_JS_PATH,
  // assets folder
  assets: process.env.PORTAL_ASSETS_FOLDER,
  // multilingual labels folder
  i18n: process.env.PORTAL_I18N_PATH,
  // number of events to be loaded in an event index page
  eventsPerPage: parseInt(process.env.PORTAL_EVENTS_PER_PAGE ?? '20', 10),
  // visibility of past events when relative or timings filter is specified
  visibilityPastEvents : process.env.PORTAL_VISIBILITY_PAST_EVENTS,
  // filters that applies even if other filter is specified, can be overloaded
  preFilter: {
    relative: process.env.PORTAL_PREFILTER?.split(','),
  },
  // filter that applies when no other filter is specified
  defaultFilter: {
    ...(displayFeaturedSection ? { featured: 0 } : {}),
    ...(mapCoordinates ? { geo: {
        northEast: {
          lat: mapCoordinates[0],
          lng: mapCoordinates[1]
        },
        southWest: {
          lat: mapCoordinates[2],
          lng: mapCoordinates[3]
        }
      }} : {})
  },
  // true if portal is to be displayed within iframe
  iframable: process.env.PORTAL_IFRAMABLE,
  iframeParent: process.env.PORTAL_IFRAME_PARENT_URL,
  cache: {
    // interval at which cache is refreshed ( in milliseconds )
    refreshInterval: 60 * 60 * 1000,
  },
  // map tiles
  map: {
    tiles: {
      link: process.env.MAP_TILES_URL || 'https://img.openagenda.com/u/osm/{s}/{z}/{x}/{y}',
      attribution:
      process.env.MAP_TILES_ATTRIBUTION || 'Map data © OpenStreetMap contributors'
    },
    auto: true,
    /* center: {
      latitude: 43.597198,
      longitude: 1.441136
    }, */
    zoom: 20,
    path: process.env.MAP_MARKER_ICON_PATH || 'https://cdn.openagenda.com/static/markerIcon.png',
  },
  tracking: {
    useAgendaGoogleAnalytics: process.env.PORTAL_USE_AGENDA_GA_ID ?? false,
    // url of the link displayed in the cookie consent banner
    cookieBannerLink: 'https://support.google.com/analytics/answer/6004245?hl=fr'
  },
  dateFilterValues: defineDateFilterValues({
    begin: process.env.CONFIG_DATE_PERIOD_FILTER_BEGIN,
    end: process.env.CONFIG_DATE_PERIOD_FILTER_END,
    timeZone: 'Europe/Paris',
    lang,
  }),
  middlewareHooks: {
    list: {
      preRender: [
        (req, res, next) => {
          if (!displayFeaturedSection) {
            return next();
          }
          fetchEvents({
            filter: {
              featured: 1,
              relative: ['current', 'upcoming'],
            },
            namespaces: {
              events: 'featuredEvents',
              has: 'hasFeaturedEvents',
            },
          })(req, res, next);
        },
        isFirstPage,
        hasActiveFilter,
        getTotalLabel,
      ],
    },
  },
  eventHook,
  proxyHookBeforeGet: params => {
    return {
      ...params,
      ...process.env.PORTAL_FORCE_PASSED_DISPLAY === '1' ? { relative: ['passed', 'upcoming', 'current'] } : {},
      sort: process.env.OPTION_SORT ?? 'lastTimingWithFeatured.asc',
    };
  }
}).then(({ app }) => app.launch(process.env.PORTAL_PORT));
