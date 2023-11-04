import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";


const Throughputplot = (props) => {

    const splotSvg = useRef(null);
    const svgSize_w = props.margin * 2 + props.size*7;
    const svgSize_h = props.margin * 2 + props.size;
    const width = props.size*7;
    const height = props.size;
    const data = props.data;
    const radius = props.radius;
    const margin = props.margin;

    useEffect(() => {
        
        const svg = d3.select(splotSvg.current);

        data.forEach(d => {
            d.time = parseFloat(d.time);
            d.queue_depth = parseFloat(d.queue_depth);
        });

        let xScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.time), d3.max(data, d => d.time)])
            .range([0, width]);

        let yScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.queue_depth), d3.max(data, d => d.queue_depth)])
            .range([height, 0]);

        console.log(d3.min(data, d => d.queue_depth));
        console.log(d3.min(data, d => d.time));

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        svg.append('g')
            .attr('transform', `translate(${margin}, ${height + margin})`)
            .call(xAxis);
        svg.append('g')
            .attr('transform', `translate(${margin}, ${margin})`)
            .call(yAxis);
        svg.append('g')
            .attr('transform', `translate(${margin}, ${margin})`)
            .selectAll('circle')
            .data(data)
            .enter()
            .append('circle')
            .attr('r', radius)
            .attr('cx', d => xScale(d.time))
            .attr('cy', d => yScale(d.queue_depth))
            .attr("class", (d, i) => "element" + i);

    }, []);

    return (
        <div>
            <svg ref={splotSvg} width={svgSize_w} height={svgSize_h}>
            </svg>
        </div>
    )
};

export default Throughputplot;


//링킹

//컨트,롤 박스 
//라인차트

// + 전체 summary 출력
// + 줌, 격자(Grid) -> 조사
