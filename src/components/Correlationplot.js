import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import Statistics from "statistics.js";

// import drawData from '../drawData/fio_calc.json'

// TODO
// https://d3-graph-gallery.com/graph/density2d_contour.html

const Correlationplot = (props) => {
    const gColor = props.gColor;
    const gColorRGBA = props.gColorRGBA;
    const svgCorr = useRef(null);
    const plotSize = props.plotSize;
    const plotMargin = props.plotMargin;
    const svgHeight = (plotSize + plotMargin * 2);
    const svgWidth = (plotSize + plotMargin * 2);
    const radius = 1;
    const data = props.data
    let brushedTime = props.brushedTime;

    useEffect(() => {
        // BrushedTime 수정하면 같이 바꿀 것!

        d3.select(svgCorr.current)
            .append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', svgWidth)
            .attr('height', svgHeight)
            .attr('fill', 'none')
            .attr('stroke', 'gray')

        let sel_X = props.useStateX[0].value;
        let sel_Y = props.useStateY[0].value;

        // 데이터 바뀌면, 여기 수정 필요
        let drawData = []

        if ((sel_X === 'none') || (sel_Y === 'none'))
            return

        let data_x = {}
        let data_y = {}

        // data X
        switch (sel_X) {
            case "throughput":
                data["throughput"].forEach((d) => {
                    data_x[d.time] = d.throughput
                });
                break;
            case "sys memory free":
                data['top'].forEach((d) => {
                    data_x[d.time] = d.mem_free
                });
                break;
            case "sys memory used":
                data['top'].forEach((d) => {
                    data_x[d.time] = d.mem_used
                });
                break;
            case "sys memory buffer":
                data['top'].forEach((d) => {
                    data_x[d.time] = d.mem_buff
                });
                break;
            case "fs space util.":
                data['f2fs_status'].forEach((d) => {
                    data_x[d.time] = d.util
                });
                break;
            case "fs memory util.":
                data['f2fs_status'].forEach((d) => {
                    data_x[d.time] = d.memory
                });
                break;
            case "free segments":
                data['f2fs_status'].forEach((d) => {
                    data_x[d.time] = d.seg_free
                });
                break;
            case "valid segments":
                data['f2fs_status'].forEach((d) => {
                    data_x[d.time] = d.seg_valid
                });
                break;
            case "dirty segments":
                data['f2fs_status'].forEach((d) => {
                    data_x[d.time] = d.seg_dirty
                });
                break;
            default:
                return;
        }

        // data Y
        switch (sel_Y) {
            case "throughput":
                data["throughput"].forEach((d) => {
                    data_y[d.time] = d.throughput
                });
                break;
            case "sys memory free":
                data['top'].forEach((d) => {
                    data_y[d.time] = d.mem_free
                });
                break;
            case "sys memory used":
                data['top'].forEach((d) => {
                    data_y[d.time] = d.mem_used
                });
                break;
            case "sys memory buffer":
                data['top'].forEach((d) => {
                    data_y[d.time] = d.mem_buff
                });
                break;
            case "fs space util.":
                data['f2fs_status'].forEach((d) => {
                    data_y[d.time] = d.util
                });
                break;
            case "fs memory util.":
                data['f2fs_status'].forEach((d) => {
                    data_y[d.time] = d.memory
                });
                break;
            case "free segments":
                data['f2fs_status'].forEach((d) => {
                    data_y[d.time] = d.seg_free
                });
                break;
            case "valid segments":
                data['f2fs_status'].forEach((d) => {
                    data_y[d.time] = d.seg_valid
                });
                break;
            case "dirty segments":
                data['f2fs_status'].forEach((d) => {
                    data_y[d.time] = d.seg_dirty
                });
                break;
            default:
                return;
        }

        if (brushedTime.length == 0) {
            Object.keys(data_x).forEach((time) => {
                if (data_y[time] != null) {
                    drawData.push({ x: data_x[time], y: data_y[time] })
                }
            })
        }
        else {
            brushedTime.map(time => {
                if ((data_x[time] != null)
                    && (data_y[time] != null)) {
                    drawData.push({ x: data_x[time], y: data_y[time] })
                }
            })
        }

        if (drawData.length === 0)
            return

        // console.log(drawData)
        let selVars = { x: 'metric', y: 'metric' };

        let stats = new Statistics(drawData, selVars);
        let cef = stats.correlationCoefficient('x', 'y').correlationCoefficient;
        let r2 = (cef * cef).toFixed(2);
        // call setStateR2()
        props.useStateR2[1](r2)


        // console.log(drawData, d=>d.x)
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

        let svgPlot = d3.select(svgCorr.current);

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
        // console.log(gColor)
        const color = d3
            .scaleLinear()
            .domain(extents.sort())
            .range([gColorRGBA[0], gColorRGBA[1]]);
        // .interpolate(d => {return interpolateRgb("#4f74b7", "red")})
        // .interpolate(d3.interpolateHcl)

        // Add the contour: several "path"
        svgPlot
            .selectAll(".contourPath")
            .data(densityData)
            .join(
                enter => enter
                    .append("path")
                    .attr('class', 'contourPath')
                    .attr('transform', `translate(${plotMargin}, ${plotMargin})`)
                    .attr("d", d3.geoPath())
                    .attr("fill", d => color(d.value))
                    // .attr("stroke", "#e3e3e3"),
                    // .attr("stroke-linejoin", "round")
                    .attr("opacity", 0.4)
                    .attr("stroke-opacity", 0.15)
                    ,
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
                    .style("fill", "black")
                    .style("opacity", "0.4")
                    ,
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

    }, [props.brushedTime, props.useStateY, props.useStateX])

    return (
        <div>
            <svg ref={svgCorr} height={svgHeight} width={svgWidth}>

            </svg>
        </div>
    )
};

export default Correlationplot