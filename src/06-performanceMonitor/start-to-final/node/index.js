//node program that captures local performance data
//and sends it via socket to the server
//requires: socket.io-client
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
        const perfData = await performanceLoadData()  //function returns a promise, but with await it equals the resolve() value
        perfData.macA = macA;   //append mac address
        socket.emit('perfData', perfData);
    }, 1000);

    socket.on('disconnect', ()=>{
        clearInterval(perfDataInterval);    //if disconnect, stop setInterval (includes reconnect)
    });
});

//NOTE: functions are hoisted, expressions are not...

//what do we need to know FROM NODE about performance?

// const cpus = os.cpus(); //all cpus as an array (snapshot of now..)
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
const getCpuLoad = ()=> new Promise((resolve, reject)=>{
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

    // const avg = cpuAverage();
    // console.log(avg);
    
});


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
    //cpu type
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

    
    //test it works.
    // setInterval(()=>{
    //     getCpuLoad();
    // }, 1000);
});

//example:
// const run = async ()=>{
//     const data = await performanceLoadData();
//     console.log(data);
// }
// run();
