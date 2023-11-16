import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";


const Scatterplot = (props) => {

    const splotSvg = useRef(null);
    const canvasHist = useRef(null);
    const svgSize_w = props.margin * 2 + props.size * 7;
    const svgSize_h = props.margin * 2 + props.size;
    const width = props.size * 7;
    const height = props.size;
    const data = props.data;
    const radius = props.radius;
    const margin = props.margin;

    const histWidth = 50;

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
                    .map(({ idx }) => ({
                        idx,

                    }));
                console.log("Selected Data:", selectedData);
                props.setBrushedIndex(selectedData);
                // setIndex(selectedData);

            }
            // console.log("brushed data ", Index);
        };



        // console.log(data_y)
        const nbin = 100;
        let hist = d3.bin()
            .value(d => d)
            .domain(yScale.domain())
            .thresholds(yScale.ticks(nbin));

        let bins = hist(data_y);


        let histScale = d3.scaleLinear()
            .domain([0, d3.max(bins.map(d => d.length))])
            .range([histWidth, 0]);


        // d3.select(canvasHist.current)
        //     .attr('transform', `translate(100, ${margin})`)
        //     .append('g')
        //     .selectAll('path')
        //     .join(
        //         enter => enter
        //             .append('path')
        //             .attr('stroke', 'black')
        //             .attr('fill', 'blue')
        //     );
        drawHist(bins);

        // function drawHist(bins) {
        //     var context = d3.select(canvasHist.current).node().getContext('2d');
        //     context.fillStyle = "red";
        //     context.moveTo(histScale(0), yScale(0));
        //     bins.forEach((bin) => {
        //         context.lineTo(histScale(bin.length), yScale((bin.x1 + bin.x0) / 2));
        //     })
        //     context.closePath();
        //     context.fill();
        //     context.stroke();
        //     // d3.select(canvasHist.current)
        //     // .attr("transform", `translate(20,20)`)
        // }

        function drawHist(bins) {
            d3.select(splotSvg.current)
                .append('g')
                .attr('transform', `translate(${margin}, ${margin})`)
                .append('path')
                .style('stroke', 'none')
                .style('fill', 'red')
                .attr('d', () => {
                    let context = d3.path()
                    context.moveTo(histWidth - histScale(histScale.domain()[0]), yScale(yScale.domain()[0]));
                    bins.forEach((bin) => {
                        context.lineTo(histWidth - histScale(bin.length), yScale((bin.x1 + bin.x0) / 2))
                    })
                    context.lineTo(histWidth - histScale(histScale.domain()[0]), yScale(yScale.domain()[0]));
                    return context;
                })

            // d3.select(canvasHist.current)
            // .attr("transform", `translate(20,20)`)
        }
    }, []);

    return (
        <div className='innerplot-container'>
            {/* <canvas ref={canvasHist} width={histWidth} height={height}/>     */}
            <svg ref={splotSvg} width={svgSize_w} height={svgSize_h}>
 
            </svg>
        </div>
    )
};

export default Scatterplot;
