require('basichtml').init();

document.body.dataset.telemetry = 'cancel, down, enter, leave, move, out, over, up, click, keypress';
document.body.classList.add('test', 'more');
document.querySelectorAll = function () {
  return [document.body];
};

const {Session} = require('../cjs');

let session = new Session();

let event = document.createEvent('Event');
event.initEvent('click', false, false);
document.body.dispatchEvent(event);

event.isTrusted = true;
document.body.dispatchEvent(event);

document.body.id = 'da-body';
document.body.dispatchEvent(event);

event = document.createEvent('Event');
event.initEvent('move', false, false);
event.isTrusted = true;
event.target = document.body;
session.handleEvent(event);

session = new Session(document, true, true);

session.handleEvent(event);
session.handleEvent(event);

const all = JSON.parse(JSON.stringify(session));
console.assert(all.length === 1, 'only one move event expected');

const result = all.pop();
console.assert(result.target === '#da-body.test.more', 'correct target');
console.assert(result.type === 'move', 'correct type');
console.assert(/^[0-9.]+$/.test(result.time), 'correct time');
