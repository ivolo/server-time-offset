# server-time-offset

Determines the offset between the client time and the server time by continuously pinging the server.

## Installation

    $ component install ivolo/server-offset

## Example

```js
var server = require('server-time-offset');

var pinger = server.ping({every: 500});
pinger.on('offset', function (offset) {
  // use the offset
});

// if we want it to stop pinging
pinger.stop();
```
### How It Works

Continiously pings the server at `document.path` and uses the DATE response header to calculate the difference between the current time. It also ball-parks the latency by taking the request time and dividing it in half.

### Why?

This doesn't give you the exact server time, as NTP would do. Sometimes you want to compare the latency of two clients, in relation to the same server, such as when synchronizing sound between two computers.

Based on this Stackoverflow [answer](http://stackoverflow.com/questions/10585910/sync-js-time-between-multiple-devices?lq=1).

## API

### .ping(options)
  Starts pinging the server every options.every milliseconds.

  Returns a Pinger that sends offset every time



## License

  MIT
