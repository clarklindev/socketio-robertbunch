import {useEffect, useState} from 'react';

import socket from './socketConnection';
import Widget from './perfDataComponents/Widget';

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

  return (
    <Widget/>
  );
}

export default App;
