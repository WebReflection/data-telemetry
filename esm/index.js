const asCSS = el => {
  const details = [];
  if (el.id)
    details.push(`#${el.id}`);
  else {
    const parent = el.closest('[id]');
    const id = parent ? `#${parent.id} ` : '';
    details.push(id + el.nodeName.toLowerCase());
  }
  details.push.apply(details, el.classList);
  return details.join('.');
};

const transform = (name, pointerEvents) =>
  (pointerEvents ? 'pointer' : 'mouse') + name;

const types = {
  cancel: pointerEvents => transform('cancel', pointerEvents),
  down: pointerEvents => transform('down', pointerEvents),
  enter: pointerEvents => transform('enter', pointerEvents),
  leave: pointerEvents => transform('leave', pointerEvents),
  move: pointerEvents => transform('move', pointerEvents),
  out: pointerEvents => transform('out', pointerEvents),
  over: pointerEvents => transform('over', pointerEvents),
  up: pointerEvents => transform('up', pointerEvents)
};

export class Session {
  constructor(
    // the node to search for data-telemetry
    root = document,
    // store only last mouse/pointermove event
    overwriteLastMove = true,
    // use pointer events instead of mouse events
    pointerEvents = typeof PointerEvent === 'function'
  ) {
    this.events = [];
    this.root = root;
    this.overwriteLastMove = overwriteLastMove;
    const elements = root.querySelectorAll('[data-telemetry]');
    for (let i = 0, {length} = elements; i < length; i++)
    {
      const el = elements[i];
      const telemetry = el.dataset.telemetry.split(/,[ \t\n\r]*/);
      for (let i = 0, {length} = telemetry; i < length; i++)
      {
        const type = telemetry[i];
        el.addEventListener(
          types.hasOwnProperty(type) ?
            types[type](pointerEvents) : type,
          this,
          true
        );
      }
    }
  }
  handleEvent(event) {
    const {overwriteLastMove, events} = this;
    const {
      target,
      type,
      key,
      pageX: x, pageY: y,
      isPrimary: primary,
      timeStamp: time,
      isTrusted
    } = event;
    if (!isTrusted)
      return;
    const {length} = events;
    const record = {
      target: asCSS(target),
      type,
      key,
      x, y,
      primary,
      time
    };
    if (overwriteLastMove && length > 0 && /move$/.test(type))
    {
      if (/move$/.test(events[length - 1].type))
      {
        events[length - 1] = record;
        return;
      }
    }
    events.push(record);
  }
  toJSON() {
    return {
      root: asCSS(this.root),
      events: this.events
    };
  }
};
