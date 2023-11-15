import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

import data from '../data/fio_calc.json'

// TODO
// connect parent's data (현재 변수명 : latencyArray)
// bind nbin to user input (zoom slider 10 ~ 1000)

const Histogramplot = (props) => {
    const svgHist = useRef(null);
    const svgMargin = 40;
    const plotSize = 200;
    const svgHeight = plotSize + svgMargin * 2;
    const svgWidth = plotSize + svgMargin * 2;

    const latencyArray = data.map(d=>d.latency / 1000);
    let nbin = 100;

    useEffect(() => {
        const maxLatency = d3.max(latencyArray)

        // console.log(d3.min(latencyArray))
        let xScale = d3.scaleLinear()
                        .domain([0, maxLatency])
                        .range([svgMargin, plotSize + svgMargin]);
        xScale.ticks(nbin);
        
        d3.select(svgHist.current)
            .append('g')
            .attr('transform', `translate(${0},${plotSize + svgMargin})`)
            .call(d3.axisBottom(xScale));
        let hist = d3.bin()
            .value(d => d)
            .domain(xScale.domain())
            .thresholds(xScale.ticks(nbin));

        let bins = hist(latencyArray);
        let yScale = d3.scaleLinear()
                        .domain([0, d3.max(bins.map(d=>d.length))])
                        .range([plotSize, 0]);
        d3.select(svgHist.current)
            .append('g')
            .attr('transform', `translate( ${svgMargin}, ${svgMargin})`)
            .call(d3.axisLeft(yScale));
        

        // console.log(bins)
        console.log(bins.map(d=>d.length))
        d3.select(svgHist.current)
            .append('g')
            .selectAll('rect')
            .data(bins)
            .join(
                enter => enter
                            .append('rect')
                            .attr('x', 0)
                            .attr('y', svgMargin)
                            .attr('transform', d => `translate(${xScale(d.x0)},${yScale(d.length)})`)
                            .attr('width', d => xScale(d.x1) - xScale(d.x0))
                            .attr('height', d => plotSize - yScale(d.length))
                            .style('fill', 'blue'),
                update => update,
                exit => exit.remove()
            )

        

        d3.select(svgHist.current)
            .append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', svgWidth)
            .attr('height', svgHeight)
            .attr('fill', 'none')
            .attr('stroke', 'red');
    }, [])

    return (
        <div>
            <h1>HistogramPlot!</h1>
            <svg ref={svgHist} height={svgHeight} width={svgWidth}>

            </svg>
        </div>
    )
};

export default Histogramplot