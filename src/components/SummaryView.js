import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";

import Histogramplot from "./Histogramplot";
import Radarplot from "./Radarplot";
const SummaryView = (props) => {
    const summarySvg = useRef(null);
    const svgMargin = 30;
    const textWidth = 300;
    const lineHeight = 30;
    const svgHeight = 340;
    // const svgHeight = lineHeight * 6 + svgMargin;
    const svgWidth = textWidth + svgMargin * 2;
    const brushedTime = props.brushedTime;
    const data = props.data;
    const [totalData, setTotalData] = useState([]); // save the real data of all
    const [radarData, setRadarData] = useState([]);
    const [totalRadarData, setTotalRadarData] = useState([]);
    const [viewMode, setViewMode] = useState("Radar plot");

    useEffect(() => {
        const textlines = [];
        let selectedTime = [];
        if (brushedTime.length == 0) {
            data.top.forEach(d => {
                selectedTime.push(d.time)
            })
        } else {
            selectedTime = brushedTime;
        }
        // Throughput (MB/s)
        let throughput = 0
        let throughput_sum = 0;
        selectedTime.map(time => {
            data.throughput.forEach(element => {
                if (element.time == time)
                    throughput_sum += element.throughput;
            })
        })
        throughput = throughput_sum / selectedTime.length

        // Avg. Queue depth (counts)
        let avgQueue = 0
        let queueDepth_dict = {};    //dict, QD 0 ~ QD 31 counts
        selectedTime.map(time => {
            data.queue.forEach(element => {
                if (element.time == time) {
                    if (element.value_y in queueDepth_dict)
                        queueDepth_dict[element.value_y] += element.count
                    else
                        queueDepth_dict[element.value_y] = element.count
                }
            })
        })

        let queue_total = 0;     // sum of (queue depth * queue counts)
        let queue_counts = 0;    // sum of queue counts
        Object.keys(queueDepth_dict).forEach((key) => {
            queue_total += key * queueDepth_dict[key];
            queue_counts += queueDepth_dict[key];
        })
        avgQueue = queue_total / queue_counts;

        // Max. latency
        let maxLatency_us = 0
        selectedTime.map(time => {
            data.latency.forEach(element => {
                if ((element.time == time) && (element.count > 0)) {
                    if (maxLatency_us < element.value_y) {
                        maxLatency_us = element.value_y;
                    }
                }
            })
        })

        // Avg. CPU Utilization
        let avgCpuUtil = 0
        selectedTime.map(time => {
            data.top.forEach(element => {
                if ((element.time == time)) {
                    let idle = 0;
                    let cores = 0;
                    Object.keys(element).forEach((key) => {
                        if (key.includes('_idle')) {
                            idle += element[key];
                            cores++;
                        }
                    })
                    avgCpuUtil += 100 - (idle / cores)
                }
            })
        })
        avgCpuUtil = avgCpuUtil / selectedTime.length

        // Avg. Memory Utilization
        let avgMemUtil = 0
        selectedTime.map(time => {
            data.top.forEach(element => {
                if ((element.time == time)) {
                    avgMemUtil += (element.mem_total - element.mem_free) / element.mem_total * 100;
                }
            })
        })
        avgMemUtil = avgMemUtil / selectedTime.length

        // Avg Space
        let avgFsUtil = 0
        selectedTime.map(time => {
            data.f2fs_status.forEach(element => {
                if ((element.time == time)) {
                    avgFsUtil += element.util;
                }
            })
        })
        avgFsUtil = avgFsUtil / selectedTime.length

        // 6 가지
        // throughput / avg Queue depth / max latency
        // max cpu util / max mem util / avg space
        textlines.push(`${'Avg. Throughput'.padEnd(16, '\u00a0')}: ${Math.round(throughput * 100) / 100} MB/s`)
        textlines.push(`${'Max. Latency'.padEnd(16, '\u00a0')}: ${Math.round(maxLatency_us / 1000) / 100} ms`)
        textlines.push(`${'Avg. Q-Counts'.padEnd(16, '\u00a0')}: ${Math.round(avgQueue * 100) / 100}`)
        textlines.push(`${'Avg. CPU Util.'.padEnd(16, '\u00a0')}: ${Math.round(avgCpuUtil * 100) / 100} %`)
        textlines.push(`${'Avg. Mem Util.'.padEnd(16, '\u00a0')}: ${Math.round(avgMemUtil * 100) / 100} %`)
        textlines.push(`${'Avg. FS Util.'.padEnd(16, '\u00a0')}: ${Math.round(avgFsUtil * 100) / 100} %`)
        // textlines.push(`Lat-99.99%: ${Math.round(latency_9999 * 100) / 100} ms`)

        let brushedRadar = []
        brushedRadar.push({ axis: "Throughput", value: throughput / totalData["Throughput"] });
        brushedRadar.push({ axis: "Latency", value: maxLatency_us / totalData["Latency"] });
        brushedRadar.push({ axis: "Q-Counts", value: avgQueue / 32 });
        brushedRadar.push({ axis: "CPU Util.", value: avgCpuUtil / 100 });
        brushedRadar.push({ axis: "Mem Util.", value: avgMemUtil / 100 });
        brushedRadar.push({ axis: "FS Util.", value: avgFsUtil / 100 });
        if ((brushedTime.length == 0) && (totalRadarData.length == 0)) {
            // totalRadarData.push({ axis: "Throughput", value: 0.5 });
            // totalRadarData.push({ axis: "Latency", value: 0.5 });
            // totalRadarData.push({ axis: "Q-Counts", value: 0.5 });
            // totalRadarData.push({ axis: "CPU Util.", value: avgCpuUtil / 100 });
            // totalRadarData.push({ axis: "Mem Util.", value: avgMemUtil / 100 });
            // totalRadarData.push({ axis: "FS Util.", value: avgFsUtil / 100 });
            setTotalData({
                "Throughput": throughput,
                "Latency": maxLatency_us,
                "Q-Counts": avgQueue,
                "CPU Util.": avgCpuUtil,
                "Mem Util.": avgMemUtil,
                "FS Util.": avgFsUtil
            })
            setTotalRadarData([
                { axis: "Throughput", value: 1.0 },
                { axis: "Latency", value: 1.0 },
                { axis: "Q-Counts", value: avgQueue / 32 },
                { axis: "CPU Util.", value: avgCpuUtil / 100 },
                { axis: "Mem Util.", value: avgMemUtil / 100 },
                { axis: "FS Util.", value: avgFsUtil / 100 }]
            )
        }
        setRadarData([totalRadarData, brushedRadar])

        // let _radarData = []
        // if(totalRadarData.length > 1){
        // _radarData = totalRadarData
        // }
        // if(brushedRadar.length > 1){
        //     _radarData.push(totalRadarData);

        // }
        // console.log(_radarData)

        d3.select(summarySvg.current)
            .selectAll('text')
            .data(textlines)
            .join(
                enter => enter
                    .append('text')
                    .text(textline => textline)
                    // .attr('x', textWidth * 0.15)
                    .attr('x', 0)
                    .attr('y', (textline, i) => {
                        return lineHeight * i + svgMargin;
                    })
                    .style('font-family', 'Consolas, monospace')
                    .attr('fill', 'black')
                    .attr('text-anchor', 'start')
                    .attr('textbaseline', 'bottom')
                    .attr('font-size', '17px'),
                update => update
                    .text(textline => textline),
                exit => exit.remove(),
            )



        // d3.select(summarySvg.current)
        //     .append('rect')
        //     .attr('x', summaryX)
        //     .attr('y', summaryY)
        //     .attr('width', svgWidth)
        //     .attr('height', svgHeight)
        //     .style('fill', 'none')
        //     .style('stroke', 'black');



    }, [brushedTime, totalRadarData, totalData, viewMode]);

    //     useEffect(() => {
    // console.log(viewMode)
    //     }, [viewMode]);

    // return (
    //     <div>
    //         <button className='btn-summary-toggle'>Plane Text</button>
    //         <h2 className='header'>Summary</h2>

    //         <div style={{ display: "flex", justifyContent: "center" }}>
    //             {/* SummaryView를 왼쪽에 배치 */}
    //             {/* <div>
    //             <svg ref={summarySvg} width={svgWidth} height={svgHeight}></svg>
    //         </div> */}

    //             {/* Radarplot을 오른쪽에 배치 */}
    //             <div>
    //                 <Radarplot radarData={radarData} gColor={props.gColor} />
    //             </div>
    //         </div>
    //     </div>

    // );

    const toggleView = () => {
        setViewMode((prevMode) => (prevMode === "summary" ? "Radar plot" : "summary"));
    };

    return (
        <div>
            <div>
                <button onClick={toggleView} className='btn-summary-toggle'>
                    {viewMode === "summary" ? "Radar plot" : "Summary"}
                </button>
                <h2 className='header'>Summary</h2>
            </div>

            {/* Toggle 버튼 */}

            <div className="summary-container">
                {/* 조건에 따라 렌더링 */}
                {viewMode === "summary" ? (
                    <svg ref={summarySvg} width={svgWidth} height={svgHeight}></svg>
                ) : (
                    <Radarplot totalData={totalData} radarData={radarData} gColor={props.gColor} gColorRGBA={props.gColorRGBA} />
                )}
            </div>

        </div>
    );

};

export default SummaryView;