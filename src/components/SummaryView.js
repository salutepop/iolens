import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

import Histogramplot from "./Histogramplot";
const SummaryView = (props) => {
    const summarySvg = useRef(null);
    const svgMargin = 30;
    const textWidth = 250;
    const lineHeight = 30;
    const svgHeight = lineHeight * 4 + 2 *svgMargin;
    const svgWidth = textWidth + svgMargin * 2;
    const brushedTime = props.brushedTime;

    useEffect(() => {
        const textlines = [];

        // KB/s -> MB/s
        let throughput = d3.sum(brushedTime.map(d => d.size))
            / (d3.max(brushedTime.map(d => d.comp_time))
                - d3.min(brushedTime.map(d => d.comp_time)))
            / 1024

        let avgQueue = d3.mean(brushedTime.map(d => d.queue_cnt))

        // us -> ms
        let latency_95 = d3.quantile(brushedTime.map(d => d.latency), 0.95)
            / 1000
        let latency_99 = d3.quantile(brushedTime.map(d => d.latency), 0.99)
            / 1000
        let latency_9999 = d3.quantile(brushedTime.map(d => d.latency), 0.9999)
            / 1000
            
        // 6 가지
        // throughput / avg Queue depth / max latency
        // max cpu util / max mem util / avg space
        textlines.push(`Throughput: ${Math.round(throughput * 100) / 100} MB/s`)
        textlines.push(`Avg. Queue: ${Math.round(avgQueue * 100) / 100}`)
        textlines.push(`Lat-95.00%: ${Math.round(latency_95 * 100) / 100} ms`)
        textlines.push(`Lat-99.00%: ${Math.round(latency_99 * 100) / 100} ms`)
        textlines.push(`Lat-99.99%: ${Math.round(latency_9999 * 100) / 100} ms`)

        d3.select(summarySvg.current)
            .selectAll('text')
            .data(textlines)
            .join(
                enter => enter
                    .append('text')
                    .text(textline => textline)
                    .attr('x', textWidth * 0.1)
                    .attr('y', (textline, i) => {
                        return lineHeight * i + svgMargin;
                    })
                    .style('font-family','monospace')
                    .attr('fill', 'black')
                    .attr('text-anchor', 'start')
                    .attr('textbaseline', 'bottom')
                    .attr('font-size', '22px'),
                update => update
                    .text(textline => textline),
                exit => exit.remove(),
            )


        const summaryX = 0;
        const summaryY = 0;

        // d3.select(summarySvg.current)
        //     .append('rect')
        //     .attr('x', summaryX)
        //     .attr('y', summaryY)
        //     .attr('width', svgWidth)
        //     .attr('height', svgHeight)
        //     .style('fill', 'none')
        //     .style('stroke', 'black');

    }, [brushedTime]);

    return (
        <div>
                <svg ref={summarySvg} width={svgWidth} height={svgHeight}>

                </svg>

                <Histogramplot brushedTime={brushedTime} />

        </div>
    )
};

export default SummaryView;
