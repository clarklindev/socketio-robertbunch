import Cpu from './Cpu';
import Info from './Info';
import Mem from './Mem';

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

    return (
    <>
        <h1>Widget</h1>
        <Cpu data={cpuData}/>
        <Mem data={memData}/>
        <Info data={infoData}/>
    </>
    );
}
export default Widget;