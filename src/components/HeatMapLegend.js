
import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";


const HeatMapLegend = (props) => {

  const gColor = props.gColor;
  const gColorRGBA = props.gColorRGBA;

  const splotSvg = useRef(null);

  const legendWidth = 15;
  const height = props.height;
  const data = props.data
  // const marginWidth = props.marginWidth;
  // const marginHeight = props.marginHeight;
  const marginWidth = 0;
  const marginHeight = 20

  const svgWidth = marginWidth * 2 + legendWidth  + 50;
  const svgHeight = marginHeight * 2 + height;
  const type = props.type



  useEffect(() => {

    const svg = d3.select(splotSvg.current)

    // let myColor = d3.scaleLinear()
    //   // .range(["lightgreen", "#69b3a2"])
    //   // .range(["white", "lightblue" ,"blue", "red"])
    //   // .domain([0, d3.min(data, d => d.value) + 1, max/20, d3.max(data, d => d.value)])
    //   .range(gColor.reverse())
    //   .domain([0, d3.min(data, d => d.count) + 1, d3.max(data, d => d.count)])
    // console.log("gcloclor", gColor)
    
    // console.log("data", type ,data)
    // const gColor = ["#e15759", "#a6cee3","#1f78b4","#fb9a99","#e31a1c","#fdbf6f","#ff7f00","#cab2d6","#6a3d9a","#ffff99","#b15928"]
    let gColor = props.gColor;

    let myColor = d3.scaleLinear()
          .range(["white", "#a6cee3" , "#e31a1c"])
          .domain([0, d3.min(data, d => d.count) + 1 ,d3.max(data, d => d.count)])
    
          let myColorCPU = d3.scaleLinear()
          .range(["#a6cee3", "#1f78b4" , "#e31a1c"])
          .domain([0, d3.min(data, d => d.count) + 1 ,d3.max(data, d => d.count)])

    let colorRange = myColor.range();
    let domainRange = myColor.domain();
    
    // console.log("colorRange", colorRange)
    // console.log("domainRange", domainRange)

    
      // colorRange = myColorCPU.range();
      // domainRange = myColorCPU.domain();
    

    const numLegendItems = 4;


    // console.log("colorRange", colorRange)
    // console.log("domainRange", domainRange)
    const increment = Math.round((domainRange[2] - domainRange[0]) / numLegendItems);
    // console.log("domain range", domainRange)
    // console.log("increment", increment)
    const legendData = Array.from({ length: numLegendItems + 1}, (_, i) => domainRange[0] + increment * i);
    // legendData[legendData.length] = d3.max(data, d => d.count);
    legendData[legendData.length - 1] = d3.max(data, d => d.count)
    // console.log("legend Data", legendData)
    if(type !== "CPU"){
      legendData.splice(1, 0,d3.min(data, d => d.count)+ 1 )
      
    }
    const reverseLegendData = legendData.reverse();
    // legendData[legendData.length - 2] = d3.min(data, d => d.count) + 1000
    // const legendHeight = height / numLegendItems;
    const legendHeight = height/legendData.length;

    const legend = svg.append("g")
      .attr("transform", `translate(${marginWidth}, ${marginHeight})`);

    // console.log("dd", legendHeight/numLegendItems)
    legend.selectAll("rect")
      .data(legendData)
      .enter()
      .append("rect")
      .attr("x", 0)
      .attr("y", (d, i) =>  i * legendHeight)
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("stroke", "black")
      .style("opacity", function(d,i) {
        if(type === "CPU"){
          return 0.5;

        }
      })
      .style("fill", function (d,i) {
        if(type === "CPU"){
          return myColorCPU(d)
        }else{

          return myColor(d)
        }
        
      });
      // console.log("max count", d3.max(legendData))
      // console.log("legendData", legendData)
      // console.log("legendData", legendData[legendData.length])

    legend.selectAll("text")
      .data(legendData)
      .enter()
      .append("text")
      .attr("x", 18)
      .attr("y", (d, i) => i * legendHeight + legendHeight / 2)
      .text( function(d) {
        if(d === 0 || d === 1){
          return d
        }else{

          return d3.format(".2s")(d)
        }
      })
        
      .style("font-size", "13px")
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
