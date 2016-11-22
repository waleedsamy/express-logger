'use strict';
var winston = require('winston');
var rewriters = require('./rewriters');
var middleware = require('./middleware');

if (!process.env.LOG_FORMAT || process.env.LOG_FORMAT !== 'pretty') {
    process.env.LOG_FORMAT = 'json';
}

var CONSOLE_OPTIONS = {
    humanReadableUnhandledException: process.env.LOG_FORMAT === 'pretty',
    colorize: process.env.LOG_FORMAT === 'pretty',
    timestamp: !(process.env.LOG_FORMAT === 'pretty'),
    json: !(process.env.LOG_FORMAT === 'pretty'),
    stringify: !(process.env.LOG_FORMAT === 'pretty'),
    prettyPrint: !(process.env.LOG_FORMAT === 'pretty')
};

var options = {
    transports: [new winston.transports.Console(CONSOLE_OPTIONS)],
    exceptionHandlers: [new winston.transports.Console(CONSOLE_OPTIONS)],
    rewriters: process.env.NODE_ENV == "development" ? [rewriters.generalInfo, rewriters.xRequestId] : [rewriters.generalInfo, rewriters.xRequestId, rewriters.redactCriticalData]
};

global.logger = new winston.Logger(options);

logger.info("Logger is configured with LOG_FORMAT=%s", process.env.LOG_FORMAT, CONSOLE_OPTIONS);

module.exports = {
    XRequestId: middleware.XRequestId,
    expressWinston: middleware.expressWinston
}
