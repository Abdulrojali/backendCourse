
require('./course');;
require('./videoList')
require('./history')
require('./user')
require('./admin');
require('./detailProfileUser')
// Export instance mongoose yang sudah berisi semua model
module.exports = require('mongoose');