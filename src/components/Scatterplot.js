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
    //hyo
    // const [Index, setIndex] = useState([]);

    useEffect(() => {
        // props.setBrushedIndex(Index)
        const svg = d3.select(splotSvg.current);
        // console.log(data);
        // props.setBrushedIndex(Index);


        const data_x = data.map((d) => Object.values(d)[0]);
        const data_y = data.map((d) => Object.values(d)[1]);
        
        data.forEach((d, i) => {
            
            d.x = parseFloat(d.issue_time)
            // d.y = parseFloat()
            d.y = parseFloat(d.value);
            
        })

        
        // console.log(data_x);
        // console.log("data_y", data_y);
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

        svg.append("g")
            .attr("transform", `translate(${margin}, ${margin})`)
            .selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("r", radius)
            .attr("cx", d => xScale(d.x))
            .attr("cy", d => yScale(d.y))
            .style("fill", "blue");

        //hyo
        const brush = d3.brush()
            .extent([[0, 0], [width, height]])
            .on("start end", brushed);

        // svg.select(".brush").remove();
        svg.append('g')
            .attr('class', 'brush')
            .attr('transform', `translate(${margin}, ${margin})`)
        svg.select('.brush')
            .join(
                enter => enter,
                update => update
                    .call(brush),
                exit => exit.remove()
            )
        function brushed({ selection }) {
            const circles = svg.selectAll('circle');
            

            if (selection === null) {
                circles.classed("selected", false);
                
                console.log("brushed nothing")
                return;
            } else {

                let [[x0, y0], [x1, y1]] = selection;
                const selectedData = circles.filter((d) => {
                    // console.log("d.x, d.y", d.x, d.y);
                    let xCoord = xScale(d.x);
                    let yCoord = yScale(d.y);
                    return x0 <= xCoord && xCoord <= x1 && y0 <= yCoord && yCoord <= y1;
                }).data()
                    .map(({idx}) => ({
                        idx,

                    }));
                console.log("Selected Data:", selectedData);
                props.setBrushedIndex(selectedData);
                // setIndex(selectedData);

            }
            // console.log("brushed data ", Index);
        };

    }, []);

    return (
        <div>
            <svg ref={splotSvg} width={svgSize_w} height={svgSize_h}>
            </svg>
        </div>
    )
};

export default Scatterplot;
