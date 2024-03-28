import {useEffect} from 'react';
import socket from '../socketConnection';

const SecondTest = ()=>{
    useEffect(()=>{
        socket.emit('secondTest', 'datadatadata');
    });

    return <h2>Second Test</h2>
}

export default SecondTest;