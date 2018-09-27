const path = require('path');

module.exports = {
  baseUrl: process.env.NODE_ENV === 'production'
    ? '/vuetify-data-table-multi-filter/'
    : '/'
};