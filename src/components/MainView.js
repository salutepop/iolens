import React, { useState } from 'react';

import ControlView from './ControlView'
import PlotView from './PlotView';
import SummaryView from './SummaryView';

const MainView = (props) => {
    
    const [graphVisibility, setGraphVisibility] = useState({
      queue: true,
      throughput: true,
      lba: true,
      latency: true,
    });

    const [brushedIndex, setBrushedIndex] = useState([]);
    
    //index 받아서 계산하는 로직 구현
  
    
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
                calc = {props.calc}
                throughput = {props.throughput}
                stateCheckbox = {graphVisibility}
                //index
            />

            <div className="right-container">
                <h1>summary</h1>
                <SummaryView
                    data={props.fio_calc}
                    //받은 데이터 계산해서 summary로 전달
                />
            </div>
        </div>

    )
};
export default MainView;
