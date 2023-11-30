import React, { useRef, useEffect, useState } from "react";
import Correlationplot from './Correlationplot';
import Select from 'react-select';

import * as d3 from "d3";
import { brush } from "d3";

const CorrelationView = (props) => {
    const plotMargin = 20;
    const plotWidth = 1200;
    const scatterPlotHeight = 150;
    const linePlotHeight = 60;
    const radius = 0.5;
    const svgSelectedX = useRef(null);
    const svgSelectedY = useRef(null);
    const viewMargin = 50;
    const [r2, setR2] = useState(0);
    const [selectedX, setSelectedX] = useState({ label: "none", value: "none" });
    const [selectedY, setSelectedY] = useState({ label: "none", value: "none" });
    const parameter = ["lba", "latency", "queue_cnt"];

    const customStyle = {
        menu: (base, state) => ({
            ...base,
            transition: "all .2s ease",
            transform: state.selectProps.menuIsOpen ? "rotate(90deg)" : null
        })
    };

    useEffect(() => {

    })
    return (
        <div>
            <div className="div-corrView">
                <h2>Correlation Plot</h2>
                <div className="div-corrPlot">
                    <Correlationplot
                        useStateR2={[r2, setR2]}
                        useStateX={[selectedX, setSelectedX]}
                        useStateY={[selectedY, setSelectedY]}
                        brushedData={props.brushedData}
                    />
                </div>
                <div className="div-dropdownX">
                    {/* select X */}
                    <Select
                        defaultValue={selectedX}
                        onChange={setSelectedX}
                        options={parameter.map(o => ({
                            label: o,
                            value: o
                        }))} />
                    {/* select Y */}
                </div>
                <div className="div-dropdownY">
                    <Select
                        styles={customStyle}
                        defaultValue={selectedY}
                        onChange={setSelectedY}
                        options={parameter.map(o => ({
                            label: o,
                            value: o
                        }))} />
                </div>
                <label className="label-r2">
                    R^2 = {r2}
                </label>
            </div>





        </div>
    )
}
export default CorrelationView;