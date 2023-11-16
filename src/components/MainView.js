import React, { useRef, useEffect, useState } from "react";

import ControlView from './ControlView'
import PlotView from './PlotView';
import SummaryView from './SummaryView';
import { brushSelection } from 'd3';

const MainView = (props) => {

    const [graphVisibility, setGraphVisibility] = useState({
        queue: true,
        throughput: true,
        lba: true,
        latency: true,
    });

    //hyo
    const calc = props.calc;
    const [brushedIndex, setBrushedIndex] = useState([]);
    const [brushedData, setBrushedData] = useState([calc]);
    

    useEffect(() => {

        let indexArray = brushedIndex.map(d => d.idx);
        // console.log("indexArray", indexArray);

        const updatedBrushedData = calc
            .filter(d => indexArray.includes(d.idx))

        // console.log("upbrushedData", updatedBrushedData);
        setBrushedData(updatedBrushedData);




    }, [brushedIndex]);

    const handleCheckboxChange = (graphName) => {
        setGraphVisibility((prevVisibility) => ({
            ...prevVisibility, //현재 상태 복사.
            [graphName]: !prevVisibility[graphName], //토글된것만 flase로 바꿈
        }));
    };

    return (
        <div className='main-container'>
            <ControlView
                stateCheckbox={graphVisibility}
                handleCheckbox={handleCheckboxChange}
            />

            <PlotView
                calc={props.calc}
                throughput={props.throughput}
                stateCheckbox={graphVisibility}
                //hyo
                setBrushedIndex={setBrushedIndex}
                brushedData={brushedData}
            //index
            />

            <div className="right-container">
                <h1>summary</h1>
                <SummaryView
                    brushedData={brushedData}
                />
            </div>
        </div>

    )
};
export default MainView;
