const Mlbplays = require('mlbplays');
const express = require('express');

const app = express();


app.get('/', (req, res) => {
  const mlbplays = new Mlbplays({ path: 'year_2016/month_07/day_23/' });
  mlbplays.get((err, results) => {
    res.send(JSON.stringify(results));
  });
});


app.listen(3000, () => { console.log('Listening on port 3000'); });
