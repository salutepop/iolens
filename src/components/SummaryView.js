import React, { useRef, useEffect} from "react";
import * as d3 from "d3";

import Histogramplot from "./Histogramplot";
const SummaryView = (props) => {
    const summarySvg = useRef(null);
    const svgMargin = 20;
    const svgHeight = 200 + svgMargin;
    const svgWidth = 200 + svgMargin;

    const data = props.data;

    // console.log(data)
    useEffect(() => {

        const svg = d3.select(summarySvg.current);
        /*
        data.forEach(d => {
            d.time = parseFloat(d.time);
            d.queue = parseFloat(d.queue_depth);
        });
        */
        
        const summaryX = 0;
        const summaryY = 0;

        svg.append('rect')
            .attr('x', summaryX)
            .attr('y', summaryY)
            .attr('width', svgWidth)
            .attr('height', svgHeight)
            .style('fill', 'white')
            .style('stroke', 'gray');
/*
        const avgQueueDepth = d3.mean(data, d => d.queue);

        svg.append('text')
            // .attr('x', width/2)
            // .attr('y', svgHeight/2)
            .attr('text-anchor', 'middle')
            .attr('alignment-baseline', 'middle')
            .style('fill', 'black')
            .style('textAlign', 'center')
            .text(`Avg Depth: ${avgQueueDepth.toFixed(2)}`);
*/
    }, []);

    return (
        <div>
            <svg ref={summarySvg} width={svgWidth} height={svgHeight}>
            </svg>
            <Histogramplot/>
        </div>
    )
};

export default SummaryView;
