
var Emitter = require('emitter');
var defaults = require('defaults');



/**
 * Returns a pinger that periodically pings the server to
 * determine server time offset
 * @param {Object} options Options for pinging
 * * @param {String} path  The server path to ping
 * * @param {every}  every The millisecond interval to ping
 */

exports.ping = function (options) {
  var pinger = new Pinger(options);
  pinger.start();
  return pinger;
};



/**
 * A beacon that periodically pings the server to
 * determine server time offset
 * @param {Object} options Options for pinging
 * * @param {String} path  The server path to ping
 * * @param {every}  every The millisecond interval to ping
 */
function Pinger (options) {
  this.options = defaults(options || {}, {
    path : document.location,
    every: 500
  });
}

Emitter(Pinger.prototype);

/**
 * Start pinging the server on an interval to determine
 * offset
 */
Pinger.prototype.start = function () {
  // if we already have a timer installed, return
  if (this.timer) return;

  var self = this;

  // start a recurring timeout
  this.timer = setTimeout(function () {
    self.ping(function (err, offset) {
      if (err) return;
      self.emit('offset', offset);
    });
  }, this.options.every);
};

/**
 * Stop pinging the server for the offset
 */
Pinger.prototype.stop = function () {
  if (this.timer) clearTimeout(this.timer);
};

/**
 * Pings the server to determine the current
 * server time offset
 * @param  {Function} callback callback(err, offset)
 */
Pinger.prototype.ping = function (callback) {
  var start = Date.now();

  var r = new XMLHttpRequest();
  r.open('HEAD', this.options.path, false);
  r.onreadystatechange = function () {
      if (r.readyState !== 4) return;

      var latency = Date.now() - start;

      var serverTime = new Date(r.getResponseHeader('DATE'));

      var offset = serverTime - Date.now() + (latency / 2);

      return callback(null, offset);
  };

  r.send(null);
};
