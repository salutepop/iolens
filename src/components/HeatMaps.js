import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";


const HeatMaps = (props) => {

    const splotSvg = useRef(null);

    const width = props.width;
    const height = props.height;
    const data = props.data;
    const margin = props.margin;

    const svgWidth = margin * 2 + width;
    const svgHeight = margin * 2 + height;


    //hyo
    // const [Index, setIndex] = useState([]);

    useEffect(() => {

        const svg = d3.select(splotSvg.current);


        data.forEach((d, i) => {

            d.x = parseFloat(d.sec)
            d.y = parseFloat(d.lba);
            d.value = parseFloat(d.count)
            console.log("d.value", d.value)

        })



        let xScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.x), d3.max(data, d => d.x)])
            .range([0, width]);

        let yScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.y), d3.max(data, d => d.y)])
            .range([height, 0]);


        svg.append("g")
            .attr('transform', `translate(${margin}, ${height + margin})`)
            .call(d3.axisBottom(xScale))

        let bandwidth = d3.max(data, d => d.x) - d3.min(data, d => d.x);

        svg.append("g")
            .attr('transform', `translate(${margin}, ${margin})`)
            .call(d3.axisLeft(yScale).ticks(10))
            

        const myColor = d3.scaleLinear()
            // .range(["lightgreen", "#69b3a2"])
            .range(["white", "lightblue", "blue"])
            .domain([0, d3.min(data, d => d.value) + 1, d3.max(data, d => d.value)])
        // console.log("count", d3.min(data_value)+1)


        // console.log("height", height/10)
        // console.log("width", width/bandwidth)
        
        

        svg.append("g")
            // .attr("transform", `translate(${margin}, ${margin})`)
            .attr("transform", `translate(${margin}, ${margin - (height / 20)})`)
            .selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr("x", d => xScale(d.x))
            .attr("y", d => yScale(d.y))
            .attr("width", width / bandwidth)
            .attr("height", height / 20)
            .style("stroke-width", "0")
            .attr("stroke", function (d) { return myColor(d.value) })
            .attr("opacity", function (d) { if(d.value === 0) return 0})
            .style("fill", function (d) { return myColor(d.value) })
            

        // .style("fill", "blue")
        svg.append("rect")
        .attr("x", xScale(1050))
        .attr("y", yScale(2621378))
        .attr("width", width / 100)
        .attr("height", height / 20)
        .attr("fill", "red")
        .style("stroke-width", "0")
        // .attr("opacity", "0")
        .attr("transform", `translate(${margin  }, ${margin - (height / 20)})`)

        // data.forEach((d, i) => {
        //    console.log("color", d.y )
        // })

    }, []);

    return (
        <div className='innerplot-container'>
            <svg ref={splotSvg} width={svgWidth} height={svgHeight}>
            </svg>
        </div>
    )
};

export default HeatMaps;
