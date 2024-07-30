import { useEffect, useState } from 'react';
import Cpu from './Cpu';
import Info from './Info';
import Mem from './Mem';
import "./widget.css";
import socket from '../utilities/socketConnection';

const Widget = ({data})=> {

    const [isAlive, setIsAlive] = useState(true);

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

    const notAliveDiv = !isAlive ? <div className="not-active">Offline</div>:<></>;

    useEffect(()=>{
        socket.on('connectedOrNot', ({isAlive, machineMacAddress})=>{
            //connectedOrNot does NOT mean THIS client has disconnected (or reconnected)
            //it is for one of the nodeClients that is ticking
            //we need a new event for that, because that nodeClient has stopped ticking
            if(machineMacAddress === macA){
                setIsAlive(isAlive);    //true or false, update isAlive
            }
        });
    
    },[macA]);

    return (
    <div className="widget row justify-content-evenly">
        <h1>Widget</h1>
        {notAliveDiv}
        <Cpu data={cpuData}/>
        <Mem data={memData}/>
        <Info data={infoData}/>
    </div>
    );
}
export default Widget;