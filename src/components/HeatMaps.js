import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import HeatMapLegend from "./HeatMapLegend";


const HeatMaps = (props) => {

    const splotSvg = useRef(null);
    const gColorRGBA = props.gColorRGBA;

    const gColor = props.gColor;
    const width = props.width;
    const height = props.height;
    const data = props.data;
    const marginWidth = props.marginWidth;
    const marginHeight = props.marginHeight;

    const svgWidth = marginWidth * 2 + width;
    const svgHeight = marginHeight * 2 + height;
    const type = props.type
    
    //hyo
    let brushedTime = props.brushedTime;

    useEffect(() => {
             


        const svg = d3.select(splotSvg.current);

        const yVars = new Set;
        // console.log(data)
        data.forEach((d, i) => {
            yVars.add(String(d.value_y))
        })
        let yVarsArray = Array.from(yVars);
        const yLength = yVarsArray.length;
        // console.log("yVarsArray", yVarsArray)
        //y축 
        let yAxisArray = yVarsArray.slice();
        for (let i = yAxisArray.length - 1; i >= 0; i--) {
            if (i % 2 == 0) {
                yAxisArray.splice(i, 1);
            }
        }

        let yScale_axis = d3.scaleBand()
            .domain(yAxisArray)
            .range([height, 0])

        let xScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.time), d3.max(data, d => d.time)])
            .range([0, width]);

        let yScale = d3.scaleBand()
            .domain(yVarsArray)
            .range([height, 0]);


        svg.append("g")
            .attr('transform', `translate(${marginWidth}, ${height + marginHeight})`)
            .call(d3.axisBottom(xScale))

        let bandwidth = d3.max(data, d => d.time) - d3.min(data, d => d.time);

        // console.log("yAxis", yAxisArray[0])

        let yAxis_left = [];
        let yAxis_right = [];

        if (type === "Queue") {
            yAxis_left = d3.axisLeft(yScale_axis)
            yAxis_right = d3.axisRight(yScale_axis)
        } else if (type === "CPU") {
            yAxis_left = d3.axisLeft(yScale)
            
        } else {
            yAxis_left = d3.axisLeft(yScale_axis)
                .tickFormat(d => {
                    return d3.format(".2s")(Number(d))
                })
                yAxis_right = d3.axisRight(yScale_axis)
                .tickFormat(d => {
                    return d3.format(".2s")(Number(d))
                })
        }

         //doubleclick하면 brushedTime 초기화
         svg.on("dblclick", () => {
            
            props.setBrushedTime([]);
        });
        

        svg.append("g")
            .attr('transform', `translate(${marginWidth}, ${marginHeight})`)
            .call(yAxis_left)
            // .call(yAxis_right);

            svg.append("g")
            .attr('transform', `translate(${marginWidth + width}, ${marginHeight})`)
            .call(yAxis_right)

        let gColorRGBA = props.gColorRGBA;
        let gColor = props.gColor;
        
        let myColor = d3.scaleLinear()
            // .range(["lightgreen", "#69b3a2"])
            .range(["#a6cee3", "#a6cee3" , "#e31a1c"])
            // .domain([0, d3.min(data, d => d.value) + 1, max/20, d3.max(data, d => d.value)])
            // .range(gColor.reverse())
            .domain([0, d3.min(data, d => d.count) + 1,d3.max(data, d => d.count)])
        // console.log("count", d3.min(data_value)+1)
        // 0 ~ 1 => white
        // 1 ~ max - 1 => 
        //max - 1 ~ max => black
        // console.log("mycolor", myColor.domain())

        // console.log("d.type", )

        svg.append("g")
            // .attr("transform", `translate(${margin}, ${margin})`)
            .attr("transform", `translate(${marginWidth}, ${marginHeight})`)
            .selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr("x", d => xScale(d.time))
            .attr("y", d => yScale(String(d.value_y)))
            .attr("width", width / bandwidth)
            .attr("height", height / yLength)
            .style("stroke-width", 0)
            .attr("stroke", d => myColor(d.count))
            .attr("opacity", function (d) { if (d.count === 0 && type !== "CPU") {
                return 0;}else{
                    return 1;
                } })
            .style("fill", d => myColor(d.count) )
            .style("pointer-events", "none") //rect위에서 brush
            .lower()

       

        const brush = d3.brush()
            .extent([[0, 0], [width, height]])
            .on("start", resetBrushed)
            .on("end", brushed);

        svg.append('g')
            .attr('class', 'brush')
            .attr('transform', `translate(${marginWidth}, ${marginHeight})`);

        svg.select('.brush').call(brush);

        function resetBrushed() {
            svg.select('.brush .selection')
            .style("fill-opacity", 0.2)
            .style("stroke-width", 0)

        }
        function brushed({ selection }) {

            const rects = svg.selectAll('rect');

            if (selection === null) {

                // console.log("brushed nothing")
                // props.setBrushedTime(null);
                return;
            } else {

                let [[x0, y0], [x1, y1]] = selection;
                // console.log("x0", x0 - x1);
                let selectedTime = new Set;
                rects.filter((d) => {
                    // console.log("d.x, d.y", d.x, d.y);
                    let xCoord = xScale(d.time);
                    let yCoord = yScale(String(d.value_y));
                    return x0 <= xCoord && xCoord <= x1 && y0 <= yCoord && yCoord <= y1 && d.count > 0;
                }).data()
                    .map(item => {
                        selectedTime.add(item.time)
                    });

                for (let i = d3.min(selectedTime); i <= d3.max(selectedTime); i++) {
                    selectedTime.add(i)
                }

                props.setBrushedTime(Array.from(selectedTime));
            }
            svg.select('.brush .selection').style("fill-opacity", 0)
            // console.log("brushed data ", Index);
        };


        // Histogram Begin

        // console.log(yVarsArray)
        // yVarsArray = yVarsArray.sort(compare)
        // console.log(yVarsArray)
        let hist = Object.fromEntries(yVarsArray.map(d => [d, 0]))

        data.forEach((d) => {
            hist[d.value_y] += d.count
        })
        // console.log(hist)
        // hist = Object.keys(hist).sort(compare);
        // console.log(hist)
        let histWidth = marginWidth - 2
        let histScale = d3.scaleLinear()
            .domain([0, d3.max(Object.values(hist))])
            .range([histWidth, 0]);

        let points = [[histWidth, height]]
        Object.keys(hist).forEach(key => {
            // console.log(key)
            points.push([histScale(hist[key]), yScale(key)])
            // return [key, hist[key]]
        })
        // points.push([0,100])
        var compare = function (a, b) {
            return a[1] - b[1]
        }

        points.sort(compare)

        // console.log(yScale.domain())
        // console.log(points)
        // console.log(points)
        if(type === "CPU"){

        }else{

            d3.select(splotSvg.current)
                .append('g')
                .attr('transform', `translate(${width}, ${marginHeight})`)
                .append('path')
                .style('stroke', 'black')
                .style("stroke-width", "1.5")
                .style('fill', 'none')
                .attr('d', d3.line().curve(d3.curveNatural)(points))
        }
        // Histogram End

        // drawThroughput()

        //Legend view

        // const legendWidth = 20;
        // const legendHeight = 15;

        // const numLegendItems = 5;
        // const colorRange = myColor.range();
        // const domainRange = myColor.domain();
        // console.log("colorRange", colorRange)
        // console.log("domainRange", domainRange)
        // const increment = (domainRange[2] - domainRange[0]) / numLegendItems;
        // const legendData = Array.from({ length: numLegendItems }, (_, i) => domainRange[0] + increment * i);
        // console.log("legend Data", legendData)

        // const legend = svg.append("g")
        //   .attr("transform", `translate(${svgWidth - legendWidth - 20}, ${marginHeight})`); 

        // legend.selectAll("rect")
        //   .data(legendData)
        //   .enter()
        //   .append("rect")
        //   .attr("x", 0)
        //   .attr("y", (d, i) => i * legendHeight)
        //   .attr("width", legendWidth)
        //   .attr("height",  legendHeight)
        //   .style("fill", d => myColor(d));

        // legend.selectAll("text")
        //   .data(legendData)
        //   .enter()
        //   .append("text")
        //   .attr("x", 25) 
        //   .attr("y", (d, i) => i * legendHeight + legendHeight / 2)
        //   .text(d => d3.format(".2s")(d))
        //   .attr("alignment-baseline", "middle");





    }, []);
    function drawThroughput() {
        let throughputData = props.allData.throughput;
        // console.log(throughputData)

        let xScale = d3.scaleLinear()
            .domain(
                [d3.min(throughputData, d => d.time),
                d3.max(throughputData, d => d.time)])
            .range([0, width]);

        let yScale = d3.scaleLinear()
            .domain(
                [d3.min(throughputData, d => d.throughput),
                d3.max(throughputData, d => d.throughput)])
            .range([height, 0]);

        const yAxis = d3.axisRight(yScale);

        yAxis.ticks(3);

        // svg.append('g')
        //     .attr('transform', `translate(${margin}, ${height + margin})`)
        //     .call(xAxis);
        d3.select(splotSvg.current)
            .append('g')
            .attr('transform', `translate(${width + marginWidth}, ${marginHeight})`)
            .call(yAxis);

        // const line = d3.line()
        //     .x((d, i) => xScale(data_x[i]))
        //     .y((d, i) => yScale(data_y[i]));
        // throughputData.forEach((item)=>{
        //     console.log(xScale(item.time), yScale(item.throughput))
        // })
        // let line = d3.line()
        // .datum(throughputData)
        // .x(d => xScale(d.time))
        // .y(d => yScale(d.throughput))
        // console.log(line)
        const throughputLine = d3.line()
            .x(d => xScale(d.time))
            .y(d => yScale(d.throughput))

        d3.select(splotSvg.current)
            .selectAll('.throughput')
            .raise()
            .data(throughputData)
            .enter()
            .append("path")
            .attr('transform', `translate(${marginWidth}, ${marginHeight})`)
            .attr('class', 'throughput')
            .attr("d", throughputLine(throughputData))
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", '0.5')
    }
    useEffect(() => {
        const svg = d3.select(splotSvg.current);

        let xScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.time), d3.max(data, d => d.time)])
            .range([0, props.width]);
        let bandwidth = d3.max(data, d => d.time) - d3.min(data, d => d.time);

        svg.selectAll('rect.background')
            .data(brushedTime)
            .join(
                enter => enter
                    .append('rect')
                    .attr("class", "background")
                    .attr('transform', `translate(${props.marginWidth}, ${props.marginHeight})`)
                    .attr("x", time => xScale(time))
                    .attr("y", 0)
                    .attr("height", props.height)
                    .attr("width", props.width / bandwidth)
                    .style('stroke', "none")
                    .style('opacity', '0.2')
                    .style("fill", "blue"),
                update => update
                    .attr("x", time => {
                        // console.log(xScale(minX))
                        if (xScale(time) < 0) {
                            return 0
                        }
                        else if (xScale(time) > props.width) {
                            return props.width;
                        }
                        else return xScale(time)
                    }),
                exit => exit.remove()
            )

    }, [brushedTime]);

    return (
        <div className='innerplot-container' style={{ display: "flex" }}>
            <svg ref={splotSvg} width={svgWidth} height={svgHeight}>
            </svg>
            <div >
                <HeatMapLegend
                    gColor={props.gColor}
                    height={height}
                    type={type}
                    // marginWidth={marginWidth}
                    // marginHeight={marginHeight}
                    data={data}
                />
            </div>
        </div>
    )
};

export default HeatMaps;
