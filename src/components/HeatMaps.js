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
        // console.log("data", data)
        const svg = d3.select(splotSvg.current);
        const myGrounps = [2621378, 5242756, 7864134, 10485512, 13106890, 15728268, 18349646, 20971024, 23592402, 26213780, 28835158, 31456536, 34077914, 36699292, 39320670, 41942048, 44563426, 47184804, 49806182, 52427560]
        const yVars = new Set;

        
        data.forEach((d, i) => {
            
            d.x = parseFloat(d.sec)
            d.y = parseFloat(d.value_y);
            d.value = parseFloat(d.count)
            // console.log("d.value", d.value)
            
        })
        data.forEach((d,i) => {
          yVars.add(d.value_y)
        })
        const yVarsArray = Array.from(yVars);
        const yLength = yVarsArray.length;
  
        let xScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.x), d3.max(data, d => d.x)])
            .range([0, width]);



        let yScale2 = d3.scaleBand()
        .domain(yVarsArray)
        .range([height, 0]);


        svg.append("g")
            .attr('transform', `translate(${margin}, ${height + margin})`)
            .call(d3.axisBottom(xScale))

        let bandwidth = d3.max(data, d => d.x) - d3.min(data, d => d.x);

        svg.append("g")
            .attr('transform', `translate(${margin}, ${margin})`)
            .call(d3.axisLeft(yScale2))
            

        const myColor = d3.scaleLinear()
            // .range(["lightgreen", "#69b3a2"])
            .range(["white", "lightblue", "blue"])
            .domain([0, d3.min(data, d => d.value) + 1, d3.max(data, d => d.value)])
        // console.log("count", d3.min(data_value)+1)
        
        svg.append("g")
            // .attr("transform", `translate(${margin}, ${margin})`)
            .attr("transform", `translate(${margin}, ${margin })`)
            .selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr("x", d => xScale(d.x))
            .attr("y", d => yScale2(String(d.y)))
            .attr("width", width / bandwidth)
            .attr("height", height / yLength)
            .style("stroke-width", "0")
            .attr("stroke", function (d) { return myColor(d.value) })
            .attr("opacity", function (d) { if(d.value === 0) return 0})
            .style("fill", function (d) { return myColor(d.value) })
            
            
            
        //rect
        // svg.append("rect")
        // .attr("x", xScale(1034))
        // .attr("y", yScale2("2621378"))
        // .attr("width", width / 100)
        // .attr("height", height / 20)
        // .attr("fill", "red")
        // .style("stroke-width", "0")
        // .attr("transform", `translate(${margin  }, ${margin })`)
        
        
        
        

    }, []);

    return (
        <div className='innerplot-container'>
            <svg ref={splotSvg} width={svgWidth} height={svgHeight}>
            </svg>
        </div>
    )
};

export default HeatMaps;
