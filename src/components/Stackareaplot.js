import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const Stackareaplot = (props) => {
    const splotSvg = useRef(null);

    const gColor = props.gColor;
    const gColorRGBA = props.gColorRGBA;
    const width = props.width;
    const height = props.height;
    const data = props.data;
    const checkPointData = props.checkPointData;
    const gcData = props.gcData;
    const marginWidth = props.marginWidth;
    const marginHeight = props.marginHeight;
    const legendWidth = 100

    const svgWidth = marginWidth * 2 + width + legendWidth;
    const svgHeight = marginHeight * 2 + height;
    let brushedTime = props.brushedTime;

    useEffect(() => {
        const svg = d3.select(splotSvg.current);

        //doubleclick하면 brushedTime 초기화
        svg.on("dblclick", () => {

            props.setBrushedTime([]);
        });

        data.forEach((d) => {
            // console.log(typeof d.time)
            let total = 0
            for (let item in d) {
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
                .tickFormat(d => d3.format(".2s")(d).replace(".0", ""))
            )

        // area
        const area = d3.area()
            .x(d => x(d.data.time))
            .y0(d => y(d[0]))
            .y1(d => y(d[1]));

        let color = d3.scaleOrdinal()
            .domain(keys)
            .range(gColor)
        let colorRGBA = d3.scaleOrdinal()
            .domain(keys)
            .range(gColorRGBA)

        // color palette
        if (props.type === "Memory") {
            color = d3.scaleOrdinal()
                .domain(keys)
                .range([gColor[4], gColor[5], gColor[3]]);

            colorRGBA = d3.scaleOrdinal()
                .domain(keys)
                .range([gColorRGBA[4], gColorRGBA[5], gColorRGBA[3]])
        }else{
            color = d3.scaleOrdinal()
                .domain(keys)
                .range([gColor[4], gColor[5], gColor[2],gColor[3]]);

            colorRGBA = d3.scaleOrdinal()
                .domain(keys)
                .range([gColorRGBA[4], gColorRGBA[5], gColorRGBA[2],gColorRGBA[3]])
        }

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
            .style("fill", function (d) { return colorRGBA(d.key); })
            // .style("fill", "white")
            .style("stroke-width", "1")
            .style("stroke", function (d) { 
                if((d.key === "Free") || (d.key === "idle")){
                    return "grey"
                }
                else {
                    return color(d.key); 
                }
            })
            .lower()

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
            .style("pointer-events", ()=>{
                if(props.type === "CPU"){

                }
                else return "none"
            } )
        // Top3 Hovering End

        // legend
        const legendRectSize = 15;
        const legendSpacing = 5;

        const legend = svg.append("g")
            .attr("transform", `translate(${width + marginWidth * 2}, ${marginHeight * 2})`);

        const legendItems = legend.selectAll("legend")
            .data(keys)
            .enter()
            .append("g")
            .attr("class", "legend")
            .attr("transform", (d, i) => `translate(0, ${i * (legendRectSize + legendSpacing)})`);

        legendItems.append("rect")
            .attr("width", legendRectSize)
            .attr("height", legendRectSize)
            .style("fill", color)
            .style("stroke", "black")
            .style("stroke-width", "0.5")
            ;

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
        
        if(props.type === "F2FS"){

            legend.append("text")
                .attr("x", 20)
                .attr("y", 90)
                .attr('font-size', '13px')
                .text("Checkpoint");
    
            legend.append("line")
                .attr("x1", 0)
                .attr("x2", 15)
                .attr("y1", 87.5)
                .attr("y2", 87.5)
                .style("stroke", "black")
                .style("stroke-width", 2)
                .style("stroke-dasharray", "3")

            legend.append("text")
                .attr("x", 20)
                .attr("y", 110)
                .attr('font-size', '13px')
                .text("Cleaning");
    
            legend.append("line")
                .attr("x1", 0)
                .attr("x2", 15)
                .attr("y1", 107.5)
                .attr("y2", 107.5)
                .style("stroke", "black")
                .style("stroke-width", 2)
                // .style("stroke-dasharray", "3")
        }

        // legend end

        const brush = d3.brush()
            .extent([[0, 0], [width, height]])
            .on("start", resetBrushed)
            .on("end", brushed);

        svg.append('g')
            .attr('class', 'brush')
            .attr('transform', `translate(${marginWidth}, ${marginHeight})`);

        if(props.type != "CPU"){
            svg.select('.brush').call(brush);
        }

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

        // gc time check point
        //console.log(checkPointData)
        if (checkPointData != null) {
            let checkPointData_length = 0;
            checkPointData_length = checkPointData.length
            // delta gc time
            let changingEventTimes = [];
            for (let i = 1; i < checkPointData_length; i++) {
                if (checkPointData[i].event !== checkPointData[i - 1].event) {
                    changingEventTimes.push(checkPointData[i].time);
                }
            }
            //console.log(changingGCTimes);

            // 해당하는 위치에 빨간 선 추가
            const redLines = svg.selectAll("line.cp-line")
                .data(changingEventTimes)
                .enter()
                .append("line")
                .attr("class", "cp-line")
                .attr("x1", (d) => x(d) + marginWidth)
                .attr("y1", marginHeight)
                .attr("x2", (d) => x(d) + marginWidth)
                .attr("y2", height + marginHeight)
                .style("stroke", "black")
                .style("stroke-dasharray", "2,2")
                .style("stroke-width", 3)
                .raise();

            // .attr("transform", `translate(${width + marginWidth * 2}, ${marginHeight * 2})`);

        }

        if (gcData != null) {
            let gcData_length = 0;
            gcData_length = gcData.length
            // delta gc time
            let changingEventTimes = [];
            for (let i = 1; i < gcData_length; i++) {
                if (gcData[i].event !== gcData[i - 1].event) {
                    changingEventTimes.push(gcData[i].time);
                }
            }
            //console.log(changingGCTimes);

            // 해당하는 위치에 빨간 선 추가
            const redLines = svg.selectAll("line.gc-line")
                .data(changingEventTimes)
                .enter()
                .append("line")
                .attr("class", "gc-line")
                .attr("x1", (d) => x(d) + marginWidth)
                .attr("y1", marginHeight)
                .attr("x2", (d) => x(d) + marginWidth)
                .attr("y2", height + marginHeight)
                .style("stroke", "black")
                // .style("stroke-dasharray", "2,2")
                .style("stroke-width", 3)
                .raise();

            // .attr("transform", `translate(${width + marginWidth * 2}, ${marginHeight * 2})`);

        }

    }, []);


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
        <svg ref={splotSvg} width={svgWidth} height={svgHeight}></svg>
    );
};

export default Stackareaplot;