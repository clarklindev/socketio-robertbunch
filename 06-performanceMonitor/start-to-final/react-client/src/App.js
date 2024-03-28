import {useEffect, useState} from 'react';

import socket from './utilities/socketConnection';
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
  }, [performanceData]);//run this once the component has rendered

  const widgets = Object.values(performanceData).map(d=><Widget data={d} key={d.macA}/>); //performanceData stores array of objects whose key is the macA

  return (
    <div className="container">
      {widgets}
    </div>
  );
}

export default App;
