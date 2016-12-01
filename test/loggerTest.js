const assert = require('assert'),
    exwml = require('..');

describe('Logger', function() {
    it('should has a emerg level', function() {
        logger.should.have.property('emerg');
        logger.emerg.should.be.type('function');
    });

    it('should has a alert level', function() {
        logger.should.have.property('alert');
        logger.alert.should.be.type('function');
    });

    it('should has a crit level', function() {
        logger.should.have.property('crit');
        logger.crit.should.be.type('function');
    });

    it('should has a error level', function() {
        logger.should.have.property('error');
        logger.error.should.be.type('function');
    });

    it('should has a warning level', function() {
        logger.should.have.property('warning');
        logger.warning.should.be.type('function');
    });

    it('should has a notice level', function() {
        logger.should.have.property('notice');
        logger.notice.should.be.type('function');
    });

    it('should has a info level', function() {
        logger.should.have.property('info');
        logger.info.should.be.type('function');
    });

    it('should has a debug level', function() {
        logger.should.have.property('debug');
        logger.debug.should.be.type('function');
    });

});
