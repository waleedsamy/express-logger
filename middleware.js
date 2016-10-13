var winston = require('winston');
var uuid = require('node-uuid');
var ewinston = require('express-winston');
var prjctdir = require('cwd')();
var pkg = require(prjctdir + '/package.json');

function XRequestId() {
    return function(req, res, next) {
        if (!req.headers['x-request-id']) {
            req.headers['x-request-id'] = req.id = uuid.v4();
        } else {
            req.headers['x-request-id'] = req.id = req.headers['x-request-id'] + "-" + pkg.name.toLowerCase();
        }
        res.setHeader('x-request-id', req.id);
        next();
    }
}

function expressWinston() {
    return ewinston.logger({
        winstonInstance: global.logger,
        meta: true,
        msg: "HTTP {{req.method}} {{req.baseUrl}}{{req.path}} {{res.statusCode}} {{res.responseTime}}ms",
        statusLevels: true,
        requestWhitelist: ['baseUrl', 'headers', 'method', 'httpVersion', 'query'],
        responseWhitelist: ['statusCode', '_headers']
    });
}


module.exports = {
    XRequestId: XRequestId,
    expressWinston: expressWinston
}
