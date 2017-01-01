const Data = require('./data');
const data = new Data();

data.loadPitchData('2016-08-01', (data) => {
  console.log('data', data);
});
