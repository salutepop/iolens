import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";


const Lineplot = (props) => {

    const splotSvg = useRef(null);

    const width = props.width;
    const height = props.height;
    const data = props.data;
    const margin = props.margin;

    const svgWidth = margin * 2 + width;
    const svgHeight = margin * 2 + height;

    let brushedData = props.brushedData;
    useEffect(() => {

        const svg = d3.select(splotSvg.current);
        // console.log(data);
        const brushedX = brushedData.map(d => d.issue_time)
        let minX = d3.min(brushedX)
        let maxX = d3.max(brushedX)
        let rectWidth = maxX - minX;
        // console.log("min", d3.min(brushedX));
        // console.log("max", d3.max(brushedX));


        const data_x = data.map((d) => Object.values(d)[0]);
        const data_y = data.map((d) => Object.values(d)[1]);
        // console.log(data_x);
        // console.log(data_y);
        // console.log(d3.min(data_x));

        let xScale = d3.scaleLinear()
            .domain([d3.min(data_x), d3.max(data_x)])
            .range([0, width]);

        let yScale = d3.scaleLinear()
            .domain([d3.min(data_y), d3.max(data_y)])
            .range([height, 0]);

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        svg.append('g')
            .attr('transform', `translate(${margin}, ${height + margin})`)
            .call(xAxis);
        svg.append('g')
            .attr('transform', `translate(${margin}, ${margin})`)
            .call(yAxis);
        
        const line = d3.line()
            .x((d, i) => xScale(data_x[i]))
            .y((d, i) => yScale(data_y[i]));

        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", 1.0)
            .attr("d", line);

            svg.append('rect')
            .attr("x", xScale(minX))
            .attr("y", -margin)
            .attr("width", xScale(maxX) - xScale(minX))
            .attr("height", svgHeight)
            .style("fill", "rgba(255, 0, 0, 0.5)"); 
        
        // svg.select('rect').remove();
        svg.selectAll('rect')
            .join(
                enter => enter,
                update => update
                    .attr("x", xScale(minX))
                    .attr("y", -margin)
                    .attr("widht", xScale(maxX) - xScale(minX))
                    .attr("height", svgHeight)
                    .style("fill", "rgba(255, 0, 0, 0.5)")
                    ,
                exit => exit.remove()
            )
        // svg.append('rect')
        //     .attr("x", xScale(minX))
        //     .attr("y", -margin)
        //     .attr("width", xScale(maxX) - xScale(minX))
        //     .attr("height", svgHeight)
        //     .style("fill", "rgba(255, 0, 0, 0.5)"); 
        
        
    }, [brushedData]);

    return (
        <div>
            <svg ref={splotSvg} width={svgWidth} height={svgHeight}>
            </svg>
        </div>
    )
};

export default Lineplot;
