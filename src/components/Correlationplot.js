import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

// import drawData from '../drawData/fio_calc.json'

// TODO
// https://d3-graph-gallery.com/graph/density2d_contour.html

const Correlationplot = (props) => {
    const svgCorr = useRef(null);
    const svgMargin = 30;
    const plotSize = 300;
    const plotMargin = 50;
    const svgHeight = (plotSize + plotMargin * 2) + svgMargin;
    const svgWidth = (plotSize + plotMargin * 2) + svgMargin;
    const radius = 1;

    useEffect(() => {
        // 데이터 바뀌면, 여기 수정 필요
        let drawData =
            props.brushedData.map(d => {
                return { x: parseFloat(d.latency), y: parseFloat(d.queue_cnt) }
            })

        // console.log(d3.min(drawData, d=>d.x), d3.max(drawData, d=>d.x))
        // console.log(d3.min(drawData, d=>d.y), d3.max(drawData, d=>d.y))
        let xMin = d3.min(drawData, d => d.x)
        let xMax = d3.max(drawData, d => d.x)
        let yMin = d3.min(drawData, d => d.y)
        let yMax = d3.max(drawData, d => d.y)
        let xScale = d3.scaleLinear()
            .domain([xMin - (xMax - xMin) * 0.3, xMax])
            .range([0, plotSize]);

        let yScale = d3.scaleLinear()
            .domain([yMin - (yMax - yMin) * 0.3, yMax])
            .range([plotSize, 0]);

        let svgPlot = d3.select(svgCorr.current)
            .attr('transform', `translate(${svgMargin}, ${svgMargin})`)

        // compute the density data
        const densityData = d3
            .contourDensity()
            .x(function (d) {
                return xScale(d.x);
            }) // x and y = column name in .csv input data
            .y(function (d) {
                return yScale(d.y);
            })
            .size([plotSize, plotSize])
            .bandwidth(20)(
                // smaller = more precision in lines = more lines
                drawData
            );

        let thresholds = densityData.map(r => r.value);
        let extents = d3.extent(thresholds);
        extents.push(d3.median(thresholds));
        const color = d3
            .scaleLinear()
            .domain(extents.sort())
            .range(["#4f74b7", "white", "red"]);
        // .interpolate(d => {return interpolateRgb("#4f74b7", "red")})
        // .interpolate(d3.interpolateHcl)

        // Add the contour: several "path"
        svgPlot
            .selectAll("path")
            .data(densityData)
            .join(
                enter => enter
                    .append("path")
                    .attr('transform', `translate(${plotMargin}, ${plotMargin})`)
                    .attr("d", d3.geoPath())
                    .attr("fill", d => color(d.value))
                    .attr("stroke", "#e3e3e3")
                    // .attr("stroke-linejoin", "round")
                    .attr("opacity", 0.3)
                    .attr("stroke-opacity", 0.15),
                update => update
                    .attr("d", d3.geoPath())
                    .attr("fill", d => color(d.value)),
                exit => exit.remove()
            );

        // d3.select(svgCorr.current)
        // .append('g')
        svgPlot
            .selectAll('circle')
            .data(drawData)
            .join(
                enter => enter
                    .append('circle')
                    .attr('transform', `translate(${plotMargin}, ${plotMargin})`)
                    .attr("r", radius)
                    .attr("cx", d => xScale(d.x))
                    .attr("cy", d => yScale(d.y))
                    .style("fill", "blue"),
                update => update
                    .attr("cx", d => xScale(d.x))
                    .attr("cy", d => yScale(d.y)),
                exit => exit.remove()
            )


        // d3.select(svgCorr.current)
        svgPlot
            .append('g')
            .attr('transform', `translate(${plotMargin}, ${plotSize + plotMargin})`)
            .attr('class', 'xAxis');

        // d3.select(svgCorr.current)
        svgPlot
            .select('.xAxis')
            .join(
                enter => enter,
                update => update
                    .call(d3.axisBottom(xScale)),
                exit => exit.remove(),
            );


        // d3.select(svgCorr.current)
        svgPlot
            .append('g')
            .attr('transform', `translate(${plotMargin}, ${plotMargin})`)
            .attr('class', 'yAxis');

        // d3.select(svgCorr.current)
        svgPlot
            .select('.yAxis')
            .join(
                enter => enter,
                update => update
                    .call(d3.axisLeft(yScale)),
                exit => exit.remove(),
            );


        // d3.select(svgCorr.current)
        //     .append('text')
        //     .attr('x', (plotSize + plotMargin * 2) / 2 + svgMargin)
        //     .attr('y', svgHeight)
        //     .style('text-anchor', 'middle')
        //     .style('vertical-align', 'baseline')
        //     .text('Selected X')

        // d3.select(svgCorr.current)
        //     .append('text')
        //     .style('transform', 'rotate(270deg)')
        //     .attr('x', -((plotSize + plotMargin * 2) / 2 + svgMargin))
        //     .attr('y', svgMargin)
        //     .style('text-anchor', 'middle')
        //     // .style('vertical-align', 'baseline')
        //     .text('Selected Y')
        // d3.select(svgCorr.current)
        //     .append('rect')
        //     .attr('x', 0)
        //     .attr('y', 0)
        //     .attr('width', svgWidth)
        //     .attr('height', svgHeight)
        //     .attr('fill', 'none')
        //     .attr('stroke', 'black');


    }, [props.brushedData])

    return (
        <div>
            <svg ref={svgCorr} height={svgHeight} width={svgWidth}>

            </svg>
        </div>
    )
};

export default Correlationplot