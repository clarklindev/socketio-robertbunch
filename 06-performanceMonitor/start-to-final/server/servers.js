// Socket.io server that will service both node
// and react clients

//INSTALL VIA CMD-ADMIN (NOT POWERSHELL)
// Req:
// - socket.io
// - @socket.io/cluster-adapter
// - @socket.io/sticky

// entrypoint for our cluster which will make workers
// and the workers will do the Socket.io handling
//See https://github.com/elad/node-cluster-socket.io

//example using cluster adapter
const cluster = require("cluster"); //makes it so we can use multiple threads
const http = require("http");
const { Server } = require("socket.io");
const numCPUs = require("os").cpus().length;
const { setupMaster, setupWorker } = require("@socket.io/sticky");
const { createAdapter, setupPrimary } = require("@socket.io/cluster-adapter");

//PRIMARY (node > v16 cluster.isPrimary)
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

  const httpServer = http.createServer();

  // setup sticky sessions
  setupMaster(httpServer, {
    loadBalancingMethod: "least-connection",
  });

  // setup connections between the workers
  setupPrimary();

  // needed only for packets containing buffers (you can ignore it if you only send plaintext objects)
  // Node.js < 16.0.0
//   cluster.setupMaster({
//     serialization: "advanced",
//   });
  // Node.js > 16.0.0
  // cluster.setupPrimary({
  //   serialization: "advanced",
  // });

  httpServer.listen(3000);    //internet facing

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} 

//WORKER LEVEL CODE
else {
  console.log(`Worker ${process.pid} started`);

  const httpServer = http.createServer();
  const io = new Server(httpServer, {
    cors:{
      origin: 'http://localhost:3001',
      credentials: true
    }
  });

  // use the cluster adapter
  io.adapter(createAdapter());  //change from default adapter

  // setup connection with the primary process - other side to master -   setupMaster(httpServer, {})
  setupWorker(io);

  io.on("connection", (socket) => {
    /* ... */
    console.log('someone connected on worker: ', process.pid);
    socket.emit('welcome', "welcome to our cluster driven socket.io server");
  });
}