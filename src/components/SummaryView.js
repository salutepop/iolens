import React, { useRef, useEffect} from "react";
import * as d3 from "d3";

import Histogramplot from "./Histogramplot";
const SummaryView = (props) => {
    const summarySvg = useRef(null);
    const svgMargin = 20;
    const svgHeight = 200 + svgMargin;
    const svgWidth = 200 + svgMargin;
    const brushedData = props.brushedData;
    
    const lineHeight = 30;
    
    // console.log(data)
    useEffect(() => {
        let textlines = [];
        // console.log(data)
        let avgQueue, avgLatency;
        // data.map(d=>console.log(d))
        // console.log(data.map(d=>d.idx))
        // avgQueue = d3.mean(data.map(d=>d.queue_cnt))
        // avgLatency = d3.mean(data.map(d=>d.latency))
        textlines.push(`avgQueue: ${avgQueue}`)
        textlines.push(`avgLatency: ${avgLatency}`)
        
        // console.log(avgQueue, avgLatency)
        const svg = d3.select(summarySvg.current);
        svg.append('p')
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
    }, [brushedData]);

    return (
        <div>
            <svg ref={summarySvg} width={svgWidth} height={svgHeight}>
            </svg>
            <Histogramplot brushedData={brushedData}/>
        </div>
    )
};

export default SummaryView;
