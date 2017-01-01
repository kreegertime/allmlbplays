const levelup = require('levelup');
const multilevel = require('multilevel');
const net = require('net');

const db = levelup('./plays_db', { valueEncoding: 'json' });

net.createServer((con) => {
  con.pipe(multilevel.server(db)).pipe(con);
}).listen(4000);
