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

## react
- robert uses Create react app: `npx create-react-app react-client`

### TROUBLESHOOTING
- npm ERR! enoent ENOENT: no such file or directory, lstat 'C:\Users\lenovo\AppData\Roaming\npm'
- FIX: create the folder... `mkdir %USERPROFILE%\AppData\Roaming\npm`

