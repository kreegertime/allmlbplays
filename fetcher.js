/** Fetches all play information for a given baseball year */
const Mlbplays = require('mlbplays');
const levelup = require('levelup');

const db = levelup('./2014-mlbplays', { valueEncoding: 'json' });

const START_DATE = new Date('3-31-2014');
//const END_DATE = new Date('4-9-2014');
const END_DATE = new Date('10-29-2014');

const requests = [];
for (let date = START_DATE; date <= END_DATE; date.setDate(date.getDate() + 1)) {
  let year = '' + date.getFullYear();
  let month = '' + (date.getMonth() + 1);
  let day = '' + date.getDate();
  month = month.length == 1 ? '0' + month : month;
  day = day.length == 1 ? '0' + day : day;

  requests.push({
    path: 'year_' + year + '/month_' + month + '/day_' + day + '/',
    key: year + '-' + month + '-' + day
  });
}

let timeout = 0;
let requestCount = requests.length;

requests.forEach((request) => {
  setTimeout(() => {
    const mlbplays = new Mlbplays({ path: request.path });
    mlbplays.get((err, results) => {
      if (err) {
        console.log('*** No content for ', request.key);
      } else {
        db.put(request.key, results, { sync: true }, (err) => {
          if (err) {
            console.log('*** Could not store ', request.key);
          } else {
            console.log('Stored data for ', request.key);
          }
        });
      }
      console.log('     requestCount: ', requestCount--);
    });
  }, timeout);

  timeout += 5000;
});
