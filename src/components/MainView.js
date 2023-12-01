import React, { useRef, useEffect, useState } from "react";

import ControlView from './ControlView'
import PlotView from './PlotView';
import SummaryView from './SummaryView';
import CorrelationView from './CorrelationView';
import { brushSelection } from 'd3';

import Correlationplot from "./Correlationplot";
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
    const top = props.top;
    const heatmap_lba = props.heatmap_lba;
    const heatmap_latency = props.heatmap_latency;
    const heatmap_queue = props.heatmap_queue;

    const defaultIndex = calc.map(d=>d.idx);
    const [brushedData, setBrushedData] = useState(calc);
    const [brushedIndex, setBrushedIndex] = useState(defaultIndex);

    const [brushedSec, setBrushedSec] = useState([]);


    useEffect(() => {
        let indexArray = brushedIndex.map(d => d.idx);
        // console.log("indexArray", indexArray);

        const updatedBrushedData = calc
            .filter(d => indexArray.includes(d.idx))
        // console.log("upbrushedData", updatedBrushedData);
        setBrushedData(updatedBrushedData);

        console.log("brushedsec", brushedSec)
        // console.log("brushedIndex", brushedIndex)
    }, [brushedIndex, brushedSec]);

    const handleCheckboxChange = (graphName) => {
        setGraphVisibility((prevVisibility) => ({
            ...prevVisibility, //현재 상태 복사.
            [graphName]: !prevVisibility[graphName], //토글된것만 flase로 바꿈
        }));
    };

    return (
        <div className='main-container'>
            <CorrelationView brushedData={brushedData}>

            </CorrelationView>
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
                    top={props.top}
                    stateCheckbox={graphVisibility}
                    //hyo
                    heatmap_lba={heatmap_lba}
                    heatmap_latency={heatmap_latency}
                    heatmap_queue={heatmap_queue}
                    setBrushedIndex={setBrushedIndex}
                    brushedData={brushedData}
                    setBrushedSec={setBrushedSec}
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
