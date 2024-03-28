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
  - use performanceLoadData(), add macAddress (macA)
  - `socket.emit('perfData', perfData);` 
- then in socketMain, listen for 'perfData'

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
  
### 76 - Start the ticking clock
- ensure interval is cleared when disconnected, this includes reconnect...
- nodeConnect emits performance data object which includes the mac Address then sends it to socket server: 
`const socket = io('http://localhost:3000');`
- ensure node on disconnect, clears interval - if disconnect, stop setInterval (this includes reconnect)
- then in //server/socketMain.js we listen for perfData

### auth (6min)
- //server/socketMain.js: with io() pass an object with 'auth' prop

```js
//nodeClient/index.js
import {io} from 'socket.io-client';

//METHOD: tut method:
const options = {
  auth:{
    token: "sdfsdfsdffdhfhgjghjktry5334543asasd"
  }
};
const socket = io('http://localhost:3000', options);


//METHOD: basic example
const socket = io({
  auth:{
    token:"abcd"
  }
});

//METHOD: with callback
const socket = io({
  auth: (cb)=>{
    cb({token: localStorage.token})
  }
});
```
- access via socket.handshake... 

```js
//server/socketMain.js
const auth = socket.handshake.auth;
console.log(auth); //prints {token : "abcd"}
```

---
### FULL EXAMPLE

```js
//nodeClient/index.js
const os = require('os');
const io = require('socket.io-client');
const options = {
  auth:{
    token: "sdfsdfsdffdhfhgjghjktry5334543asasd"
  }
};
const socket = io('http://localhost:3000', options);

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

    //send data
    const perfDataInterval = setInterval(async ()=>{
      //every second call performanceLoadData and emit
      const perfData = await performanceLoadData();  //function returns a promise, but with await it equals the resolve() value
      perfData.macA = macA;
      socket.emit('perfData', perfData);
    }, 1000);

    //clear interval 
    socket.on('disconnect', ()=>{
        clearInterval(perfDataInterval);    //if disconnect, stop setInterval (includes reconnect)
    })
});

```

```js
//server/socketMain.js
//Where socket.io listeners and (most) emitters

const socketMain = (io)=>{
    io.on("connection", (socket) => {
      /* ... */
      console.log('SERVER: someone connected on worker: ', process.pid);
      socket.emit('welcome', "SERVER: welcome to our cluster driven socket.io server");

      const auth = socket.handshake.auth;
      const token = auth.token;
      console.log('token: ', token);
      if(token === "sdfsdfsdffdhfhgjghjktry5334543asasd"){
        socket.join('nodeClient');      //client is a nodeClient
      }else if(token ==="jdkfjwjhkwffje"){
        //valid reactClient
        socket.join('reactClient');      //client is a nodeClient
      }else{
        socket.disconnect();
        console.log('YOU HAVE BEEN DISCONNECTED');
      }

      socket.on('perfData', (data)=>{
        console.log(`ticking...${data}`);
      });

    });
}

module.exports = socketMain;
```

## 77 - Create react app
- basic setup of React Create React App.

## 78 - Basic React Component Architecture
- Robert explains the architecture of the components of the react side.
- looks like this:

  - index 
    - App
      - Widget
        - CPU
        - Mem
        - Info

- and then app is where socketConnection happens and any change to the data will cause update/rerenders of the widget and its children

## 79 - Connecting React to socket server (correct way)
- NOTE: there is nothing new other than basic React imports
- this is Roberts way of connecting to the socket server using React until his more advanced method in lesson 80.
- socketConnection.js -> connect to socket server with auth object...
- use connectionTesting/TestApp to test by emitting "testConnection" with a message, 
- socketMain.js should add socket listener for the emitted:  `socket.on('testConnection', (data)=>{})`
- TOTEST: run react-client/
- TOTEST: run server/


```js
//socketConnection.js
import io from 'socket.io-client';

const options = {
   auth: {token: 'jdkfjwjhkwffjeasasccccccs3'}
}

const socket = io.connect('http://localhost:3000', options); //server is at 3000
// socket.on('welcome', (data)=>{
//    console.log('REACT: ', data); 
// });
export default socket;
```

