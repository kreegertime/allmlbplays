/** Fetches all play information for a given baseball year */
const Mlbplays = require('mlbplays');
const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;
const levelup = require('levelup');

const START_DATE = new Date('3-31-2014');
const END_DATE = new Date('10-29-2014');

if (cluster.isMaster) {
  // fork workers
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died1`);
  });
  cluster.on('listening', (address) => {
    console.log('... listening');
  });
} else {
  // Workers can share any TCP connection.
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);
}
