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
    let brushedTime = props.brushedTime;
    // console.log("brusehedtime", brushedTime)
    let timeArray = localData.map(d => d.time)
    const timeSet = new Set;
    timeArray.forEach((d, i) => {
        timeSet.add(d)
    })
    // console.log('set', timeSet)
    timeArray = Array.from(timeSet);

    useEffect(() => {


        let minX = d3.min(timeArray)
        let maxX = d3.max(timeArray)

        const svg = d3.select(splotSvg.current);

        const yVars = new Set;
        // console.log(data)
        data.forEach((d, i) => {
            yVars.add(String(d.value_y))
        })
        let yVarsArray = Array.from(yVars);
        const yLength = yVarsArray.length;

        let xScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.time), d3.max(data, d => d.time)])
            .range([0, width]);

        let yScale = d3.scaleBand()
            .domain(yVarsArray)
            .range([height, 0]);


        svg.append("g")
            .attr('transform', `translate(${margin}, ${height + margin})`)
            .call(d3.axisBottom(xScale))

        let bandwidth = d3.max(data, d => d.time) - d3.min(data, d => d.time);

        svg.append("g")
            .attr('transform', `translate(${margin}, ${margin})`)
            .call(d3.axisLeft(yScale))


        const myColor = d3.scaleLinear()
            // .range(["lightgreen", "#69b3a2"])
            // .range(["white", "lightblue" ,"blue", "red"])
            // .domain([0, d3.min(data, d => d.value) + 1, max/20, d3.max(data, d => d.value)])
            .range(["lightgreen", "lightblue", "blue"])
            .domain([0, d3.min(data, d => d.count) + 1, d3.max(data, d => d.count)])
        // console.log("count", d3.min(data_value)+1)

        svg.append("g")
            // .attr("transform", `translate(${margin}, ${margin})`)
            .attr("transform", `translate(${margin}, ${margin})`)
            .selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr("x", d => xScale(d.time))
            .attr("y", d => yScale(String(d.value_y)))
            .attr("width", width / bandwidth)
            .attr("height", height / yLength)
            .style("stroke-width", "0")
            .attr("stroke", function (d) { return myColor(d.count) })
            // .attr("opacity", function (d) { if (d.value === 0) return 0 })
            .style("fill", function (d) { return myColor(d.count) })
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
                // props.setBrushedTime(null);
                return;
            } else {

                let [[x0, y0], [x1, y1]] = selection;

                const selectedData = rects.filter((d) => {
                    // console.log("d.x, d.y", d.x, d.y);
                    let xCoord = xScale(d.time);
                    let yCoord = yScale(String(d.value_y));
                    // console.log("value", d.value)
                    // console.log("xCoord", xCoord)
                    // console.log("yCoord", yCoord)
                    return x0 <= xCoord && xCoord <= x1 && y0 <= yCoord && yCoord <= y1 && d.value > 0;
                }).data()
                    .map(({ time }) => ({
                        time,

                    }));
                setLocalData(selectedData);
                // console.log("local Data:", localData);
                const selectedRect = rects.filter((d) => {

                    let xCoord = xScale(d.time);
                    let yCoord = yScale(String(d.value_y));

                    // console.log("xCoord", d3.max(xCoord));
                    return x0 <= xCoord && xCoord <= x1 && y0 <= yCoord && yCoord <= y1;

                });
                // console.log("selectedRect", selectedData)
                selectedRect.nodes().map((d, i) => {

                    // d3.selectAll('circle.'+ d.classList[0]).style("fill", "red");
                    // d3.selectAll('circle.'+ d.classList[0]).style("stroke", "red");
                    // d3.selectAll('circle.'+ d.classList[0]).attr("r", 2);
                });
                props.setBrushedTime(selectedData);
            
            
            }
            // console.log("brushed data ", Index);
        };

        // svg.select('rect.background').remove();
        // svg.selectAll('rect.background')
        //     .join(
        //         enter => enter.append('rect')
        //             .attr("class", 'background')
        //             .attr("x", xScale(minX))
        //             .attr("y", 0)
        //             .attr("widht", xScale(maxX) - xScale(minX))
        //             .attr("height", height)
        //             .style("fill", "rgba(255, 0, 0, 0.5)")
        //         ,
        //         update => update
        //             .attr("class", 'background')
        //             .attr("x", xScale(minX))
        //             .attr("y", 0)
        //             .attr("widht", xScale(maxX) - xScale(minX))
        //             .attr("height", height)
        //             .style("fill", "rgba(255, 0, 0, 0.5)")
        //         ,
        //         exit => exit.remove()
        //     )


        // Histogram Begin

        // console.log(yVarsArray)
        // yVarsArray = yVarsArray.sort(compare)
        // console.log(yVarsArray)
        let hist = Object.fromEntries(yVarsArray.map(d => [d, 0]))
        
        data.forEach((d)=>{
            hist[d.value_y] += d.count
        })
        // console.log(hist)
        // hist = Object.keys(hist).sort(compare);
        // console.log(hist)
        let histWidth = 100;
        let histScale = d3.scaleLinear()
            .domain([0, d3.max(Object.values(hist))])
            .range([histWidth, 0]);

        let points = [[histWidth, height]]
        Object.keys(hist).forEach(key => {
            // console.log(key)
                points.push([histScale(hist[key]), yScale(key)])
            // return [key, hist[key]]
        })
        // points.push([0,100])
        var compare = function(a, b) {
            return a[1] - b[1]
          }
        
        points.sort(compare)

        // console.log(yScale.domain())
        // console.log(points)
        // console.log(points)
        d3.select(splotSvg.current)
            .append('g')
            .attr('transform', `translate(${margin}, ${margin})`)
            .append('path')
            .style('stroke', 'black')
            .style('fill', 'none')
            .attr('d', d3.line().curve(d3.curveNatural)(points))
        // Histogram End

    }, []);

    useEffect(()=>{
        const svg = d3.select(splotSvg.current);
        const yVars = new Set;

        // console.log('timearra', brushedTime)
        let minX = d3.min(timeArray)
        let maxX = d3.max(timeArray)
        let xScale = d3.scaleLinear()
            .domain([d3.min(data, d => d.time), d3.max(data, d => d.time)])
            .range([0, width]);

        // console.log("local", localData)

        
        svg.selectAll('rect.background')
        .data(brushedTime)
        .join(
            enter => enter
                .append('rect')
                .attr("class", "background")
                .attr('transform', `translate(${margin}, ${margin})`)
                .attr("x", xScale(minX))
                .attr("y", 0)
                .attr("height", height)
                .attr("width",
                    xScale(maxX) - xScale(minX)
                )
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

    }, [brushedTime]);

    return (
        <div className='innerplot-container'>
            <svg ref={splotSvg} width={svgWidth} height={svgHeight}>
            </svg>
        </div>
    )
};

export default HeatMaps;
