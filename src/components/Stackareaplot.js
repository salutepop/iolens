import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const Stackareaplot = (props) => {
    const splotSvg = useRef(null);

    const width = props.width;
    const height = props.height;
    const data = props.data;
    const marginWidth = props.marginWidth;
    const marginHeight = props.marginHeight;

    const svgWidth = marginWidth * 2 + width;
    const svgHeight = marginHeight * 2 + height;
    let brushedTime = props.brushedTime;

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
        // console.log(data)
        
        const keys = ["value1", "value2", "value3", 'value4']
        const stackedData = d3.stack()
        .keys(keys)(data);
        //.keys(["value1", "value2", "value3"])(data);
        // x축
        const x = d3.scaleLinear()
            .domain(d3.extent(data, (d) => d.time))
            .range([0, width]);

        svg.append('g')
            .attr('transform', `translate(${marginWidth}, ${height + marginHeight})`)
            .call(d3.axisBottom(x));

                // console.log(d3.max(data, d=>d.total))
        // y축
        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d=>d.total)])
            // .domain([0, 64000])
            .range([height, 0]);

        svg.append('g')
            .attr('transform', `translate(${marginWidth}, ${marginHeight})`)
            .call(d3.axisLeft(y));

        // area 설정
        const area = d3.area()
            .x(d => x(d.data.time))
            .y0(d => y(d[0]))
            .y1(d => y(d[1]));

        // color palette
        const color = d3.scaleOrdinal()
            .domain(keys)
            .range(['#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf'])
        
        svg.selectAll()
            .data(stackedData)
            .enter()
            .append("path")
            .attr('transform', `translate(${marginWidth}, ${marginHeight})`)
            .attr("class", "area")
            .attr("d", area)
            .style("fill", function (d) { return color(d.key); })


    }, []);
    useEffect(()=>{
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
        <svg ref={splotSvg} width={svgWidth} height={svgHeight}></svg>
    );
};

export default Stackareaplot;