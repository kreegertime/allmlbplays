const Data = require('./data');
const Mlbplays = require('mlbplays');
const bodyParser = require('body-parser');
const express = require('express');

const app = express();
const data = new Data();

app.set('view engine', 'pug');

app.use(express.static('public'));
app.use(bodyParser.json());  // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index', {});
});

app.get('/pitch', (req, res) => {
  res.render('pitch', {});
});

app.post('/pitch_data', (req, res) => {
  data.loadPitchData(req.body.date, (data) => {
    res.send(data);
  });
});

app.post('/pitch_fastball_data', (req, res) => {
  data.loadFastballMonthData((data) => {
    console.log('data', data);
    res.send({ data: data });
  });
//  data.loadFastballData(req.body.date, (data) => {
//    res.send({ speed_avg: data });
//  });
});

app.post('/play_data', (req, res) => {
  data.loadPlayData(req.body.date, (data) => {
    res.send(data);
  });
});

app.listen(3000, () => { console.log('Listening on port 3000'); });
