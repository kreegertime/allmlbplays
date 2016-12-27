const levelup = require('levelup');

const db = levelup('./plays_db', { valueEncoding: 'json' });


function processPitch(pitches, pitch) {
  pitches.push({
    start_speed: pitch.start_speed,
    description: pitch.des,
    pitch_type: pitch.pitch_type,
    type: pitch.type
  });
}


class Data {
  constructor() {
  }

  loadPlayData(date, callback) {
    // Hardcoding 2016 DB fore now.
    db.get(date, (err, value) => {
      if (err) {
        throw (err);
      } else {
        callback(value);
      }
    });
  }

  loadPitchData(date, callback) {
    db.get(date, (err, value) => {
      if (err) {
        throw (err);
      } else {

        let pitches = [];
        value.forEach((play) => {
          if (typeof[play.pitch] != 'undefined') {
            if (Array.isArray(play.pitch)) {
              play.pitch.forEach((pitch) => {
                processPitch(pitches, pitch);
              });
            } else {
              processPitch(pitches, play.pitch);
            }
          }
        });

        callback(pitches);
      }
    });
  }
}

module.exports = Data;
