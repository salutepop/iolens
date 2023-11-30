import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const Stackareaplot = (props) => {
    const splotSvg = useRef(null);

    const width = props.width;
    const height = props.height;
    const data = props.data;
    const margin = props.margin;

    const svgWidth = margin * 2 + width;
    const svgHeight = margin * 2 + height;

    useEffect(() => {
        const svg = d3.select(splotSvg.current);

        data.forEach((d) => {
            d.time = parseFloat(d.time);
            d.value1 = parseFloat(d.value1);
            d.value2 = parseFloat(d.value2);
            d.value3 = parseFloat(d.value3);
        });
        //console.log("Data:", data);

        const stack = d3.stack().keys(["value1", "value2", "value3"]);
        const stackedData = stack(data);
        console.log("Stacked Data:", stackedData);

        // x축
        const x = d3.scaleLinear()
            .domain(d3.extent(data, (d) => d.time))
            .range([0, width]);
        svg.append('g')
            .attr('transform', `translate(${margin}, ${height + margin})`)
            .call(d3.axisBottom(x));

        // y축
        const y = d3.scaleLinear()
            .domain([0, 64000])
            .range([height, 0]);
        svg.append('g')
            .attr('transform', `translate(${margin}, ${margin})`)
            .call(d3.axisLeft(y));

        // area 설정
        const area = d3.area()
            .x((d) => x(d.time))
            .y0((d) => y(d[0]))
            .y1((d) => y(d[1]));


        svg.selectAll(".area")
            .data(stackedData)
            .enter()
            .append("path")
            .attr('transform', `translate(${margin}, ${margin})`)
            .attr("class", "area")
            .attr("d", area)
            .attr("fill", (d) => {
                if (d.key === "value_1") return "steelblue";
                else if (d.key === "value_2") return "orange";
                else return "green";
            });

    }, []);

    return (
        <svg ref={splotSvg} width={svgWidth} height={svgHeight}></svg>
    );
};

export default Stackareaplot;