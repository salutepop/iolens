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
    const [localData, setLocalData] = useState([]);

    useEffect(() => {
        // console.log("data", data)
        const svg = d3.select(splotSvg.current);

        const yVars = new Set;


        data.forEach((d, i) => {

            d.x = parseFloat(d.sec)
            d.y = parseFloat(d.value_y);
            d.value = parseFloat(d.count)
            // console.log("d.value", d.value)

        })
        data.forEach((d, i) => {
            yVars.add(d.value_y)
        })
        const yVarsArray = Array.from(yVars);
        const yLength = yVarsArray.length;

        let xScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.x), d3.max(data, d => d.x)])
            .range([0, width]);

        let yScale = d3.scaleBand()
            .domain(yVarsArray)
            .range([height, 0]);


        svg.append("g")
            .attr('transform', `translate(${margin}, ${height + margin})`)
            .call(d3.axisBottom(xScale))

        let bandwidth = d3.max(data, d => d.x) - d3.min(data, d => d.x);

        svg.append("g")
            .attr('transform', `translate(${margin}, ${margin})`)
            .call(d3.axisLeft(yScale))


        const myColor = d3.scaleLinear()
            // .range(["lightgreen", "#69b3a2"])
            // .range(["white", "lightblue" ,"blue", "red"])
            // .domain([0, d3.min(data, d => d.value) + 1, max/20, d3.max(data, d => d.value)])
            .range(["lightgreen", "lightblue", "blue"])
            .domain([0, d3.min(data, d => d.value) + 1, d3.max(data, d => d.value)])
        // console.log("count", d3.min(data_value)+1)

        svg.append("g")
            // .attr("transform", `translate(${margin}, ${margin})`)
            .attr("transform", `translate(${margin}, ${margin})`)
            .selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr("x", d => xScale(d.x))
            .attr("y", d => yScale(String(d.y)))
            .attr("width", width / bandwidth)
            .attr("height", height / yLength)
            .style("stroke-width", "0")
            .attr("stroke", function (d) { return myColor(d.value) })
            // .attr("opacity", function (d) { if (d.value === 0) return 0 })
            .style("fill", function (d) { return myColor(d.value) })
            .style("pointer-events", "none"); //rect위에서 brush


        //rect
        // svg.append("rect")
        // .attr("x", xScale(1034))
        // .attr("y", yScale("2621378"))
        // .attr("width", width / 100)
        // .attr("height", height / 20)
        // .attr("fill", "red")
        // .style("stroke-width", "0")
        // .attr("transform", `translate(${margin  }, ${margin })`)


        const brush = d3.brush()
            .extent([[0, 0], [width, height]])
            .on("end", brushed);

        svg.append('g')
            .attr('class', 'brush1')
            .attr('transform', `translate(${margin}, ${margin})`);

        svg.select('.brush1').call(brush);

        function brushed({ selection }) {

            const rects = svg.selectAll('rect');
            
            if (selection === null) {

                console.log("brushed nothing")

                return;
            } else {

                let [[x0, y0], [x1, y1]] = selection;

                const selectedData = rects.filter((d) => {
                    // console.log("d.x, d.y", d.x, d.y);
                    let xCoord = xScale(d.x);
                    let yCoord = yScale(String(d.y));
                    // console.log("value", d.value)
                    // console.log("xCoord", xCoord)
                    // console.log("yCoord", yCoord)
                    return x0 <= xCoord && xCoord <= x1 && y0 <= yCoord && yCoord <= y1 && d.value > 0 ;
                }).data()
                    .map(({ sec }) => ({
                        sec,

                    }));
                    setLocalData(selectedData);
                    console.log("Selected Sec:", localData);
                const selectedRect = rects.filter((d) => {
                    
                    let xCoord = xScale(d.x);
                    let yCoord = yScale(d.y);

                    // console.log("xCoord", d3.max(xCoord));
                    return x0 <= xCoord && xCoord <= x1 && y0 <= yCoord && yCoord <= y1;

                });
                // console.log("selectedRect", selectedData)
                selectedRect.nodes().map((d, i) => {

                    // d3.selectAll('circle.'+ d.classList[0]).style("fill", "red");
                    // d3.selectAll('circle.'+ d.classList[0]).style("stroke", "red");
                    // d3.selectAll('circle.'+ d.classList[0]).attr("r", 2);
                });
                props.setBrushedSec(selectedData);

            }
            // console.log("brushed data ", Index);
        };

    }, []);

    return (
        <div className='innerplot-container'>
            <svg ref={splotSvg} width={svgWidth} height={svgHeight}>
            </svg>
        </div>
    )
};

export default HeatMaps;
