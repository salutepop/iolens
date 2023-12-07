import React, { useRef, useEffect, useState } from "react";
import Correlationplot from './Correlationplot';
import Select from 'react-select';

import * as d3 from "d3";
import { brush } from "d3";

const CorrelationView = (props) => {
    const gColor = props.gColor;
    const gColorRGBA = props.gColorRGBA;
    
    const plotMargin =45;
    const plotSize = 250;
    const [r2, setR2] = useState(0);
    const [selectedX, setSelectedX] = useState({ label: "none", value: "none" });
    const [selectedY, setSelectedY] = useState({ label: "none", value: "none" });
    const parameter = ["throughput", 
            "sys memory free", "sys memory used", "sys memory buffer",
            "fs space util.", "fs memory util.",
            "free segments", "valid segments", "dirty segments",
        ];

    const customStyle = {
        menu: (base, state) => ({
            ...base,
            transform: state.selectProps.menuIsOpen ? "rotate(90deg)" : null
        })
    };

    // useEffect(() => {

    // })
    return (
        <div>
            <div className="div-corrView">
                <h2 className="h2-corr">Correlation</h2>
                <div className="div-corrPlot">
                    <Correlationplot
                        plotSize={plotSize}
                        plotMargin={plotMargin}
                        useStateR2={[r2, setR2]}
                        useStateX={[selectedX, setSelectedX]}
                        useStateY={[selectedY, setSelectedY]}
                        brushedTime={props.brushedTime}
                        data={props.data}
                        gColor={props.gColor}
                        gColorRGBA={gColorRGBA}
                    />
                </div>
                <div className="div-dropdownX">
                    {/* select X */}
                    <Select
                        menuPlacement="auto"

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
                        }))}
                        menuPlacement="auto"
                        />
                </div>
                <label className="label-r2">
                    R^2 = {r2}
                </label>
            </div>
        </div>
    )
}
export default CorrelationView;