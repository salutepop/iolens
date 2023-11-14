import React, { useState } from 'react';


import Summary from './SummaryView';
import ControlView from './ControlView'
import PlotView from './PlotView';

const MainView = (props) => {


    
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
        <div className='main-container'>
            <ControlView
                stateCheckbox = {graphVisibility}
                handleCheckbox = {handleCheckboxChange}
            />

            <PlotView
                data = {props}
                stateCheckbox = {graphVisibility}
            />

            <div className="right-container">
                <h1>summary</h1>
                <Summary
                    data={props.queue}
                />
            </div>
        </div>

    )
};
export default MainView;
