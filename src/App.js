import React, { useState } from 'react';
import './App.css';
import Queueplot from './components/Queueplot';
import Throughputplot from './components/Throughputplot';
import LBAplot from './components/LBAplot';
import Latencyplot from './components/Latencyplot';
import Summary from './components/Summary';


//import data
import queue from "./data/queue.json";
import latency from "./data/latency.json";
import LBA from "./data/LBA.json";
import throughput from "./data/throughput.json";

function App() {
  const mainWidth = 200;
  const margin = 20;
  const radius = 0.5;
  const summaryWidth = 100;
  const summaryHeight = 100;
  

  
  const [graphVisibility, setGraphVisibility] = useState({
    queue: true,
    throughput: true,
    lba: true,
    latency: true,
  });

  
  const handleCheckboxChange = (graphName) => {
    setGraphVisibility((prevVisibility) => ({
      ...prevVisibility, //현재 상태 복사.
      [graphName]: !prevVisibility[graphName], //토글된것만 flase로 바꿈
    }));
  };

  return (
    

    <div className="App">
      <div className="left-container">
          <h1 style={{marginRight: 5}}>
            {"Control box"}
        </h1>
          <label>&nbsp;</label>
        <div class="checkboxContainer">
          
          <input
            type="checkbox"
            checked={graphVisibility.queue}
            onChange={() => handleCheckboxChange('queue')}
            />
          <label>Queue depth</label>
        </div>
        <div class="checkboxContainer">
          
          <input
            type="checkbox"
            checked={graphVisibility.throughput}
            onChange={() => handleCheckboxChange('throughput')}
          />
          <label>Throughput </label>
        </div>
        <div class="checkboxContainer">
          
          <input
            type="checkbox"
            checked={graphVisibility.latency}
            onChange={() => handleCheckboxChange('latency')}
          />
          <label>Latency </label>
        </div>
        <div class="checkboxContainer">
        
          <input
            type="checkbox"
            checked={graphVisibility.lba}
            onChange={() => handleCheckboxChange('lba')}
          />
          <label>LBA </label>
        </div>
      </div>

      <div className="center-container">

        <div class="splotContainer">
        {graphVisibility.queue && ( //graphvisivility가 참이면 랜더링, 거짓이면 렌더링 안됨.
          <Queueplot size={mainWidth} data={queue} margin={margin} radius={radius} />
        )}
        </div>
      
        <div class="splotContainer">
        {graphVisibility.throughput && (
          <Throughputplot size={mainWidth} data={throughput} margin={margin} radius={radius} />
        )}
        </div>

        <div class="splotContainer">
        {graphVisibility.latency && (
          <Latencyplot size={mainWidth} data={latency} margin={margin} radius={radius} />
        )}
        </div>

        <div class="splotContainer">
        {graphVisibility.lba && (
          <LBAplot size={mainWidth} data={LBA} margin={margin} radius={radius} />
        )}
        </div>
          
      </div>

      <div className="right-container">
        
          <h1>summary</h1>
        <Summary 

          size={mainWidth}
          width={summaryWidth}
          height={summaryHeight}
          data={queue}
          margin={margin}
        />
    
      </div>

    </div>

  );
}

export default App;

