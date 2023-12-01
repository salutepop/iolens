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
    const [brushedTime, setBrushedTime] = useState([]);

    useEffect(() => {

    }, [brushedTime]);

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
            <hr color="black" />
            <div className="plotview-container">
                <PlotView
                    stateCheckbox={graphVisibility}
                    //hyo
                    setBrushedTime={setBrushedTime}
                    brushedTime={brushedTime}
                    data={props.data}
                //index
                />

                <div className="right-container">
                    <h1 className='header'>Summary</h1>
                    {/* <SummaryView
                        brushedTime={brushedTime}
                        data={props.data}
                    /> */}
                    <CorrelationView
                        brushedTime={brushedTime}
                        data={props.data}>
                    </CorrelationView>
                </div>
            </div>
        </div>

    )
};
export default MainView;
