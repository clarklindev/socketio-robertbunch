//FROM DOCUMENTATION (https://nodejs.org/api/cluster.html )

const cluster = require('cluster');
const http = require('http');
const {availableParallelism} = require('os');       //get number of cpus
const process = require('process');
const numCPUs = availableParallelism();

//FIRST TIME PROGRAM RUNS
if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  // Fork workers - depends on number of CPUs (threads)
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork(); //fork() is like running node clusterTest.js again..
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} 

//EVERY OTHER TIME PROGRAM RUNS
else {
  // Workers can share any TCP connection
  // In this case it is an HTTP server
  http.createServer((req, res) => {
    res.writeHead(200);
    res.end('hello world\n');
  }).listen(8000);

  console.log(`Worker ${process.pid} started`);
}