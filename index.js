var dataTelemetry = (function (exports) {
  'use strict';

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  var asCSS = function asCSS(el) {
    var details = [];
    if (el.id) details.push("#".concat(el.id));else {
      var parent = el.closest('[id]');
      var id = parent ? "#".concat(parent.id, " ") : '';
      details.push(id + el.nodeName.toLowerCase());
    }
    details.push.apply(details, el.classList);
    return details.join('.');
  };

  var transform = function transform(name, pointerEvents) {
    return (pointerEvents ? 'pointer' : 'mouse') + name;
  };

  var types = {
    cancel: function cancel(pointerEvents) {
      return transform('cancel', pointerEvents);
    },
    down: function down(pointerEvents) {
      return transform('down', pointerEvents);
    },
    enter: function enter(pointerEvents) {
      return transform('enter', pointerEvents);
    },
    leave: function leave(pointerEvents) {
      return transform('leave', pointerEvents);
    },
    move: function move(pointerEvents) {
      return transform('move', pointerEvents);
    },
    out: function out(pointerEvents) {
      return transform('out', pointerEvents);
    },
    over: function over(pointerEvents) {
      return transform('over', pointerEvents);
    },
    up: function up(pointerEvents) {
      return transform('up', pointerEvents);
    }
  };
  var Session =
  /*#__PURE__*/
  function () {
    function Session() {
      var root = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
      var overwriteLastMove = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
      var pointerEvents = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : typeof PointerEvent === 'function';

      _classCallCheck(this, Session);

      this.events = [];
      this.root = root;
      this.overwriteLastMove = overwriteLastMove;
      var elements = root.querySelectorAll('[data-telemetry]');

      for (var i = 0, length = elements.length; i < length; i++) {
        var el = elements[i];
        var telemetry = el.dataset.telemetry.split(/,[ \t\n\r]*/);

        for (var _i = 0, _length = telemetry.length; _i < _length; _i++) {
          var type = telemetry[_i];

          if (type === 'all') {
            for (var key in el) {
              if (/^on/.test(key)) el.addEventListener(key, this, true);
            }
          } else {
            el.addEventListener(types.hasOwnProperty(type) ? types[type](pointerEvents) : type, this, true);
          }
        }
      }
    }

    _createClass(Session, [{
      key: "handleEvent",
      value: function handleEvent(event) {
        var overwriteLastMove = this.overwriteLastMove,
            events = this.events;
        var target = event.target,
            type = event.type,
            key = event.key,
            x = event.pageX,
            y = event.pageY,
            primary = event.isPrimary,
            time = event.timeStamp,
            isTrusted = event.isTrusted;
        if (!isTrusted) return;
        var length = events.length;
        var record = {
          target: asCSS(target),
          type: type,
          key: key,
          x: x,
          y: y,
          primary: primary,
          time: time
        };

        if (overwriteLastMove && length > 0 && /move$/.test(type)) {
          if (/move$/.test(events[length - 1].type)) {
            events[length - 1] = record;
            return;
          }
        }

        events.push(record);
      }
    }, {
      key: "toJSON",
      value: function toJSON() {
        return {
          root: asCSS(this.root),
          events: this.events
        };
      }
    }]);

    return Session;
  }();

  exports.Session = Session;

  return exports;

}({}));
