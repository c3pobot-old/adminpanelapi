'use strict'
const log = require('logger')
let logLevel = process.env.LOG_LEVEL || log.Level.INFO;
log.setLevel(logLevel);
global.baseDir = __dirname
process.on('unhandledRejection', error => {
  log.error(error)
});
require('./src')
