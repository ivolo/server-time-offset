# server-offset

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

## API

### .ping(options)
  Starts pinging the server every options.every milliseconds.

  Returns a Pinger that sends offset every time

## License

  MIT
