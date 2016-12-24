const Mlbplays = require('mlbplays');
const bodyParser = require('body-parser');
const express = require('express');

const app = express();

app.set('view engine', 'pug');

app.use(express.static('public'));
app.use(bodyParser.json());  // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index', {});
});

app.post('/plays', (req, res) => {
  let year = req.body.year.length == 1 ? '0' + req.body.year : req.body.year;
  let month = req.body.month.length == 1 ? '0' + req.body.month : req.body.month;
  let day = req.body.day.length == 1 ? '0' + req.body.day : req.body.day;
  const datePathArg = 'year_' + year + '/month_' + month + '/day_' + day + '/';
  const mlbplays = new Mlbplays({ path: datePathArg });
  mlbplays.get((err, results) => {
    if (err) {
      console.log('err', err);
    }
    res.send(results);
  });
});

app.listen(3000, () => { console.log('Listening on port 3000'); });
