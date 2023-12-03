
import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";


const HeatMapLegend = (props) => {

    const splotSvg = useRef(null);

    const legendWidth = 20;
    const height = props.height;
    const data = props.data
    // const marginWidth = props.marginWidth;
    // const marginHeight = props.marginHeight;
    const marginWidth = 10;
    const marginHeight = 20
    
    const svgWidth = marginWidth * 2 + legendWidth;
    const svgHeight = marginHeight * 2 + height;



    
    useEffect(() => {

        const svg = d3.select(splotSvg.current)

        let myColor = d3.scaleLinear()
        // .range(["lightgreen", "#69b3a2"])
        // .range(["white", "lightblue" ,"blue", "red"])
        // .domain([0, d3.min(data, d => d.value) + 1, max/20, d3.max(data, d => d.value)])
        .range(["white", "lightblue", "blue"])
        .domain([0, d3.min(data, d => d.count) + 1, d3.max(data, d => d.count)])

        const numLegendItems = 5;
        const colorRange = myColor.range();
        const domainRange = myColor.domain();
        // console.log("colorRange", colorRange)
        // console.log("domainRange", domainRange)
        const increment = (domainRange[2] - domainRange[0]) / numLegendItems;
        const legendData = Array.from({ length: numLegendItems }, (_, i) => domainRange[0] + increment * i);
        // console.log("legend Data", legendData)
        const legendHeight = height/5;
        const legend = svg.append("g")
          .attr("transform", `translate(${marginWidth}, ${marginHeight})`); 
        
        // console.log("dd", legendHeight/numLegendItems)
        legend.selectAll("rect")
          .data(legendData)
          .enter()
          .append("rect")
          .attr("x", 0)
          .attr("y", (d, i) => i * legendHeight)
          .attr("width", legendWidth)
          .attr("height",  legendHeight)
          .style("fill", d => myColor(d));
        
      
        legend.selectAll("text")
          .data(legendData)
          .enter()
          .append("text")
          .attr("x", 3) 
          .attr("y", (d, i) => i * legendHeight + legendHeight / 2)
          .text(d => d3.format(".2s")(d))
          .style("font-size", "10px")
          .attr("alignment-baseline", "middle");





    }, []);
   

    

    return (
        <div className='innerplot-container'>
            <svg ref={splotSvg} width={svgWidth} height={svgHeight}>
            </svg>
        </div>
    )
};

export default HeatMapLegend;
