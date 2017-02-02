var should = require('should'),
    faker = require('faker'),
    rewriters = require('../rewriters');

describe('Rewriters', function() {
    describe('#generalInfo(level, msg, meta)', function() {
        it('add generalInfo', function() {
            var msg = faker.random.words(),
                meta = {
                    m1: faker.internet.userName(),
                    m2: faker.internet.ip(),
                    m3: faker.random.number()
                };
            var generalInfo = rewriters.generalInfo('info', msg, meta);
            should.exist(generalInfo);
            generalInfo.GENERATED_BY.should.exist;
            generalInfo.m1.should.be.eql(meta.m1);
            generalInfo.m2.should.be.eql(meta.m2);
            generalInfo.m3.should.be.eql(meta.m3);
        });

        it('add generalInfo even if meta object is undefined', function() {
            var msg = faker.random.words();
            var generalInfo = rewriters.generalInfo('info', msg, undefined);
            should.exist(generalInfo);
            generalInfo.GENERATED_BY.should.exist;
        });
    });
    describe('#redactCriticalData(level, msg, meta)', function() {
        it('simple redact of top level secret information', function() {
            var msg = faker.random.words(),
                meta = {
                    password: faker.internet.password(),
                    pwd: faker.internet.password(),
                    auth: new Buffer(faker.internet.userName + ":" + faker.internet.password).toString('base64'),
                    authorization: new Buffer(faker.internet.userName + ":" + faker.internet.password).toString('base64'),
                    Authorization: "Bearer " + new Buffer(faker.internet.userName + ":" + faker.internet.password).toString('base64'),
                    cfg: faker.random.number(),
                    host: faker.internet.ip()
                };
            var redacted = rewriters.redactCriticalData('info', msg, meta);
            redacted.password.should.be.eql('<REDACTED>');
            redacted.pwd.should.be.eql('<REDACTED>');
            redacted.auth.should.be.eql('<REDACTED>');
            redacted.authorization.should.be.eql('<REDACTED>');
            redacted.Authorization.should.be.eql('<REDACTED>');
            redacted.cfg.should.be.eql('<REDACTED>');
            redacted.host.should.not.eql('<REDACTED>');
        });

        it('redact nested secret information', function() {
            var msg = faker.random.words(),
                meta = {
                    req: {
                        query: {
                            qs: {
                                name: faker.internet.userName()
                            },
                            xm: {
                                $: {
                                    usr: faker.internet.userName(),
                                    pwd: faker.internet.password(),
                                    cfg: faker.random.number(),
                                    data: faker.random.words()
                                }
                            }
                        }
                    },
                    ind: {
                        pdate: faker.date.past(),
                        fdate: faker.date.future(),
                    },
                    auth: new Buffer(faker.internet.userName + ":" + faker.internet.password).toString('base64'),
                    authorization: new Buffer(faker.internet.userName + ":" + faker.internet.password).toString('base64'),
                    host: faker.internet.ip()
                };
            var redacted = rewriters.redactCriticalData('info', msg, meta);
            redacted.req.query.qs.name.should.not.eql('<REDACTED>');
            redacted.req.query.xm.$.usr.should.not.eql('<REDACTED>');
            redacted.req.query.xm.$.pwd.should.be.eql('<REDACTED>');
            redacted.req.query.xm.$.cfg.should.be.eql('<REDACTED>');
            redacted.req.query.xm.$.data.should.not.eql('<REDACTED>');
            redacted.ind.pdate.should.not.eql('<REDACTED>');
            redacted.ind.fdate.should.not.eql('<REDACTED>');
            redacted.auth.should.be.eql('<REDACTED>');
            redacted.authorization.should.be.eql('<REDACTED>');
            redacted.host.should.not.eql('<REDACTED>');
        });

        it('case insensitive secret keys', function() {
            var msg = faker.random.words(),
                meta = {
                    passWord: faker.internet.password(),
                    pwD: faker.internet.password(),
                    Auth: new Buffer(faker.internet.userName + ":" + faker.internet.password).toString('base64'),
                    authoriZation: new Buffer(faker.internet.userName + ":" + faker.internet.password).toString('base64'),
                    Authorization: "Bearer " + new Buffer(faker.internet.userName + ":" + faker.internet.password).toString('base64'),
                    CFG: faker.random.number(),
                    host: faker.internet.ip()
                };
            var redacted = rewriters.redactCriticalData('info', msg, meta);
            redacted.passWord.should.be.eql('<REDACTED>');
            redacted.pwD.should.be.eql('<REDACTED>');
            redacted.Auth.should.be.eql('<REDACTED>');
            redacted.authoriZation.should.be.eql('<REDACTED>');
            redacted.Authorization.should.be.eql('<REDACTED>');
            redacted.CFG.should.be.eql('<REDACTED>');
            redacted.host.should.not.eql('<REDACTED>');
        });

        it('meta object should not be overwritten', function() {
            var msg = faker.random.words(),
                meta = {
                    qs: {
                        passWord: faker.internet.password(),
                        pwD: faker.internet.password()
                    },
                    CFG: faker.random.number(),
                    host: faker.internet.ip()
                };
            var redacted = rewriters.redactCriticalData('info', msg, meta);
            redacted.qs.passWord.should.be.eql('<REDACTED>');
            meta.qs.passWord.should.not.eql('<REDACTED>');
            redacted.qs.pwD.should.be.eql('<REDACTED>');
            meta.qs.pwD.should.not.eql('<REDACTED>');
            redacted.CFG.should.be.eql('<REDACTED>');
            meta.CFG.should.not.eql('<REDACTED>');
            redacted.host.should.not.eql('<REDACTED>');
            meta.host.should.not.eql('<REDACTED>');
        });
    });
});
