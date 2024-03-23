//node program that captures local performance data
//and sends it via socket to the server
//requires: socket.io-client
const os = require('os');

//what do we need to know FROM NODE about performance?

    //cpu load (current)
    const cpus = os.cpus(); //all cpus as an array
    //memory usage
    const usedMem = totalMem - freeMem;
    const memUsage = Math.floor(usedMem / totalMem * 100) / 100;    //2 decimal places
    //total
    const totalMem = os.totalmem(); //bytes   
    //free
    const freeMem = os.freemem();//bytes
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

