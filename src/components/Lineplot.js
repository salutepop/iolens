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
    const timeData = props.timeData;
    let brushedData = props.brushedData;
    

    useEffect(() => {

        
        timeData.map(d=>parseFloat(d))
        const svg = d3.select(splotSvg.current);
        const brushedX = brushedData.map(d => parseFloat(d.issue_time))
        let minX = d3.min(brushedX)
        let maxX = d3.max(brushedX)
        
        data.map(d=>{
            d.timeStamp = parseFloat(d.timeStamp)
            d.value = parseFloat(d.value)
        })
        const data_x = data.map((d) => d.timeStamp);
        const data_y = data.map((d) => d.value);

        let xScale = d3.scaleLinear()
            .domain([d3.min(timeData), d3.max(timeData)])
            .range([0, width]);

        let yScale = d3.scaleLinear()
            .domain([d3.min(data_y), d3.max(data_y)])
            .range([height, 0]);

        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);
        
        yAxis.ticks(3);

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
            .attr('transform', `translate(${margin}, ${margin})`)
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "blue")
            .attr("stroke-width", 1.0)
            .attr("d", line);



        svg.selectAll('rect')
            .data(brushedX)
            .join(
                enter => enter
                    .append('rect')
                    .attr('transform', `translate(${margin}, ${margin})`)
                    .attr("y", 0)
                    .attr("height", height)
                    // .attr("width",
                    //     xScale(maxX) - xScale(minX)
                    // )
                    .style("fill", "rgba(255, 0, 0, 0.5)"),
                update => update
                    .attr("x", d => {
                        // console.log(xScale(minX))
                        if (xScale(minX) < 0) {
                            return 0
                        }
                        else if (xScale(minX) > width) {
                            return width;
                        }
                        else return xScale(minX)
                    })
                    .attr("width",
                        d => {
                            let r_width = xScale(maxX) - xScale(minX);
                            if (r_width >= width) { return 0 }
                            else { return r_width };
                        }),
                exit => exit
            )


        // svg.select('rect').remove();
        // svg.selectAll('rect')
        //     .join(
        //         enter => enter.append('rect')
        //             .attr("x", xScale(minX))
        //             .attr("y", -margin)
        //             .attr("widht", xScale(maxX) - xScale(minX))
        //             .attr("height", svgHeight)
        //             .style("fill", "rgba(255, 0, 0, 0.5)")
        //         ,
        //         update => update
        //             .attr("x", xScale(minX))
        //             .attr("y", -margin)
        //             .attr("widht", xScale(maxX) - xScale(minX))
        //             .attr("height", svgHeight)
        //             .style("fill", "rgba(255, 0, 0, 0.5)")
        //             ,
        //         exit => exit.remove()
        //     )

    }, [brushedData]);

    return (
        <div>
            <svg ref={splotSvg} width={svgWidth} height={svgHeight}>
            </svg>
        </div>
    )
};

export default Lineplot;
