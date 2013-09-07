
describe('server-time-offset', function () {

var assert = require('assert')
  , server = require('server-time-offset');

  describe('#ping', function () {

    it('should start pinging the server', function (done) {

      var server = require('server-time-offset');

      var pinger = server.ping({every: 500});
      pinger.on('offset', function (offset) {
        // use the offset
        assert(offset > 0);
        done();
      });
    });
  });
});