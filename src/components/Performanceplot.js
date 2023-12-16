import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const Performanceplot = (props) => {
    const splotSvg = useRef(null);
    const gColorRGBA = props.gColorRGBA;

    const gColor = props.gColor;
    const width = props.width;
    const height = props.height;
    const data = props.allData.performance;
    const checkPointData = props.checkPointData;
    const marginWidth = props.marginWidth;
    const marginHeight = props.marginHeight;
    const legendWidth = 100
    let brushedTime = props.brushedTime;

    const svgWidth = marginWidth * 2 + width + legendWidth;
    const svgHeight = marginHeight * 2 + height;

    useEffect(() => {
        const svg = d3.select(splotSvg.current);

        // console.log(data)

        let legendKeys = ['throughput', 'lat 99%', 'lat 99.99%'];
        let keys = ['lt99', 'lt99_99'];

        const stackedData = d3.stack()
            .keys(keys)(data).reverse();
        // console.log(stackedData)
        // x축
        const x = d3.scaleLinear()
            .domain(d3.extent(data, (d) => d.time))
            .range([0, width]);

        svg.append('g')
            .attr('transform', `translate(${marginWidth}, ${height + marginHeight})`)
            .call(d3.axisBottom(x));

        // y축


        const yLatency = d3.scaleLinear()
            .domain([0,  d3.max(data, d => d.lt100)])
            .range([height, 0]);

        svg.append('g')
            .attr('transform', `translate(${marginWidth + width}, ${marginHeight})`)
            .call(d3.axisRight(yLatency)
                .ticks(10)
                .tickFormat(d3.format(".2s"))
            )
        // area
        const area = d3.area()
            .x(d => x(d.data.time))
            .y0(d => yLatency(d[0]))
            .y1(d => yLatency(d[1] - d[0]));

        // color palette
        const color = d3.scaleOrdinal()
            .domain(keys)
            .range(gColorRGBA)


        // Top3 Hovering Begin

        // Hard coding, 절대 좌표를 사용하다보니 svg내의 상대적인 위치 활용 어려움
        let leftShift = 90;
        let tooltip = d3.select("body").append("div")
            .attr("class", "tooltip-top")
            .style('position', 'absolute')
            .style("white-space", "pre-line")
            .style("border-radius", "4px")
            .style("background", "rgba(0, 0, 0, 0.8)")
            .style("padding", "10px")
            .style("color", "white")
            .style("visibility", "collapse")
            ;

        svg.selectAll()
            .data(stackedData)
            .enter()
            .append("path")
            .attr('transform', `translate(${marginWidth}, ${marginHeight})`)
            .attr("class", "area")
            .attr("d", area)
            .style("fill", function (d, i) { return gColorRGBA[i+6] })
            .style("stroke-width", "1")
            .style("stroke", function (d, i) { return gColor[i+6]; })
            .on('mouseover', (d) => {
                tooltip.style("visibility", "visible");
            })
            .on("mouseout", () => {
                tooltip.style("visibility", "collapse")
            })
            .on("mousemove", (d) => {
                let mouseTime = Math.round(x.invert(d.x - leftShift))
                let top3 = ''
                props.allData.func_top3.forEach((element) => {
                    if (element.time == mouseTime) {
                        top3 =
                            `< Top 3 functions > (${mouseTime} sec)
                        \u00a0 1) ${element.top1}
                        \u00a0 2) ${element.top2}
                        \u00a0 3) ${element.top3}`
                    }

                })
                tooltip
                    .text(top3)
                    .style("left", (d.x + 30) + "px")
                    .style("top", (d.y + 30) + "px")
            })
        // Top3 Hovering End

        //color
        let newColor = ([gColor[8], gColor[6], gColor[7]])
                //blue, gray, brwon
                

        // legend
        const legendRectSize = 15;
        const legendSpacing = 5;

        const legend = svg.append("g")
            .attr("transform", `translate(${width + marginWidth *2}, ${marginHeight * 2})`);

        const legendItems = legend.selectAll("legend")
            .data(legendKeys)
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(0, ${i * (legendRectSize + legendSpacing)})`);

        legendItems.append("rect")
            .attr("width", legendRectSize)
            .attr("height", d => {
                if (d === "throughput") {
                    return 3;
                } else {
                    return legendRectSize;
                }
            })
            .attr("y", d => {
                if (d === "throughput") {
                    return 5;
                } else {
                    return 0;
                }
            })
            .style("fill", (d, i) => {
                if (d === "throughput") {
                    return "black";
                } else {
                    return newColor[i];
                }
            }
            )
            .style("stroke", "black")
            .style("stroke-width", "0.5");

        legendItems.append("text")
            .attr("x", legendRectSize + legendSpacing)
            .attr("y", legendRectSize - legendSpacing)
            .attr('font-size', '13px')
            .text((d) => {
                if(d == "Buff"){
                    return "Buff/Cache"
                }else{
                    return d;
                }
            });

      
        drawThroughput()

        //doubleclick하면 brushedTime 초기화
        svg.on("dblclick", () => {
            
            props.setBrushedTime([]);
        });
    
        //brush
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


            if (selection === null) {

                // console.log("brushed nothing")
                // props.setBrushedTime(null);
                return;
            } else {

                let [[x0, y0], [x1, y1]] = selection;

                let selectedTime = new Set;


                for (let i = Math.round((x.invert(x0))); i <= Math.round(x.invert(x1)); i++) {
                    selectedTime.add(i)
                }

                props.setBrushedTime(Array.from(selectedTime));
                // console.log("seletedTime", selectedTime)
            }
            svg.select('.brush .selection').style("fill-opacity", 0)
            // console.log("brushed data ", Index);
        };

        // drawLatency()
    }, []);


    function drawThroughput() {
        // console.log(throughputData)

        let xScale = d3.scaleLinear()
            .domain(
                [d3.min(data, d => d.time),
                d3.max(data, d => d.time)])
            .range([0, width]);

        let yScale = d3.scaleLinear()
            .domain(
                [d3.min(data, d => d.throughput),
                d3.max(data, d => d.throughput)])
            .range([height, 0]);

        const yAxis = d3.axisLeft(yScale);

        yAxis.ticks(3);

        // svg.append('g')
        //     .attr('transform', `translate(${margin}, ${height + margin})`)
        //     .call(xAxis);
        d3.select(splotSvg.current)
            .append('g')
            .attr('transform', `translate(${marginWidth}, ${marginHeight})`)
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
            .data(data)
            .enter()
            .append("path")
            .attr('transform', `translate(${marginWidth}, ${marginHeight})`)
            .attr('class', 'throughput')
            .attr("d", throughputLine(data))
            .attr("fill", "none")
            // .attr("stroke", gColor[0])
            .attr("stroke", "black")
            // .attr("stroke", "#6a3d9a") //보라색
            
            .attr("stroke-width", '0.2')

        //brush

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

    function drawLatency() {
        // console.log(throughputData)
        let xScale = d3.scaleLinear()
        .domain(
            [d3.min(data, d => d.time),
            d3.max(data, d => d.time)])
        .range([0, width]);
                


    let yScale = d3.scaleLinear()
        .domain(
            [d3.min(data, d => d.lt100),
            d3.max(data, d => d.lt100)])
        .range([height, 0]);

    const yAxis = d3.axisRight(yScale);

    yAxis.ticks(3);

    // svg.append('g')
    //     .attr('transform', `translate(${margin}, ${height + margin})`)
    //     .call(xAxis);
    d3.select(splotSvg.current)
        .append('g')
        .attr('transform', `translate(${marginWidth}, ${marginHeight})`)
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
    const lt100Line = d3.line()
        .x(d => xScale(d.time))
        .y(d => yScale(d.lt100))

    d3.select(splotSvg.current)
        .selectAll('.lt100')
        .raise()
        .data(data)
        .enter()
        .append("path")
        .attr('transform', `translate(${marginWidth}, ${marginHeight})`)
        .attr('class', 'lt100')
        .attr("d", lt100Line(data))
        .attr("fill", "none")
        .attr("stroke", gColor[1])
        .attr("stroke-width", '0.5')
    }
    return (
        <svg ref={splotSvg} width={svgWidth} height={svgHeight}></svg>
    );
};

export default Performanceplot;