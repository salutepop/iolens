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
            // console.log(typeof d.time)
            let total = 0
            for(let item in d){
                if (item === 'total')
                    continue
                d[item] = parseFloat(d[item]);
                total += d[item];
            }
            d['total'] = total
            // // d.forEach(parseFloat(i => i))
            // d.time = parseFloat(d.time);
            // d.value1 = parseFloat(d.value1);
            // d.value2 = parseFloat(d.value2);
            // d.value3 = parseFloat(d.value3);
            // d.total = d.value1 + d.value2 + d.value3;
        });
        console.log(data)
        const stackedData = d3.stack()
            .keys(["value1", "value2", "value3"])(data);
        // x축
        const x = d3.scaleLinear()
            .domain(d3.extent(data, (d) => d.time))
            .range([0, width]);

        svg.append('g')
            .attr('transform', `translate(${margin}, ${height + margin})`)
            .call(d3.axisBottom(x));

                console.log(d3.max(data, d=>d.total))
        // y축
        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d=>d.total)])
            // .domain([0, 64000])
            .range([height, 0]);

        svg.append('g')
            .attr('transform', `translate(${margin}, ${margin})`)
            .call(d3.axisLeft(y));

        // area 설정
        const area = d3.area()
            .x(d => x(d.data.time))
            .y0(d => y(d[0]))
            .y1(d => y(d[1]));

        svg.selectAll()
            .data(stackedData)
            .enter()
            .append("path")
            .attr('transform', `translate(${margin}, ${margin})`)
            .attr("class", "area")
            .attr("d", area)
            .style("fill", (d) => {
                if (d.key === "value1") return "steelblue";
                else if (d.key === "value2") return "orange";
                else return "green";
            })


    }, []);

    return (
        <svg ref={splotSvg} width={svgWidth} height={svgHeight}></svg>
    );
};

export default Stackareaplot;