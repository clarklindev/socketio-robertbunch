import {useRef} from 'react';
import drawCircle from '../utilities/canvasLoadAnimation';

const Mem = ({data})=>{
    const {freeMem, totalMem, usedMem, memUsage} = data;

    const memRef = useRef();

    const totalMemInGB = Math.floor(totalMem / 1073741824 * 100)/100; // 1073741824 number of bytes in gb (1024 X 1024 X 1024)
    const freeMemInGB = Math.floor(freeMem / 1073741824 * 100)/100; // 1073741824 number of bytes in gb (1024 X 1024 X 1024)

    drawCircle(memRef.current, usedMem * 100);

    return <div className="mem col-3">
        <h3>Memory usage</h3>
        <div className="canvas-wrapper">
            <canvas ref={memRef} width="200" height="200"/>
            <div className="mem-text">{Math.floor(memUsage * 100)}%</div>
        </div>
        <div>
            Total Memory: {totalMemInGB} gb
        </div>
        <div>
            Free Memory: {freeMemInGB} gb
        </div>
    </div>
}
export default Mem;