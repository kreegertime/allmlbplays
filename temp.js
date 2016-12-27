const levelup = require('levelup');

const playsDB = levelup('./plays_db', { valueEncoding: 'json' });
const db2014 = levelup('./2014-mlbplays', { valueEncoding: 'json' });
const db2015 = levelup('./2015-mlbplays', { valueEncoding: 'json' });
const db2016 = levelup('./2016-mlbplays', { valueEncoding: 'json' });


const START_DATE_2014 = new Date('3-31-2014');
const END_DATE_2014 = new Date('10-29-2014');
const START_DATE_2015 = new Date('4-05-2015');
const END_DATE_2015 = new Date('11-01-2015');
const START_DATE_2016 = new Date('4-03-2016');
const END_DATE_2016 = new Date('10-02-2016');


function genRequests(requests, startDate, endDate, db) {
  for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {
    let year = '' + date.getFullYear();
    let month = '' + (date.getMonth() + 1);
    let day = '' + date.getDate();
    month = month.length == 1 ? '0' + month : month;
    day = day.length == 1 ? '0' + day : day;

    requests.push({
      key: year + '-' + month + '-' + day,
      db: db
    });
  }
}

const requests = [];
genRequests(requests, START_DATE_2014, END_DATE_2014, db2014);
genRequests(requests, START_DATE_2015, END_DATE_2015, db2015);
genRequests(requests, START_DATE_2016, END_DATE_2016, db2016);

console.log('processing ' + requests.length + ' operations');

let timeout = 0;
requests.forEach((request) => {
  setTimeout(() => {
    request.db.get(request.key, (err, value) => {
      if (err) {
        console.log('*** error for ', request.key);
      } else {
        playsDB.put(request.key, value, (err) => {
          if (err) {
            console.log('Exception writing put', err);
          }
        });
        console.log('  - pushed', request.key);
      }
    });
  }, timeout);

  timeout += 500;
});
