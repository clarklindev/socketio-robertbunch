https://nodejs.org/docs/latest/api/os.html

## node
https://github.com/socketio/socket.io-client

### what do we need to know FROM NODE about performance?
- CPU load (current)
- memory usage
    - total
    - free
- OS type
- uptime
- CPU info
    - type
    - no of cores
    - clock speed

### 70 - figuring cpu load
- using os.cpus() "times" 
- these are various mode types the cpu can be in (milliseconds)...
    - user
    - nice
    - sys
    - idle
    - irq
- this is what we retrieve for each thread (not even distribution of load) 
- we can calculate based on average of all threads by pulling these status and then again 100ms later
- then calculating the difference
- NOTE: forEach does not have early loop termination (honors break and continue)
- getCpuLoad() is changed to expression (order important..no hoisting)
- getCpuLoad() made to return a Promise which calls resolve once we have a value for "percentOfCpu" and it returns this value to the caller.
- performanceLoadData() also now needs to be made to a promise (async) to await getCpuLoad `const cpuLoad = await getCpuLoad();`

```js
//node program that captures local performance data
//and sends it via socket to the server
//requires: socket.io-client
const os = require('os');


const cpuAverage = ()=>{
    const cpus = os.cpus(); //all cpus as an array (snapshot of now..)

    //cpus is an array of all cores, we need the average of all the cores which will give us the cpu average.
    let idleMs = 0; //idle milliseconds
    let totalMs = 0;//total milliseconds
    //loop through each core (thread)
    cpus.forEach(aCore=> {
        //each prop of acore.times...
        for(mode in aCore.times){
            //add the value under the prop of acore.times
            //we need all modes for this core added to totalMs
            totalMs += aCore.times[mode]
        }
        //we need idle mode for this core added to idleMs
        idleMs += aCore.times.idle;
    });
    return {
        idle: idleMs / cpus.length,
        total: totalMs / cpus.length
    }
}

//because the times property on cpus is time since boot, we will get now times,
//and 100ms from 'now' times. compare them, that will give us the current load
const getCpuLoad = () => new Promise((resolve, reject)=>{
    
    //call cpuAverage for 'now'
    const start = cpuAverage(); //'now' value of load
    setTimeout(()=>{
        //call cpuAverage for 'end' 100ms after 'now'
        const end = cpuAverage();   //'end' value of load
        const idleDiff = end.idle - start.idle;
        const totalDiff = end.total - start.total;
        // console.log(idleDiff, totalDiff);
        //calculate the % of the used cpu
        const percentOfCpu = 100 - Math.floor(100 * idleDiff / totalDiff);   //%
        console.log(percentOfCpu);
        resolve(percentOfCpu);
    }, 100);
});



//what do we need to know FROM NODE about performance?
const performanceLoadData = ()=> new Promise(async (resolve, reject)=>{
    //cpu load (current)
    const cpus = os.cpus(); //all cpus as an array - this needs to be here for cpuType, numCores, cpuSpeed
    //mem total
    const totalMem = os.totalmem(); //bytes   
    //mem free
    const freeMem = os.freemem();//bytes
    //memory usage
    const usedMem = totalMem - freeMem;
    const memUsage = Math.floor(usedMem / totalMem * 100) / 100;    //2 decimal places
    //OS type 
    const osType = os.type();
    //uptime
    const upTime = os.uptime(); //uptime in seconds 
    //CPU info
    //type
    const cpuType = cpus[0].model;
    //no of cores
    const numCores = cpus.length;
    //clock speed
    const cpuSpeed = cpus[0].speed;

    //cpu load 
    const cpuLoad = await getCpuLoad();
    
    resolve({
        freeMem,
        totalMem,
        usedMem,
        memUsage,
        osType,
        upTime,
        cpuType,
        numCores,
        cpuSpeed,
        cpuLoad,
    });
});

const run = async ()=>{
    const data = await performanceLoadData();
    console.log(data);
}
run();
```


## server
https://www.npmjs.com/package/socket.io
https://www.npmjs.com/package/@socket.io/sticky
https://www.npmjs.com/package/@socket.io/cluster-adapter

### 71 Cluster module
- at this point node client is pulling the correct data,
- TODO: requires socket server to send data to

