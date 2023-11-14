import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";


const Scatterplot = (props) => {

    const splotSvg = useRef(null);
    const svgSize_w = props.margin * 2 + props.size * 7;
    const svgSize_h = props.margin * 2 + props.size;
    const width = props.size * 7;
    const height = props.size;
    const data = props.data;
    const radius = props.radius;
    const margin = props.margin;

    useEffect(() => {
        
        const svg = d3.select(splotSvg.current);
        console.log(data);
        
        const data_x = data.map((d) => Object.values(d)[0]);
        const data_y = data.map((d) => Object.values(d)[1]);
        console.log(data_x);
        console.log(data_y);
        console.log(d3.min(data_x));

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

        svg.append("g")
            .attr("transform", `translate(${margin}, ${margin})`)
            .selectAll("circle")
            .data(data_x)
            .enter()
            .append("circle")
            .attr("r", radius)
            .attr("cx", (d, i) => xScale(d))
            .attr("cy", (d, i) => yScale(data_y[i]))
            .style("fill", "blue");


    }, []);

    return (
        <div>
            <svg ref={splotSvg} width={svgSize_w} height={svgSize_h}>
            </svg>
        </div>
    )
};

export default Scatterplot;
