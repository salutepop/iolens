import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
// TODO


const Radarplot = (props) => {
    const gColor = props.gColor;
    const gColorRGBA = props.gColorRGBA;
    const svgRadar = useRef(null);
    const svgMargin = 30;
    const plotSize = 250;
    const plotMargin = 50;
    const svgHeight = plotSize + svgMargin * 3;
    const svgWidth = plotSize + svgMargin * 4
    let totalData = {}
    let radarData = []
    const radarUnit = {
        "Throughput": " MB/s",
        "Latency": " usec",
        "Q-Counts": " I/Os",
        "CPU Util.": " %",
        "Mem Util.": " MB",
        "FS Util.": " %"
    }
    useEffect(() => {
        let data = [
            [
                { axis: "Throughput", value: 0 },
                { axis: "Latency", value: 0 },
                { axis: "Q-Counts", value: 0 },
                { axis: "CPU Util.", value: 0 },
                { axis: "Mem Util.", value: 0 },
                { axis: "FS Util.", value: 0 }
            ],
            [
                { axis: "Throughput", value: 0 },
                { axis: "Latency", value: 0 },
                { axis: "Q-Counts", value: 0 },
                { axis: "CPU Util.", value: 0 },
                { axis: "Mem Util.", value: 0 },
                { axis: "FS Util.", value: 0 }
            ],
        ]
        
        if (props.radarData != undefined) {
            if(props.radarData[0] != undefined){
                if(props.radarData[0].length > 0){
                    data = props.radarData;
                }
            }
        }
        totalData = props.totalData;
        radarData = props.radarData;
        // console.log(data)
        var cfg = {
            w: plotSize,				//Width of the circle
            h: plotSize,				//Height of the circle
            margin: plotMargin, //The margins of the SVG
            levels: 5,				//How many levels or inner circles should there be drawn
            maxValue: 1, 			//What is the value that the biggest circle will represent
            labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
            wrapWidth: 120, 		//The number of pixels after which a label needs to be given a new line
            opacityArea: 0.35, 	//The opacity of the area of the blob
            dotRadius: 4, 			//The size of the colored circles of each blog
            opacityCircles: 0.1, 	//The opacity of the circles of each blob
            strokeWidth: 2, 		//The width of the stroke around each blob
            color: d3.scaleOrdinal(gColor)	//Color function
        };

        var maxValue = 1
        var maxValue = Math.max(cfg.maxValue,
            d3.max(data, d => { return d3.max(d.map(o => { return o.value; })) }));
        // if (data === undefined){
        //     maxValue = 1
        // }

        var allAxis = ["Throughput", "Latency", "Q-Counts", "CPU Util.", "Mem Util.", "FS Util."],	//Names of each axis
            total = allAxis.length,					//The number of different axes
            radius = Math.min(cfg.w / 2, cfg.h / 2), 	//Radius of the outermost circle
            Format = d3.format('.0%'),			 	//Percentage formatting
            angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"

        var rScale = d3.scaleLinear()
            .range([0, radius])
            .domain([0, maxValue]);

        let svg = d3.select(svgRadar.current);
        var radarLine = d3.lineRadial()
            .curve(d3.curveLinearClosed)
            .radius(function (d) { return rScale(d.value); })
            .angle(function (d, i) { return i * angleSlice; });
        var blobWrapper = svg.select('.radarG');
        //.selectAll(".radarWrapper")
        // .join(
        //     enter => enter
        //         .append('g')
        //         .attr("class", "radarWrapper"),
        //     update => update,
        //     exit => exit.remove(),
        // )
        //Append the backgrounds	
        blobWrapper
            .selectAll(".radarArea")
            .data(data)
            .join(
                enter => enter
                    .append("path")
                    .attr("class", "radarArea")
                    .attr("d", function (d, i) { return radarLine(d); })
                    .style("fill", function (d, i) { return cfg.color(i); })
                    .style("fill-opacity", cfg.opacityArea)
                    ,
                update => update
                    .attr("d", function (d, i) { return radarLine(d); })
                ,
                exit => exit.remove()
            )

        //Create the outlines	
        blobWrapper
            .selectAll(".radarStroke")
            .data(data)
            .join(
                enter => enter
                    .append("path")
                    .attr("class", "radarStroke")
                    .style("stroke-width", cfg.strokeWidth + "px")
                    .style("stroke", (d, i) => cfg.color(i))
                    .style("fill", "none")
                    .attr("d", function (d, i) { return radarLine(d); }),
                update => update
                    .attr("d", function (d, i) { return radarLine(d); }),
                exit => exit.remove()

            )

        //Append the circles
        // blobWrapper
        // .selectAll(".radarCircle")
        // .data(data)
        // // .data(dd=>dd)
        //     .join(
        //         enter => enter
        //             .append("circle")
        //             .attr("class", "radarCircle")
        //             .attr("r", cfg.dotRadius)
        //             .attr("cx", function (d, i) { return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2); })
        //             .attr("cy", function (d, i) { return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2); })
        //             .style("fill", function (d, i, j) { return cfg.color(j); })
        //             .style("fill-opacity", 0.8),
        //         update => update
        //             .attr("cx", function (d, i) { return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2); })
        //             .attr("cy", function (d, i) { return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2); })
        //         ,
        //         exit => exit.remove()
        // )

       

        // var blobCircleWrapper = svg.select('.radarG')
        //     .data(data);
        // .selectAll(".radarCircleWrapper")
        //     .data(data)
        //     .join(
        //         enter => enter
        //             .append("g")
        //             .attr("class", "radarCircleWrapper"),
        //         update => update,
        //         exit => exit.remove(),
        //     )

        //Append a set of invisible circles on top for the mouseover pop-up
        // blobCircleWrapper.selectAll(".radarInvisibleCircle")
        //     .data(function (d, i) { return d; })
        //     .join(
        //         enter => enter
        //             .append("circle")
        //             .attr("class", "radarInvisibleCircle")
        //             .attr("r", cfg.dotRadius * 1.5)
        //             .attr("cx", function (d, i) { return rScale(d.value) * Math.cos(angleSlice * i - Math.PI / 2); })
        //             .attr("cy", function (d, i) { return rScale(d.value) * Math.sin(angleSlice * i - Math.PI / 2); })
        //             .style("fill", "none")
        //             .style("pointer-events", "all"),
        //         update => update,
        //         exit => exit.remove()
        //     )
    }, [props.radarData])

    useEffect(() => {

        totalData = props.totalData;
        radarData = props.radarData;

        var data = []
        if (props.data != undefined) {
            data = props.radarData
        }
        var cfg = {
            w: plotSize,				//Width of the circle
            h: plotSize,				//Height of the circle
            margin: plotMargin, //The margins of the SVG
            levels: 5,				//How many levels or inner circles should there be drawn
            maxValue: 1, 			//What is the value that the biggest circle will represent
            labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
            wrapWidth: 120, 		//The number of pixels after which a label needs to be given a new line
            opacityArea: 0.35, 	//The opacity of the area of the blob
            dotRadius: 4, 			//The size of the colored circles of each blog
            opacityCircles: 0.1, 	//The opacity of the circles of each blob
            strokeWidth: 2, 		//The width of the stroke around each blob
            color: d3.scaleOrdinal(d3.schemeCategory10)	//Color function
        };

        var maxValue = 1
        // var maxValue = Math.max(cfg.maxValue,
        //     d3.max(data, d => { return d3.max(d.map(o => { return o.value; })) }));
        // if (data === undefined){
        //     maxValue = 1
        // }

        var allAxis = ["Throughput", "Latency", "Q-Counts", "CPU Util.", "Mem Util.", "FS Util."],	//Names of each axis
            total = allAxis.length,					//The number of different axes
            radius = Math.min(cfg.w / 2, cfg.h / 2), 	//Radius of the outermost circle
            Format = d3.format('.0%'),			 	//Percentage formatting
            angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"

        var rScale = d3.scaleLinear()
            .range([0, radius])
            .domain([0, maxValue]);

        let svg = d3.select(svgRadar.current);

         // 범례 추가
         svg.append("g")
         .attr("class", "legend")
         .attr("transform", `translate(${cfg.w + 30}, ${30})`);

     // Total 범례
     svg.select(".legend")
         .append("rect")
         .attr("class", "legendTotal")
         .attr("width", 15)
         .attr("height", 15)
         .style("fill", gColor[0])
         .style("fill-opacity", 1)
         .style("stroke", "black")
         .style("stroke-width", "0.5");

     svg.select(".legend")
         .append("text")
         .attr("class", "legendText")
         .attr("x", 20)
         .attr("y", 10)
         .style("font-size", "12px")
         .text("Total");

     // Brushed 범례
     svg.select(".legend")
         .append("rect")
         .attr("class", "legendBrushed")
         .attr("width", 15)
         .attr("height", 15)
         .attr("y", 20)
         .style("fill", gColor[1])
         .style("fill-opacity", 1)
         .style("stroke", "black")
         .style("stroke-width", "0.5");

     svg.select(".legend")
         .append("text")
         .attr("class", "legendText")
         .attr("x", 20)
         .attr("y", 30)
         .style("font-size", "12px")
         .text("Brushed");

        var g = svg.append("g")
            // .attr("transform", "translate(" + (cfg.w / 2 + cfg.margin.left)
            //                 + "," + (cfg.h / 2 + cfg.margin.top) + ")");
            .attr("transform", `translate(${cfg.w / 2 + cfg.margin},${cfg.h / 2 + cfg.margin})`)
            .attr("class", "radarG")
        var axisGrid = g.append("g").attr("class", "axisWrapper");

        //Draw the background circles
        axisGrid.selectAll(".levels")
            .data(d3.range(1, (cfg.levels + 1)).reverse())
            .join(
                enter => enter
                    .append("circle")
                    .attr("class", "gridCircle")
                    .attr("r", d => radius / cfg.levels * d)
                    .style("fill", "#CDCDCD")
                    .style("stroke", "#CDCDCD")
                    .style("fill-opacity", cfg.opacityCircles),
                update => update,
                exit => exit.remove()
            )
        //Text indicating at what % each level is
        axisGrid.selectAll(".axisLabel")
            .data(d3.range(1, (cfg.levels + 1)).reverse())
            .join(
                enter => enter
                    .append("text")
                    .attr("class", "axisLabel")
                    .attr("x", 4)
                    .attr("y", function (d) { return -d * radius / cfg.levels; })
                    .attr("dy", "0.4em")
                    .style("font-size", "12px")
                    .attr("fill", "#737373")
                    .text(function (d, i) { return Format(maxValue * d / cfg.levels); })
                ,
                update => update,
                exit => exit.remove()
            )

        //Create the straight lines radiating outward from the center
        var axis = axisGrid.selectAll(".axis")
            .data(allAxis)
            .join(
                enter => enter
                    .append("g")
                    .attr("class", "axis"),
                update => update,
                exit => exit.remove()
            )

        //Append the lines
        axis.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", function (d, i) { return rScale(maxValue * 1.1) * Math.cos(angleSlice * i - Math.PI / 2); })
            .attr("y2", function (d, i) { return rScale(maxValue * 1.1) * Math.sin(angleSlice * i - Math.PI / 2); })
            .attr("class", "line")
            .style("stroke", "white")
            .style("stroke-dasharray", "3 3")
            .style("opacity", "0.5")
            .style("stroke-width", "2px");

        let tooltip_radar = d3.select("body").append("div")
            .attr("class", "tooltip-radar")
            .style('position', 'absolute')
            .style("white-space", "pre-line")
            .style("border-radius", "4px")
            .style("background", "rgba(0, 0, 0, 0.8)")
            .style("padding", "10px")
            .style("color", "white")
            .style("visibility", "collapse")
            ;
        //Append the labels at each axis
        axis.append("text")
            .attr("class", "legend")
            .style("font-size", "15px")
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .attr("x", function (d, i) { return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2); })
            .attr("y", function (d, i) { return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2); })
            .text(function (d) { return d })
            // .on('mouseover', (d) => {
            //     tooltip_radar.style("visibility", "visible");
            // })
            // .on("mouseout", () => {
            //     tooltip_radar.style("visibility", "collapse")
            // })
            // .on("mousemove", (d) => {
            //     let name = d.target.__data__;
            //     let rate = 0;
            //     let index = 0;
            //     console.log(radarData, totalData)
            //     radarData[1].map((i,idx)=>{
            //         if (i.axis === name){
            //             rate = i.value;
            //             index = idx;
            //         }
            //     })
            //     if(radarData[0][index].value == rate){
            //         rate = 1;
            //     }
            //     // console.log(name, index, rate)
            //     // console.log(radarData[1])
            //     let data = `Total\u00a0\u00a0\u00a0: ${Math.round(totalData[name])}${radarUnit[name]}
            //                 Brushed : ${Math.round(totalData[name] * rate)}${radarUnit[name]}`

            //     tooltip_radar
            //         .text(data)
            //         .style("left", (d.x - 100) + "px")
            //         .style("top", (d.y + 30) + "px")
            // })
            ;


    }, [])

    useEffect(() => {
        var data = []
        totalData = props.totalData;
        radarData = props.radarData;
        if (props.data != undefined) {
            data = props.radarData
        }

        var cfg = {
            w: plotSize,				//Width of the circle
            h: plotSize,				//Height of the circle
            margin: plotMargin, //The margins of the SVG
            levels: 5,				//How many levels or inner circles should there be drawn
            maxValue: 1, 			//What is the value that the biggest circle will represent
            labelFactor: 1.25, 	//How much farther than the radius of the outer circle should the labels be placed
            wrapWidth: 120, 		//The number of pixels after which a label needs to be given a new line
            opacityArea: 0.35, 	//The opacity of the area of the blob
            dotRadius: 4, 			//The size of the colored circles of each blog
            opacityCircles: 0.1, 	//The opacity of the circles of each blob
            strokeWidth: 2, 		//The width of the stroke around each blob
            color: d3.scaleOrdinal(gColor)	//Color function
        };

        var maxValue = 1
        // var maxValue = Math.max(cfg.maxValue,
        //     d3.max(data, d => { return d3.max(d.map(o => { return o.value; })) }));
        // // if (data === undefined){
        //     maxValue = 1
        // }


        var allAxis = ["Throughput", "Latency", "Q-Counts", "CPU Util.", "Mem Util.", "FS Util."],	//Names of each axis
            total = allAxis.length,					//The number of different axes
            radius = Math.min(cfg.w / 2, cfg.h / 2), 	//Radius of the outermost circle
            Format = d3.format('.0%'),			 	//Percentage formatting
            angleSlice = Math.PI * 2 / total;		//The width in radians of each "slice"
        var rScale = d3.scaleLinear()
            .range([0, radius])
            .domain([0, 1]);

        //debugging
        let tooltip_radar = d3.select("body").selectAll(".tooltip-radar");
        var axis = d3.select(svgRadar.current)
            .selectAll(".axis")
            .select('.legend')
        // .data(allAxis);
        axis
            .style("font-size", "15px")
            .attr("text-anchor", "middle")
            .attr("dy", "0.35em")
            .attr("x", function (d, i) { return rScale(maxValue * cfg.labelFactor) * Math.cos(angleSlice * i - Math.PI / 2); })
            .attr("y", function (d, i) { return rScale(maxValue * cfg.labelFactor) * Math.sin(angleSlice * i - Math.PI / 2); })
            .text(function (d) { return d })
            .on('mouseover', (d) => {
                tooltip_radar.style("visibility", "visible");
            })
            .on("mouseout", () => {
                tooltip_radar.style("visibility", "collapse")
            })
            .on("mousemove", (d) => {
                let name = d.target.__data__;
                let rate = 0;
                let index = 0;
                radarData[1].map((i, idx) => {
                    if (i.axis === name) {
                        rate = i.value;
                        index = idx;
                    }
                })
                if (radarData[0][index].value == rate) {
                    rate = 1;
                }
                // console.log(name, index, rate)
                // console.log(radarData[1])
                let data = `Total\u00a0\u00a0\u00a0: ${Math.round(totalData[name])}${radarUnit[name]}
                            Brushed : ${Math.round(totalData[name] * rate)}${radarUnit[name]}`

                tooltip_radar
                    .text(data)
                    .style("left", (d.x - 100) + "px")
                    .style("top", (d.y + 30) + "px")
            })
            ;


    }, [props.radarData, props.totalData])

    return (
        <svg ref={svgRadar} height={svgHeight} width={svgWidth}>
        </svg>
    )
};
export default Radarplot;