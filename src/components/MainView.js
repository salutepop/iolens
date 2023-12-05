import React, { useRef, useEffect, useState } from "react";

import PlotView from './PlotView';
import SummaryView from './SummaryView';
import CorrelationView from './CorrelationView';
import { brushSelection } from 'd3';

import Correlationplot from "./Correlationplot";
const MainView = (props) => {
    //hyo
    const [brushedTime, setBrushedTime] = useState([]);


    return (
        <div className='main-container'>


            <div className="right-container">
                <img src='iolens.png' height='50px' />

                {/* <h2 className='header'>Summary</h2> */}
                <SummaryView
                    brushedTime={brushedTime}
                    data={props.data}
                    gColor={props.gColor}
                />
                <CorrelationView
                    brushedTime={brushedTime}
                    data={props.data}
                    gColor={props.gColor}>
                </CorrelationView>
            </div>

            <div className="vertical-line"/>

            <div className="plotview-container">
                <PlotView
                    //hyo
                    setBrushedTime={setBrushedTime}
                    brushedTime={brushedTime}
                    data={props.data}
                    gColor={props.gColor}
                //index
                />
            </div>
        </div>

    )
};
export default MainView;
