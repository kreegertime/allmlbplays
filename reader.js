const Mlbplays = require('mlbplays');
const levelup = require('levelup');

const db = levelup('./2014-mlbplays');

db.get('2014-04-01', (err, value) => {
  if (err) {
    console.log('err!', err);
  } else {
    let events = {};
    JSON.parse(value).forEach((p) => {
      if (typeof events[p.event] == 'undefined') {
        events[p.event] = 1;
      } else {
        events[p.event] = events[p.event] + 1;
      }
    });
    console.log(Object.keys(events));
  }
});

