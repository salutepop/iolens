
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
  const type = props.type



  useEffect(() => {

    const svg = d3.select(splotSvg.current)

    let myColor = d3.scaleLinear()
      // .range(["lightgreen", "#69b3a2"])
      // .range(["white", "lightblue" ,"blue", "red"])
      // .domain([0, d3.min(data, d => d.value) + 1, max/20, d3.max(data, d => d.value)])
      .range(["white", "lightblue", "blue"])
      .domain([0, d3.min(data, d => d.count) + 1, d3.max(data, d => d.count)])

    let myColorCPU = d3.scaleLinear()
      .range(["yellow", "orange", "red"])
      .domain([0, d3.min(data, d => d.count) + 1, d3.max(data, d => d.count)])


    let colorRange = myColor.range();
    let domainRange = myColor.domain();

    if (type === "CPU") {
      colorRange = myColorCPU.range();
      domainRange = myColorCPU.domain();
    }

    const numLegendItems = 5;


    // console.log("colorRange", colorRange)
    // console.log("domainRange", domainRange)
    const increment = (domainRange[2] - domainRange[0]) / numLegendItems;
    const legendData = Array.from({ length: numLegendItems }, (_, i) => domainRange[0] + increment * i);
    // console.log("legend Data", legendData)
    const legendHeight = height / numLegendItems;


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
      .attr("height", legendHeight)
      .style("stroke", "black")
      .style("fill", function (d) {

        if (type === "CPU") {
          return myColorCPU(d)
        } else {
          return myColor(d)
        }
      });


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
