var should = require('should'),
    mocks = require('node-mocks-http'),
    uuid = require('uuid'),
    v = require('validator'),
    faker = require('faker'),
    prjctdir = require('cwd')(),
    PKG_NAME = require(prjctdir + '/package.json').name.toLowerCase(),
    middleware = require('../middleware');

describe('Middleware', function() {
    describe('XRequestId', function() {
        it('response should has `x-request-id` header', function(done) {
            var req = mocks.createRequest(),
                res = mocks.createResponse();
            middleware.XRequestId()(req, res, function() {
                should.exist(res._headers['x-request-id']);
                v.isUUID(res._headers['x-request-id']).should.be.true();
                done();
            });
        });

        it('set response headers `x-request-id` if request headers already has `x-request-id`', function(done) {
            var REQ_ID = uuid();
            var req = mocks.createRequest({
                    headers: {
                        'x-request-id': REQ_ID
                    }
                }),
                res = mocks.createResponse();
            middleware.XRequestId()(req, res, function() {
                res._headers['x-request-id'].should.eql(REQ_ID + "-" + PKG_NAME);
                done();
            });
        });
    });
});
