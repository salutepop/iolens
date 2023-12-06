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

<div>
<img src='iolens.png' height='40px' />
<div className="plotview-container">

                <PlotView
                    //hyo
                    setBrushedTime={setBrushedTime}
                    brushedTime={brushedTime}
                    data={props.data}
                    gColor={props.gColor}
                    gColorRGBA = {props.gColorRGBA}
                //index
                />
            </div>
</div>


            <div className="vertical-line"/>

            <div className="right-container">

                <SummaryView
                    brushedTime={brushedTime}
                    data={props.data}
                    gColor={props.gColor}
                    gColorRGBA={props.gColorRGBA}
                />
                <CorrelationView
                    brushedTime={brushedTime}
                    data={props.data}
                    gColor={props.gColor}
                    gColorRGBA={props.gColorRGBA}>
                </CorrelationView>
            </div>


        </div>

    )
};
export default MainView;
