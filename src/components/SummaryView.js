import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

import Histogramplot from "./Histogramplot";
const SummaryView = (props) => {
    const summarySvg = useRef(null);
    const svgMargin = 30;
    const textWidth = 300;
    const lineHeight = 30;
    const svgHeight = lineHeight * 6 + svgMargin;
    const svgWidth = textWidth + svgMargin * 2;
    const brushedTime = props.brushedTime;
    const data = props.data;
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
        textlines.push(`${'Avg. CPU util.'.padEnd(16, '\u00a0')}: ${Math.round(avgCpuUtil * 100) / 100} %`)
        textlines.push(`${'Avg. Mem util.'.padEnd(16, '\u00a0')}: ${Math.round(avgMemUtil * 100) / 100} %`)
        textlines.push(`${'Avg. FS util.'.padEnd(16, '\u00a0')}: ${Math.round(avgFsUtil * 100) / 100} %`)
        // textlines.push(`Lat-99.99%: ${Math.round(latency_9999 * 100) / 100} ms`)

        d3.select(summarySvg.current)
            .selectAll('text')
            .data(textlines)
            .join(
                enter => enter
                    .append('text')
                    .text(textline => textline)
                    .attr('x', textWidth * 0.1)
                    .attr('y', (textline, i) => {
                        return lineHeight * i + svgMargin;
                    })
                    .style('font-family', 'monospace')
                    .attr('fill', 'black')
                    .attr('text-anchor', 'start')
                    .attr('textbaseline', 'bottom')
                    .attr('font-size', '22px'),
                update => update
                    .text(textline => textline),
                exit => exit.remove(),
            )


        const summaryX = 0;
        const summaryY = 0;

        // d3.select(summarySvg.current)
        //     .append('rect')
        //     .attr('x', summaryX)
        //     .attr('y', summaryY)
        //     .attr('width', svgWidth)
        //     .attr('height', svgHeight)
        //     .style('fill', 'none')
        //     .style('stroke', 'black');

    }, [brushedTime]);

    return (
        <div>
            <svg ref={summarySvg} width={svgWidth} height={svgHeight}>

            </svg>

            {/* <Histogramplot brushedTime={brushedTime} /> */}

        </div>
    )
};

export default SummaryView;
