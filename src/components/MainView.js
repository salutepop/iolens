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
        cpu_user: true,
        cpu_system: true,
        mem_free: true,
    });

    //hyo
    const calc = props.calc;
    const heatmap_count = props.heatmap_count;
    const defaultIndex = calc.map(d=>d.idx);
    const [brushedData, setBrushedData] = useState(calc);
    const [brushedIndex, setBrushedIndex] = useState(defaultIndex);


    useEffect(() => {
        let indexArray = brushedIndex.map(d => d.idx);
        // console.log("indexArray", indexArray);

        const updatedBrushedData = calc
            .filter(d => indexArray.includes(d.idx))
        // console.log("upbrushedData", updatedBrushedData);
        setBrushedData(updatedBrushedData);

        // console.log(brushedData)
        // console.log(brushedIndex)
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
                handleCheckboxChange={handleCheckboxChange}
            />
            <hr color="black"/>
            <div className="plotview-container">
                <PlotView
                    calc={props.calc}
                    throughput={props.throughput}
                    resource={props.resource}
                    stateCheckbox={graphVisibility}
                    //hyo
                    heatmap_count={heatmap_count}
                    setBrushedIndex={setBrushedIndex}
                    brushedData={brushedData}
                //index
                />

                <div className="right-container">
                    <h1 className='header'>Summary</h1>
                    <SummaryView
                        brushedData={brushedData}
                    />
                </div>
            </div>
        </div>

    )
};
export default MainView;
