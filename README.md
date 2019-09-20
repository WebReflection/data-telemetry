# data-telemetry

[![Build Status](https://travis-ci.com/WebReflection/data-telemetry.svg?branch=master)](https://travis-ci.com/WebReflection/data-telemetry) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/flatted/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/flatted?branch=master)

A simple event tracker for user surfing sessions.

```js
import {Session} from 'data-telemetry';

const session = new Session(
  document.body,  // the root node to search for [data-telemetry]
                  // it's the document itself by default
  true,           // overwrite last move to reduce the amount of events
                  // it's true as default
  false           // use pointer events instead of mouse
                  // it defaults to typeof PointerEvent check
);

// ... after a while ...
// log the list of registered records
console.log(session.events);
```

The session is serializable as JSON too via `JSON.stringify(session)`, resulting in its list of events as records.

### Events

`cancel`, `down`, `enter`, `leave`, `move`, `out`, `over`, and `up` are automatically transformed via `mouse` or `pointer` prefix.

To enable any telemetry event, use the `data-telemetry` attribute as shown in the following example:

```html
<div data-telemetry="move, up, down">
  <input data-telemetry="keypress" placeholder="write stuff">
  <button data-telemetry="click">
    send stuff
  </button>
</div>
```

The session can be confined per container, and every node will add an event to the list once such event happens.

### Records

Each record will contain the following details:

  * `target`, stored as CSS selector
  * `type`, the event type
  * `key`, the key info, if available
  * `x` and `y`, the event pageX/Y coordinates, if available
  * `primary`, the pointerevents `primary` detail, if available
  * `time` the `timeStamp` of the event
