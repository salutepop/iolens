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
        const data_x = data.map((d) => Object.values(d)[0]);
        const data_y = data.map((d) => Object.values(d)[1]);
        const data_value = data.map((d) => Object.values(d)[2]);

        data.forEach((d, i) => {

            d.x = parseFloat(d.sec)
            d.y = parseFloat(d.lba);
            d.value = parseFloat(d.count)


        })



        let xScale = d3.scaleLinear()
            .domain([d3.min(data_x), d3.max(data_x)])
            .range([0, width]);
            
        let yScale = d3.scaleLinear()
            .domain([d3.min(data_y), d3.max(data_y)])
            .range([height, 0]);

        console.log("ymax", d3.max(data_x))
        console.log("ymin", d3.min(data_x))

        svg.append("g")
            .attr('transform', `translate(${margin}, ${height + margin})`)
            .call(d3.axisBottom(xScale))

            
            let x_min = d3.min(data_x); // data_x 배열에서 최소값
            let y_min = d3.min(data_y); // data_y 배열에서 최소값
            
            // data_x 배열에서 최소값과 동일한 값을 제외한 값을 찾기
            let x_second_min = d3.min(data_x.filter(value => value !== x_min));
            let y_second_min = d3.min(data_y.filter(value => value !== y_min));
            let bandwidth = d3.max(data_x) - d3.min(data_x);

        svg.append("g")
            .attr('transform', `translate(${margin}, ${margin})`)
            .call(d3.axisLeft(yScale));


        const myColor = d3.scaleLinear()
            // .range(["lightgreen", "#69b3a2"])
            .range(["grey", "lightblue", "blue"])
            .domain([0, d3.min(data_value) + 1, d3.max(data_value)])
        
            console.log("count", d3.min(data_value)+1)


        // console.log("height", height/10)
        // console.log("width", width/bandwidth)
        svg.append("rect")
        .attr("transform", `translate(${margin + width/bandwidth}, ${margin - (height/10)})`)
            .attr("x", xScale(1012))
            .attr("y", yScale(150000000))
            .attr("width", width/bandwidth)
            .attr("height", height/10)
            .attr("fill", "red")

        svg.append("g")
        // .attr("transform", `translate(${margin}, ${margin})`)
        .attr("transform", `translate(${margin + width/bandwidth}, ${margin - (height/10)})`)
        .selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr("x", d => xScale(d.x))
            .attr("y", d => yScale(d.y))
            .attr("width", width/bandwidth)
            .attr("height", height/10)
            // .attr("stroke", "none")
            .attr("stroke", function (d) { return myColor(d.value)})
            .style("fill", function (d) { return myColor(d.value) })
            // .style("fill", "blue")

        
            // data.forEach((d, i) => {
            //    console.log("color", myColor(d.value) )
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