- `server.js` - where server will live, but mostly contain cluster code (https://nodejs.org/api/cluster.html)
- `socketMain.js` - most socket.io work will happen in socketMain
- REASON for separating files, because we will use cluster module to run socket server on lots of threads, it needs to be separated into its own file.

- node.js is a single threaded language, so to utilize full potential of cpu, need to use more than one thread (eg. 6core cpu is 12 threads, but nodejs app uses only 1 of the threads)
- cluster: clusters of nodes.js processes can be used to run multiple instances of Node.js that can distribute workloads among their application threads. 
cluster module:
    - allows easy creation of child processes that all share server ports.
    - cluster module's job is to spawn a whole bunch of NodeJS programs, run multiple instances of NodeJS that can distribute workloads among application threads.
    - the thing is if we using http (STATELESS), doesnt matter what process we use because each run, a new worker is assigned,
    - problem is with sockets, it needs to match the same worker (session) to access the local data
    - cluster module allows multiple processes to share the same port

### clusterTest.js
- `node clusterTest.js` 
- the js is split up into 2 parts:
    1. FIRST TIME PROGRAM RUNS
        - `fork()` is like running node clusterTest.js again..but but it runs else part
        - Fork workers - depends on number of CPUs (threads)

    2. EVERY OTHER TIME PROGRAM RUNS
        - this will be replaced by a function in socketMain.js

```js
//server.js / clusterTest.js
//cluster module
if (cluster.isPrimary) {
}
else{
    // this will be replaced by a function in socketMain.js
}
```

```js
//socketMain.js
```

### 72 - using cluster module AND Cluster adapter (https://socket.io/docs/v4/cluster-adapter/)
- https://socket.io/docs/v4/cluster-adapter/
- The Cluster adapter allows us to use Socket.IO within a Node.js cluster.
- allows "primary" to communicate with all workers, then works communicate with client
- server.js - code direct from https://socket.io/docs/v4/cluster-adapter/ usage example...
- @socket.io/sticky - allows client to make its way back to correct worker
- @socket.io/cluster-adapter - allows primary node to emit to everyone
- specific code to use socket server with cluster module
```js
//----------------------------------------------------------
//SPECIFIC CODE TO USE SOCKET SERVER WITH CLUSTER MODULE
  const httpServer = http.createServer();

  // setup sticky sessions
  setupMaster(httpServer, {
    loadBalancingMethod: "least-connection",
  });

  // setup connections between the workers
  setupPrimary();


//OPTIONAL - for packets that use raw data ------------------------------------------------------
  // needed for packets containing buffers (you can ignore it if you only send plaintext objects)
  // Node.js < 16.0.0
//   cluster.setupMaster({
//     serialization: "advanced",
//   });
  // Node.js > 16.0.0
//   cluster.setupPrimary({
//     serialization: "advanced",
//   });
//------------------------------------------------------------------------------------------------

  httpServer.listen(3000);
  //------------------------------------------------------
```
- change from default adapter `io.adapter(createAdapter());`
- `setupWorker(io);` setup connection with the primary process - other side to master -> setupMaster(httpServer, {})
- PROGRESS: 
    #### PRIMARY
    - worked through cluster.
        `if(cluster.isMaster)/else`
    - sticky related stuff
        ```js
        setupMaster(httpServer, {
            loadBalancingMethod: "least-connection",
        });
        ```
    - adapter stuff (not required if not using packets that buffer)
    - cluster module forking
    ```js
        //...
        cluster.fork();
    ```
    #### WORKER LEVEL CODE
    ```
    else{}
    ```

- We just need a client to connect to our server (REACT UI)

### FULL EXAMPLE
```js
//server.js (similar to clusterTest.js)
//example using cluster adapter
const cluster = require("cluster");//makes it so we can use multiple threads
const http = require("http");
const { Server } = require("socket.io");    //to create socket server (socket traffic method)
const numCPUs = require("os").cpus().length;
const { setupMaster, setupWorker } = require("@socket.io/sticky");  //allows client to make its way back to correct worker
const { createAdapter, setupPrimary } = require("@socket.io/cluster-adapter"); //allows primary node to emit to everyone

//if using node > v16 `cluster.isPrimary`
if (cluster.isMaster) {
  console.log(`Master ${process.pid} is running`);

//----------------------------------------------------------
//SPECIFIC CODE TO USE SOCKET SERVER WITH CLUSTER MODULE
  const httpServer = http.createServer();

  // setup sticky sessions
  setupMaster(httpServer, {
    loadBalancingMethod: "least-connection",    //when new connection comes in, give workload to worker with fewest connections
  });

  // setup connections between the workers
  setupPrimary();

//OPTIONAL - for packets that use raw data ------------------------------------------------------
  // needed for packets containing buffers (you can ignore it if you only send plaintext objects)
  // Node.js < 16.0.0
//   cluster.setupMaster({
//     serialization: "advanced",
//   });
  // Node.js > 16.0.0
//   cluster.setupPrimary({
//     serialization: "advanced",
//   });
//------------------------------------------------------------------------------------------------

  httpServer.listen(3000);  //internet facing port
  //------------------------------------------------------

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker) => {
    console.log(`Worker ${worker.process.pid} died`);
    cluster.fork();
  });
} else {
  console.log(`Worker ${process.pid} started`);

  const httpServer = http.createServer();
  const io = new Server(httpServer);

  // use the cluster adapter
  io.adapter(createAdapter());      //change from default adapter

  // setup connection with the primary process
  setupWorker(io);  //setup connection with the primary process - other side to master -   setupMaster(httpServer, {})

  io.on("connection", (socket) => {
    /* ... */
  });
}
```

## react
- robert uses Create react app: `npx create-react-app react-client`

### 73 Connecting React to the socket.io server (for testing!)
- start terminal and run server/ 
- server connected on port 3000
- adjust for cors

```js
//server.js
//adjust for cors 
const httpServer = http.createServer();
const io = new Server(httpServer, {
  cors:{
    origin: 'http://localhost:3001',
    credentials: true
  }
});
```
- creating the react client
- start terminal and run react-client/
- connected on port 3001

```js
//add react-client/src/socketConnection.js
import io from 'socket.io-client';
const socket = io.connect('http://localhost:3000'); //server is at 3000
socket.on('welcome', (data)=>{
   console.log(data); 
});

export default socket;
```

### 74 Connect nodeClient to socket.io server
- connect server/
- connect react-client server/
- TODO: connect node/ server
- note: node needs to connect to where/port socket is listening... (servers.js: `httpServer.listen(3000);`)

```js
//node/index.js

const os = require('os');
const io = require('socket.io-client');
const socket = io('http://localhost:3000');//3000 is where server is listening

socket.on('connect', ()=>{
  console.log('NODE: we connected to the server');
});
```

- and instead of just sending feedback data by awaiting performanceLoadData(), the info should come from socketMain.js
```js
//COMMENT THIS OUT
//node/index.js

// const run = async ()=>{
  //     const data = await performanceLoadData();
//     console.log(data);
// }
// run();

```

- move the worker logic that deals with emits and listens happen
```js
//server/servers.js
const socketMain = require('./socketMain.js');

//...worker stuff
else{
  //...
  socketMain(io);
}
```

```js
//server/socketMain.js
//Where socket.io listeners and (most) emitters

const socketMain = (io)=>{
    io.on("connection", (socket) => {
        /* ... */
        console.log('SERVER: someone connected on worker: ', process.pid);
        socket.emit('welcome', "SERVER: welcome to our cluster driven socket.io server");
    });
}

module.exports = socketMain;
```

### 75 - fetch nodeClient macAddress
- TODO: send data from node server -> to socket server
- socketMain.js
- nodeClient/index.js
  - we need a way to identify this machine to the server (for frontend usage)
### os.networkInterfaces() 
- returns an object containing network interfaces that have been assigned a network address.
- each key on the returned object identifies a network interface.
- the properties available on the assigned network address object include:
  - address (ip4 address or ip6 address)
  - netmask (ip4 or ip6 network mask)
  - family (ip4 or ip6)
  - mac (mac address of network interface)
  - internal (boolean -> true if network interface is a loopback)
  - scopeid (numeric ipv6 scoped id)
  - cidr (the assigned ipv4 or ipv6 address with routing prefix in CIDR notation, if netmask is invalid, property is set to null)
- we are interested in "internal: false", mac address.
  
```js
//nodeClient/index.js
const os = require('os');
const io = require('socket.io-client');
const socket = io('http://localhost:3000');
socket.on('connect', ()=>{
    // console.log('NODE: we connected to the server');
    //we need a way to identify this machine
    const nI = os.networkInterfaces();  //list of all network interfaces on this machine
    let macA; //mac address
    //loop through all nI until we find a non-internal one
    for(let key in nI){
      const isInternetFacing = !nI[key][0].internal;
      if(isInternetFacing){
        //we have a macA we can use.
        macA = nI[key][0].mac;
        break;
      }
    }

    console.log("mac Address:", macA);
});

```
---
### TROUBLESHOOTING
- npm ERR! enoent ENOENT: no such file or directory, lstat 'C:\Users\lenovo\AppData\Roaming\npm'
- FIX: create the folder... `mkdir %USERPROFILE%\AppData\Roaming\npm`

