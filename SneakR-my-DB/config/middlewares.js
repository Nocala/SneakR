module.exports = [
  {
    name: 'strapi::cors',
    config: {
      origin: ['http://localhost:5173'], // Autorise Vue.js
    },
  },
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];