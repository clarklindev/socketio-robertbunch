import { useEffect } from "react";
import socket from '../socketConnection';
import SecondTest from "./SecondTest";

const TestApp = ()=>{

    useEffect(()=>{
        socket.emit('testConnection', 'am i connected?');
    },[]);

    return (
    <>
        <h1>Test app</h1>
        <SecondTest/>
    </>
    );

}

export default TestApp;