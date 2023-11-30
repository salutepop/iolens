import React, { useRef, useEffect, useState } from "react";
import Scatterplot from './Scatterplot';
import Lineplot from './Lineplot';
import Stackareaplot from "./Stackareaplot";
import HeatMaps from './HeatMaps';

import * as d3 from "d3";
import { brush } from "d3";

const PlotView = (props) => {
    const calc = props.calc;
    const throughput = props.throughput;
    const resource = props.resource;
    const top = props.top;
    const stateCheckbox = props.stateCheckbox
    const plotMargin = 20;
    const plotWidth = 1200;
    const scatterPlotHeight = 150;
    const linePlotHeight = 60;
    const radius = 0.5;
    
    //heatmap data
    const heatmap_lba = props.heatmap_lba;
    const heatmap_latency = props.heatmap_latency;
    const heatmap_queue = props.heatmap_queue;


    //jw
    let memFreeScale = d3.scaleLinear()
        .domain([d3.min(resource, d => d.mem_free), d3.max(resource, d => d.mem_free)])
        .range([0, 100]);

    resource.forEach(d => {
        d.mem_free = memFreeScale(d.mem_free);
    });


    //hyo

    let brushedData = props.brushedData;
    const [brushedx, setBrushedx] = useState([]);

    /* 지원 */
    //scatter plot으로 통일
    //line plot 추가 (throughput, resorce) = > y축 짧게

    /* 창민 */
    //latency 히스토그램. summary 아래 구현 

    /* 효림 */
    //brush는 scatter에서만 동작. scatter plot에서 구현

    //line plot에서는 index data받아서 해당 영역 색칠

    //scatterplot, linecplot에사  줌 구현 => 줌 자료 조사
    //y값 분포 line으로 그리기(논문)

    // console.log(calc);
    // console.log(throughput);

    return (
        <div className="plot-container">

            <div>
                {stateCheckbox.cpu_user && (
                    <div style={{ display: "flex" }}>
                        <h2 className="header-linleplot">
                            {"(%)\nCPU User"}
                        </h2>
                        <Lineplot
                            width={plotWidth}
                            height={linePlotHeight}
                            data={resource.map((d) => ({ timeStamp: d.timeStamp, value: d.cpu_user }))}
                            timeData={calc.map((d) => (d.issue_time))}
                            margin={plotMargin}
                            radius={radius}
                            brushedData={brushedData} />
                    </div>
                )}
            </div>

            <div>
                {stateCheckbox.cpu_system && (
                    <div style={{ display: "flex" }}>
                        <h2 className="header-linleplot">
                            {"(%)\nCPU System"}
                        </h2>
                        <Lineplot
                            width={plotWidth}
                            height={linePlotHeight}
                            data={resource.map((d) => ({ timeStamp: d.timeStamp, value: d.cpu_system }))}
                            timeData={calc.map((d) => (d.issue_time))}
                            margin={plotMargin}
                            radius={radius}
                            brushedData={brushedData} />
                    </div>
                )}
            </div>

            <div>
                {stateCheckbox.mem_free && (
                    <div style={{ display: "flex" }}>
                        <h2 className="header-linleplot">
                            {"(%)\nFree Memory"}
                        </h2>
                        <Lineplot
                            width={plotWidth}
                            height={linePlotHeight}
                            data={resource.map((d) => ({ timeStamp: d.timeStamp, value: d.mem_free }))}
                            timeData={calc.map((d) => (d.issue_time))}
                            margin={plotMargin}
                            radius={radius}
                            brushedData={brushedData} />
                    </div>
                )}
            </div>

            <div>
                {stateCheckbox.throughput && (
                    <div style={{ display: "flex" }}>
                        <h2 className="header-linleplot">
                            {"(MB/s)\nThroughput"}
                        </h2>
                        <Lineplot
                            width={plotWidth}
                            height={linePlotHeight}
                            data={throughput.map((d) => ({ timeStamp: d.timeStamp, value: d.throughput }))}
                            timeData={calc.map((d) => (d.issue_time))}
                            margin={plotMargin}
                            radius={radius}
                            brushedData={brushedData} />
                    </div>
                )}
            </div>

            <div>
                {stateCheckbox.queue && ( //graphvisivility가 참이면 랜더링, 거짓이면 렌더링 안됨.
                    <div style={{ display: "flex" }}>
                        <h2 className="header-scatterplot">
                            {"Queue Count"}
                        </h2>
                        <Scatterplot
                            width={plotWidth}
                            height={scatterPlotHeight}
                            data={calc.map((d) => ({ issue_time: d.issue_time, value: d.queue_cnt, idx: d.idx }))}
                            margin={plotMargin}
                            radius={radius}
                            setBrushedIndex={props.setBrushedIndex} />
                    </div>

                )}
            </div>

            <div>
                {stateCheckbox.latency && (
                    <div style={{ display: "flex" }}>
                        <h2 className="header-scatterplot">
                            {"Latency(us)"}
                        </h2>
                        <Scatterplot
                            width={plotWidth}
                            height={scatterPlotHeight}
                            data={calc.map((d) => ({ issue_time: d.issue_time, value: d.latency, idx: d.idx }))}
                            margin={plotMargin}
                            radius={radius}
                            setBrushedIndex={props.setBrushedIndex} />
                    </div>
                )}
            </div>

            <div>
                {stateCheckbox.lba && (
                    <div style={{ display: "flex" }}>
                        <h2 className="header-scatterplot">
                            {"LBA"}
                        </h2>
                        <Scatterplot
                            width={plotWidth}
                            height={scatterPlotHeight}
                            data={calc.map((d) => ({ issue_time: d.issue_time, value: d.lba, idx: d.idx }))}
                            margin={plotMargin}
                            radius={radius}
                            setBrushedIndex={props.setBrushedIndex} />
                    </div>

                )}
            </div>

            {/* heatmap */}
            <div>
                    <div style={{ display: "flex" }}>
                        <h2 className="header-scatterplot">
                            {"LBA"}
                        </h2>
                        <HeatMaps
                            width={plotWidth}
                            height={scatterPlotHeight}
                            data={heatmap_lba}
                            margin={plotMargin}
                            
                            setBrushedIndex={props.setBrushedIndex} />
                    </div>
            </div>
            <div>
                    <div style={{ display: "flex" }}>
                        <h2 className="header-scatterplot">
                            {"Queue Count"}
                        </h2>
                        <HeatMaps
                            width={plotWidth}
                            height={scatterPlotHeight}
                            data={heatmap_queue}
                            margin={plotMargin}
                            
                            setBrushedIndex={props.setBrushedIndex} />
                    </div>
            </div>
            <div>
                    <div style={{ display: "flex" }}>
                        <h2 className="header-scatterplot">
                            {"Latency"}
                        </h2>
                        <HeatMaps
                            width={plotWidth}
                            height={scatterPlotHeight}
                            data={heatmap_latency}
                            margin={plotMargin}
                            
                            setBrushedIndex={props.setBrushedIndex} />
                    </div>
            </div>

            <div>
                <div style={{ display: "flex" }}>
                    <h2 className="header-scatterplot">
                        {"Memory"}
                    </h2>
                    <HeatMaps
                        width={plotWidth}
                        height={scatterPlotHeight}
                        data={top.map((d) => ({ time: d.time, value1: d.mem_free, value2: d.mem_used, value3: d.mem_buff }))}
                        margin={plotMargin}

                        setBrushedIndex={props.setBrushedIndex} />
                </div>
            </div>
        </div>
    )
}
export default PlotView;