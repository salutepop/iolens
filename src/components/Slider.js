import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

const Slider = (props) => {
    const svgSlider = useRef(null);
    useEffect(()=>{
        d3.select(svgSlider.current)
            .append('g')
            .call(d3.slider())

    }, [])
    return (
        <div>
            <svg ref={svgSlider} width='300' height='200'>
            </svg>
        </div>
    )
}

export default Slider;