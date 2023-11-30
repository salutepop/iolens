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

    const [selectedX, setSelectedX] = useState({ label: "none", value: "none" });
    const [selectedY, setSelectedY] = useState({ label: "none", value: "none" });
    const parameter = ["lba", "latency(us)", "queue_cnt"];

    useEffect(() => {
        d3.select(svgSelectedX.current)
            .attr('transform', `translate(${viewMargin}, ${viewMargin})`)

    })
    return (
        <div>
            <div>
                <h2>
                    {"Correlation View"}
                </h2>
                <div className="dropdown-corr">
                    <Select

                        defaultValue={selectedX}
                        onChange={setSelectedX}
                        options={parameter.map(o => ({
                            label: o,
                            value: o
                        }))} />
                    <Select
                        defaultValue={selectedY}
                        onChange={setSelectedY}
                        options={parameter.map(o => ({
                            label: o,
                            value: o
                        }))} />
                </div>

                <Correlationplot
                    useStateX={[selectedX, setSelectedX]}
                    useStateY={[selectedY, setSelectedY]}
                    brushedData={props.brushedData}
                />
            </div>


        </div>
    )
}
export default CorrelationView;