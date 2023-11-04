import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";


const Summary = (props) => {

    const summarySvg = useRef(null);
    const svgSize_w =  props.size;
    const svgSize_h = props.margin * 2 + props.size;
    const width = props.width;
    const height = props.height;
    const margin = props.margin;
    const data = props.data;
    console.log(width);
    console.log(height);
    console.log(svgSize_w);


    useEffect(() => {


        const svg = d3.select(summarySvg.current);
        // summary box
        data.forEach(d => {
            d.time = parseFloat(d.time);
            d.queue_depth = parseFloat(d.queue_depth);
        });
        const summaryX = 0;
        const summaryY = 0;

        svg.append('rect')
            .attr('x', summaryX)
            .attr('y', summaryY)
            .attr('width', width)
            .attr('height', height)
            .style('fill', 'white')
            .style('stroke', 'gray');

        const avgQueueDepth = d3.mean(data, d => d.queue_depth);

        svg.append('text')
            // .attr('x', width/2)
            .attr('y', height/2)
            // .attr('text-anchor', 'middle')
            // .attr('alignment-baseline', 'middle')
            .style('fill', 'black')
            .text(`Avg Depth: ${avgQueueDepth.toFixed(2)}`);

    }, []);

    return (
        <div>
            <svg ref={summarySvg} width={svgSize_w} height={svgSize_h}>
            </svg>
        </div>
    )
};

export default Summary;
