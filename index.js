
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
    path      : document.location,
    every     : 1000,
    maxSamples: 10
  });

  this.samples = [];
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
      self.samples.push(offset);
      if (self.samples.length > self.options.maxSamples)
        self.samples.pop();

      self.emit('offset', self.offset());
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
 * Returns the average of the offset samples
 * @return {Integer} The time offset
 */
Pinger.prototype.offset = function () {
  var sum = 0;
  this.samples.forEach(function (offset) {
    sum += offset;
  });
  return sum / this.samples.length;
};

/**
 * Pings the server to determine the current
 * server time offset
 * @param  {Function} callback callback(err, offset)
 */
Pinger.prototype.ping = function (callback) {
  var r = new XMLHttpRequest();
  var start = Date.now();
  r.open('HEAD', this.options.path, false);
  r.onreadystatechange = function () {
    if (r.readyState !== 4) return;
    var latency = Date.now() - start;
    var serverTime = new Date(r.getResponseHeader('DATE'));
    var offset = (serverTime.getTime() + (latency / 2)) - Date.now();
    return callback(null, offset);
  };
  r.send(null);
};
