import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const Stackareaplot = (props) => {
    const splotSvg = useRef(null);

    const width = props.width;
    const height = props.height;
    const data = props.data;
    const checkPointData = props.checkPointData;
    const marginWidth = props.marginWidth;
    const marginHeight = props.marginHeight;
    const legendWidth = 100

    const svgWidth = marginWidth * 2 + width + legendWidth;
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
        });
        // console.log(data)

        let keys = Object.keys(data[0]).slice(1, -1);
        //console.log(keys)

        const stackedData = d3.stack()
        .keys(keys)(data);

        // x축
        const x = d3.scaleLinear()
            .domain(d3.extent(data, (d) => d.time))
            .range([0, width]);

        svg.append('g')
            .attr('transform', `translate(${marginWidth}, ${height + marginHeight})`)
            .call(d3.axisBottom(x));

        // y축
        const y = d3.scaleLinear()
            .domain([0, d3.max(stackedData, d => d3.max(d, d => d[1]))])
            .range([height, 0]);

        svg.append('g')
            .attr('transform', `translate(${marginWidth}, ${marginHeight})`)
            .call(d3.axisLeft(y)
                .ticks(10)
                .tickFormat(d3.format(".2s"))
            )
        
        // area
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
        
        // legend
        const legendRectSize = 15;
        const legendSpacing = 5;

        const legend = svg.append("g")
            .attr("transform", `translate(${width + marginWidth + 10}, ${marginHeight * 2})`);

        const legendItems = legend.selectAll("legend")
            .data(keys)
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(0, ${i * (legendRectSize + legendSpacing)})`);

        legendItems.append("rect")
            .attr("width", legendRectSize)
            .attr("height", legendRectSize)
            .style("fill", color);

        legendItems.append("text")
            .attr("x", legendRectSize + legendSpacing)
            .attr("y", legendRectSize - legendSpacing)
            .text((d) => d);

        //console.log(checkPointData)
        if (checkPointData != null) {
            let checkPointData_length = 0;
            checkPointData_length = checkPointData.length
            // delta gc time
            let changingGCTimes = [];
            for (let i = 1; i < checkPointData_length; i++) {
                if (checkPointData[i].gc !== checkPointData[i - 1].gc) {
                    changingGCTimes.push(checkPointData[i].time);
                }
            }
            //console.log(changingGCTimes);

            // 해당하는 위치에 빨간 선 추가
            const redLines = svg.selectAll("line.red-line")
                .data(changingGCTimes)
                .enter()
                .append("line")
                .attr("class", "red-line")
                .attr("x1", (d) => x(d) + marginWidth)
                .attr("y1", 0)
                .attr("x2", (d) => x(d) + marginWidth)
                .attr("y2", height + marginHeight)
                .style("stroke", "red")
                .style("stroke-width", 1);
            
            redLines.raise();
        }

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