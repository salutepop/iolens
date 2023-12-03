import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
// TODO


const Radarplot = (props) => {
    const svgRadar = useRef(null);
    const svgMargin = 30;
    const plotSize = 250;
    const svgHeight = plotSize + svgMargin * 3;
    const svgWidth = plotSize + svgMargin * 3;


    useEffect(() => {
    }, [props.brushedTime])

    return (
        <div>
            <svg ref={svgRadar} height={svgHeight} width={svgWidth}>

            </svg>
        </div>
    )
};