```js
//connectionTesting/TestApp.js
import { useEffect } from "react";
import socket from '../socketConnection';

const TestApp = ()=>{

    useEffect(()=>{
        socket.emit('testConnection', 'am i connected?');
    },[]);

    return <h1>Test app</h1>
}

export default TestApp;
```

```js
//socketMain.js
socket.on('testConnection', (data)=>{
  console.log(data);
});
```

```js
//app.js
import socketConnection from './socketConnection';
function App() {
  return (
    <h1>sanity check</h1>
  );
}
export default App;

```

## 80 - Connecting React to socketio in a complex app
- lesson incomplete, use lesson 79 method.
- in a large codebase, you centralize logic

---

## 81 - getting data to react, setting up react components
- get data from socket server to react
- reset app to use `<App>` and not `<TestApp>` as in lesson 79
- nodeClient emits perfData every second.
- socketMain.js receives this perfData and itself emits to reactClient "room": `io.to('reactClient').emit('perfData', data);`
- in reactClient, setup useState, intially empty {}
- using data.macA as the index in the object: the props of object are set as the macA (mac address): `copyPerfData[data.macA]`

## 82 - sending state to our `<Widget/>`
- pass the relevant data into the Widget and subwidgets

```js
//nodeClient
function App() {
  const [performanceData, setPerformanceData] = useState({}); //an object, using macAddress as the prop 

  useEffect(()=>{
    socket.on('perfData', (data)=>{
      console.log('App: ', data);

      //copy performanceData so we can mutate it
      const copyPerfData = {...performanceData};
      //performanceData is not an array, its an {}
      //this is because we dont know which machine just sent its data,
      //so we can use the macA of the machine as its property in performanceData
      //every tick the data comes through, just overwrite that value
      copyPerfData[data.macA] = data;
      setPerformanceData(copyPerfData);
      
    });
  }, []);//run this once the component has rendered

  const widgets = Object.values(performanceData).map(d=><Widget data={d} key={d.macA}/>); //performanceData stores array of objects whose key is the macA

  return (
    <>
      {widgets}  
    </>
  );

}

```
```js
//widget
//...
const Widget = ({data})=> {

  const {
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
    macA
  } = data;

  const cpuData = {cpuLoad};
  const memData = {freeMem, totalMem, usedMem, memUsage};
  const infoData = {macA, osType, upTime, cpuType, cpuSpeed, numCores};

  //...
  return (
    <>
      <Cpu data={cpuData}/>
      <Mem data={memData}/>
      <Info data={infoData}/>
    </>
  )
}
```
## 83 - ui 
- add bootstrap to react index html head
```html
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
``` 

## 84 CPU widget canvas
- utilities/canvasLoadAnimation.js helper to draw circles (inner and outer ring)

```js
//canvasLoadAnimation.js
const drawCircle = (canvas, currentLoad)=>{
    if(canvas){
        const context = canvas.getContext('2d');
        // Draw Inner Circle
        context.clearRect(0,0,500,500)
        context.fillStyle = "#ccc";
        context.beginPath();
        context.arc(100,100,90,Math.PI*0,Math.PI*2);
        context.closePath();
        context.fill();

        // Draw the outter line
        // 10px wide line
        context.lineWidth = 10;
        if(currentLoad < 20){
            context.strokeStyle = '#00ff00';
        }else if(currentLoad < 40){
            context.strokeStyle = '#337ab7';
        }else if(currentLoad < 60){
            context.strokeStyle = '#f0ad4e';
        }else{
            context.strokeStyle = '#d9534f';
        }
        context.beginPath();
        //because lineWidth is 10, 5px will be inside, 5px will be outside fillCircle above
        //Math.PI * 1.5 -> start at 12o'clock not 3 o'clock
        //draw as much as needed based on current cpu load: `(Math.PI * 2 * currentLoad/100)`
        //+ Math.PI*1.5) make sure its adjusted for 12o'clock
        context.arc(100,100,95,Math.PI*1.5,(Math.PI * 2 * currentLoad/100) + Math.PI*1.5);
        context.stroke();
    }
}

export default drawCircle;

```
## 84 CPU widget
## 85 memory widget


### TROUBLESHOOTING
- npm ERR! enoent ENOENT: no such file or directory, lstat 'C:\Users\lenovo\AppData\Roaming\npm'
- FIX: create the folder... `mkdir %USERPROFILE%\AppData\Roaming\npm`

