const mapreduce = require('mapred')();
const multilevel = require('multilevel');
const net = require('net');

const db = multilevel.client();
const con = net.connect(4000);
con.pipe(db.createRpcStream()).pipe(con);
//const db = levelup('./plays_db', { valueEncoding: 'json' });


function processPitch(pitches, pitch) {
  pitches.push({
    start_speed: pitch.start_speed,
    description: pitch.des,
    pitch_type: pitch.pitch_type,
    type: pitch.type
  });
}


function processPitchType(type, pitches, pitch) {
  if (pitch.pitch_type == type) {
    pitches.push(pitch.start_speed);
  }
}


function map(value) {
  console.log('mapping ' + key);
  let speeds = [];
  if (typeof[value.pitch] != 'undefined') {
    if (Array.isArray(value.pitch)) {
      value.pitch.forEach((pitch) => {
        if (pitch.pitch_type == 'FF') {
          speeds.push(pitch.start_speed);
        }
      });
    } else {
      if (value.pitch.pitch_type == 'FF') {
        speeds.push(value.pitch.start_speed);
      }
    }
  }
  return pitches;
}


function reduce(key, values) {
  console.log('key', key);
  let totalSpeed = 0.0;
  values.forEach((speed) => {
    totalSpeed += parseFloat(speed);
  });
  return totalSpeed / values.length;
}


class Data {
  constructor() {
  }

  loadPlayData(date, callback) {
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

  loadFastballMonthData(callback) {
    const startDate = new Date('2016-08-01');
    const endDate = new Date('2016-08-31');
    const requests = [];
    for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
      let year = '' + date.getFullYear();
      let month = '' + (date.getMonth() + 1);
      let day = '' + date.getDate();
      month = month.length == 1 ? '0' + month : month;
      day = day.length == 1 ? '0' + day : day;
      requests.push(year + '-' + month + '-' + day);
    }

    var mapRequests = function(key, value) {
      return value;
    };

    var reduceRequests = function(key, values) {
      return values;
    };

    mapreduce(requests, mapRequests, reduceRequests, (results) => {
      console.log('results', results);
      callback(results);
    });
  }

  loadFastballData(date, callback) {
    db.get(date, (err, value) => {
      console.log('value', typeof value);
      if (err) {
        throw (err);
      } else {

        let totalSpeed = 0;
        let speedCount = 0;
        value.forEach((play) => {
          if (typeof[play.pitch] != 'undefined') {
            if (Array.isArray(play.pitch)) {
              play.pitch.forEach((pitch) => {
                if (pitch.pitch_type == 'FF') {
                  totalSpeed += parseFloat(pitch.start_speed);
                  ++speedCount;
                }
              });
            } else {
              if (play.pitch.pitch_type == 'FF') {
                totalSpeed += parseFloat(play.pitch.start_speed);
                ++speedCount;
              }
            }
          }
        });
        callback(totalSpeed / speedCount);
      }
    });
  }

  testMapReduce(value, callback) {
  }
}

module.exports = Data;
