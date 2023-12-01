import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

import data from '../data/fio_calc.json'

// TODO
// connect parent's data (현재 변수명 : latencyArray)
// bind nbin to user input (zoom slider 10 ~ 1000)

const Histogramplot = (props) => {
    const svgHist = useRef(null);
    const svgMargin = 30;
    const plotSize = 250;
    const svgHeight = plotSize + svgMargin * 3;
    const svgWidth = plotSize + svgMargin * 3;

    let nbin = 100;

    useEffect(() => {
        const latencyArray = props.brushedTime.map(d => d.latency / 1000);
        const maxLatency = d3.max(latencyArray)

        // console.log(d3.min(latencyArray))
        let xScale = d3.scaleLinear()
            .domain([0, maxLatency])
            .range([svgMargin * 2, plotSize + svgMargin]);
        xScale.ticks(nbin);

        d3.select(svgHist.current)
            .append('g')
            .attr('transform', `translate(${0},${plotSize + svgMargin})`)
            .attr('class', 'xAxis');

        d3.select(svgHist.current)
            .select('.xAxis')
            .join(
                enter => enter,
                update => update
                    .call(d3.axisBottom(xScale)),
                exit => exit.remove(),
            )

        let hist = d3.bin()
            .value(d => d)
            .domain(xScale.domain())
            .thresholds(xScale.ticks(nbin));

        let bins = hist(latencyArray);
        let yScale = d3.scaleLinear()
            .domain([0, d3.max(bins.map(d => d.length))])
            .range([plotSize, 0]);

        d3.select(svgHist.current)
            .append('g')
            .attr('transform', `translate( ${svgMargin * 2}, ${svgMargin})`)
            .attr('class', 'yAxis');

        d3.select(svgHist.current)
            .select('.yAxis')
            .join(
                enter => enter,
                update => update
                    .call(d3.axisLeft(yScale)),
                exit => exit.remove(),
            );

        d3.select(svgHist.current)
            // .append('g')
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
                    .style('fill', 'blue')
                    .style('stroke-width', '0'),
                update => update
                    .attr('transform', d => `translate(${xScale(d.x0)},${yScale(d.length)})`)
                    .attr('width', d => xScale(d.x1) - xScale(d.x0))
                    .attr('height', d => plotSize - yScale(d.length)),
                exit => exit.remove()
            )

            d3.select(svgHist.current)
            .append('text')
            .attr('x', svgWidth/2)
            .attr('y', svgHeight - svgMargin)
            .style('text-anchor', 'middle')
            .style('vertical-align', 'baseline')
            .text('Latency (ms)')

            d3.select(svgHist.current)
            .append('text')
            .style('transform', 'rotate(270deg)')
            .attr('x', -(plotSize + svgMargin * 2)/2)
            .attr('y', svgMargin)
            .style('text-anchor', 'middle')
            // .style('vertical-align', 'baseline')
            .text('Counts')
        // d3.select(svgHist.current)
        //     .append('rect')
        //     .attr('x', 0)
        //     .attr('y', 0)
        //     .attr('width', svgWidth)
        //     .attr('height', svgHeight)
        //     .attr('fill', 'none')
        //     .attr('stroke', 'black');
    }, [props.brushedTime])

    return (
        <div>
            <svg ref={svgHist} height={svgHeight} width={svgWidth}>

            </svg>
        </div>
    )
};

export default Histogramplot