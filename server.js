'use strict';

// const log = require('@openagenda/agenda-portal/lib/Log')('server');

// Set options as a parameter, environment variable, or rc file.

const Portal = require('@openagenda/agenda-portal');
const extractDate = require('./lib/extractDate');

Portal.utils.loadEnvironment(__dirname);

function eventHook(inputEvent, { agenda }) {

  const currentEvents = agenda.summary.publishedEvents.current;
  const upcomingEvents = agenda.summary.publishedEvents.upcomingEvents;
  if (currentEvents === 0 && upcomingEvents === 0) {
    agenda.noEvents = "Tous les événements sont passés"
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

   
  const keyCategory = process.env.STYLES_LIST_KEY_CATEGORY
  if (inputEvent[keyCategory]) {
    inputEvent.extactCategory = inputEvent[keyCategory][0].label
  }

  const keyLocation= process.env.STYLES_LIST_KEY_LOCATION
  if (inputEvent[keyLocation]) {
    inputEvent.extactLocation = inputEvent[keyLocation]
  }

  const keyMore= process.env.STYLES_LIST_KEY_MORE
  if (inputEvent[keyMore]) {
    inputEvent.extactMore = inputEvent[keyMore]
  }

  return res;
}

const titles = process.env.STYLES_ADDITIONAL_TITLE_FILTER?.split(',')

const slugs = process.env.STYLES_ADDITIONAL_SLUG_FILTER?.split(',')

const imgs = process.env.STYLES_ADDITIONAL_IMG_FILTER?.split(',')

const additionalFilters = titles?.map((title, index) => ({title, slug: slugs[index], img:imgs[index]} ))

Portal({
  dir: __dirname,
  styles: {
    bgColor: process.env.STYLES_BG_COLOR || 'white',
    primaryColor: process.env.STYLES_PRIMARY_COLOR,
    secondaryColor: process.env.STYLES_SECONDARY_COLOR,
    bannerColor: process.env.STYLES_COLOR_BANNER,
    footerColor: process.env.STYLES_FOOTER_COLOR,
    noMargin: process.env.STYLES_NO_MARGIN,
    noShadows: process.env.STYLES_NO_SHADOWS,
    featuredBGColor: process.env.STYLES_FEATURED_BG_COLOR,
    featuredColor: process.env.STYLES_FEATURED_COLOR,

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
      displayCity: process.env.STYLES_DISPLAY_CITY_FILTER,
      displayAttendanceMode: process.env.STYLES_DISPLAY_ATTENDANCEMODE_FILTER,
      displayKeywords: process.env.STYLES_DISPLAY_KEYWORDS_FILTER,
      displaySearch: process.env.STYLES_DISPLAY_SEARCH_FILTER,
      displayOnlySearch: process.env.STYLES_DISPLAY_ONLY_SEARCH_FILTER,
      displayMap: process.env.STYLES_DISPLAY_MAP_FILTER,
      displayYoungAudienceFilter: process.env.STYLES_DISPLAY_YOUNG_AUDIENCE_FILTER,
    },
    noButton : {
      contribute: process.env.STYLES_NO_CONTRIBUTE_BUTTON,
      export: process.env.STYLES_NO_EXPORT_BUTTON,
    },
    list : {
      displayDescription: process.env.STYLES_DISPLAY_LIST_DESCRIPTION,
      defineLocation: process.env.STYLES_DEFINE_LIST_LOCATION,
      locationKey: process.env.STYLES_LIST_LOCATION,
      displayCategory: process.env.STYLES_DISPLAY_LIST_CATEGORY,
      categoryBGColor: process.env.STYLES_LIST_CATEGORY_BG_COLOR,
      categoryColor: process.env.STYLES_LIST_CATEGORY_COLOR,
      more: process.env.STYLES_DISPLAY_LIST_MORE
    },
    event: {
      displayInfos: process.env.STYLES_DISPLAY_RIGHT_EVENT_INFOS,
    },
    footer: {
      displayFooter: process.env.STYLES_DISPLAY_FOOTER,
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
    map: {
      mapTilesAttribution: process.env.MAP_TILES_ATTRIBUTION,
      mapTilesUrl: process.env.MAP_TILES_URL,
    },
    preview: {
      displayListBtn: process.env.STYLES_DISPLAY_LIST_BTN,
      linkListBtn: process.env.STYLES_LINK_LIST_BTN,
    }
  },
  root: process.env.PORTAL_ROOT || `http://localhost:${process.env.PORTAL_PORT}`,
  devServerPort: process.env.PORTAL_DEV_SERVER_PORT || 3001,
  // agenda uid
  uid: process.env.PORTAL_AGENDA_UID,
  // site language
  lang: process.env.PORTAL_LANG || 'fr',
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
  i18n: process.env.PORTAL_I18N_FOLDER,
  // number of events to be loaded in an event index page
  eventsPerPage: 20,
  // visibility of past events when relative or timings filter is specified
  visibilityPastEvents : process.env.PORTAL_VISIBILITY_PAST_EVENTS,
  // filters that applies even if other filter is specified, can be overloaded
  preFilter: {
    relative: process.env.PORTAL_PREFILTER?.split(','),
  },
  // filter that applies when no other filter is specified
  defaultFilter: {
    // featured: 1,
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
      link: process.env.MAP_TILES_URL || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
      process.env.MAP_TILES_ATTRIBUTION || '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    },
    auto: true,
    /* center: {
      latitude: 43.597198,
      longitude: 1.441136
    }, */
    zoom: 20,
  },
  tracking: {
    useAgendaGoogleAnalytics: process.env.PORTAL_USE_AGENDA_GA_ID ?? false,
    // url of the link displayed in the cookie consent banner
    cookieBannerLink: 'https://support.google.com/analytics/answer/6004245?hl=fr'
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
