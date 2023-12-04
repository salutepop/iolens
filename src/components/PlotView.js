import React, { useRef, useEffect, useState } from "react";
import Scatterplot from './Scatterplot';
import Lineplot from './Lineplot';
import Stackareaplot from "./Stackareaplot";
import HeatMaps from './HeatMaps';

import * as d3 from "d3";
import { brush } from "d3";

const PlotView = (props) => {
    const stateCheckbox = props.stateCheckbox
    const plotMarginWidth = 40;
    const plotMarginHeight = 20;
    const plotWidth = 800;
    const PlotHeight = 150;

    //data
    //data는 이미 props.data 에 담겨있음!!!!!
    const top = props.data.top;
    const lba = props.data.lba;
    const latency = props.data.latency;
    const queue = props.data.queue;
    const f2fs_status = props.data.f2fs_status;

    //CPU data parsing
    const cpuData = props.data.top;
    const LBA = "LBA"
    const CPU = "CPU"
    const Latency = "Latency"
    const Queue = "Queue"
    const parsedData = [];
    let ptime = cpuData[0].time - 1;
    let pcount = cpuData[0].count;
    let tmpData = [];
    let tmpArray = [];
    cpuData.forEach((d) => {

        let time = d.time;  
        if (time !== ptime + 1) {
            // console.log("time", d.time)
            // console.log("ptime", ptime)
            for (let i = 0; i <= 7; i++) {
                
                parsedData.push({
                    time: String(Number(tmpArray[i].time) + 1),
                    value_y: tmpArray[i].value_y,
                    count: tmpArray[i].count
                })
            }
        }
        for (let i = 0; i <= 7; i++) {
            let cpuKey = `c${i}_idle`;
            let count = 100 - d[cpuKey];
            tmpData = {
                time: String(time),
                value_y: `c${i}`,
                count: String(count)
            }
            tmpArray[i] = tmpData;
            // console.log("tmpA", tmpArray[i].time)
            parsedData.push(tmpData)
        }
        ptime = time;
    })
    console.log("parsedData", parsedData)
    //jw
    // let memFreeScale = d3.scaleLinear()
    //     .domain([d3.min(resource, d => d.mem_free), d3.max(resource, d => d.mem_free)])
    //     .range([0, 100]);

    // resource.forEach(d => {
    //     d.mem_free = memFreeScale(d.mem_free);
    // });

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
                <div style={{ display: "flex" }}>
                    <h2 className="header-scatterplot">
                        {"Memory"}
                    </h2>
                    <Stackareaplot
                        gColor={props.gColor}
                        width={plotWidth}
                        height={PlotHeight}
                        allData={props.data}
                        data={top.map((d) => ({ time: d.time, mem_free: d.mem_free, mem_used: d.mem_used, mem_buff: d.mem_buff }))}
                        marginWidth={plotMarginWidth}
                        marginHeight={plotMarginHeight}
                        brushedTime={props.brushedTime}
                    />
                </div>
            </div>

            <div>
                <div style={{ display: "flex" }}>
                    <h2 className="header-scatterplot">
                        {"F2FS Segment"}
                    </h2>
                    <Stackareaplot
                        gColor={props.gColor}
                        width={plotWidth}
                        height={PlotHeight}
                        allData={props.data}
                        data={f2fs_status.map((d) => ({ time: d.time, seg_valid: d.seg_valid, seg_dirty: d.seg_dirty, seg_prefree: d.seg_prefree, seg_free: d.seg_free }))}
                        checkPointData={f2fs_status.map((d) => ({ time: d.time, gc: d.gc_calls }))}
                        marginWidth={plotMarginWidth}
                        marginHeight={plotMarginHeight}
                        brushedTime={props.brushedTime}
                    />
                </div>
            </div>


            {/* heatmap */}
            <div>
                <div style={{ display: "flex" }}>
                    <h2 className="header-scatterplot">
                        {"LBA"}
                    </h2>
                    <HeatMaps
                        gColor={props.gColor}
                        width={plotWidth}
                        height={PlotHeight}
                        data={lba}
                        allData={props.data}
                        marginWidth={plotMarginWidth}
                        marginHeight={plotMarginHeight}
                        brushedTime={props.brushedTime}
                        setBrushedTime={props.setBrushedTime}
                        type={LBA} />
                </div>
            </div>
            <div>
                <div style={{ display: "flex" }}>
                    <h2 className="header-scatterplot">
                        {"Queue Count"}
                    </h2>
                    <HeatMaps
                        gColor={props.gColor}
                        width={plotWidth}
                        height={PlotHeight}
                        data={queue}
                        allData={props.data}
                        marginWidth={plotMarginWidth}
                        marginHeight={plotMarginHeight}
                        brushedTime={props.brushedTime}
                        setBrushedTime={props.setBrushedTime}
                        type={Queue} />
                </div>
            </div>
            <div>
                <div style={{ display: "flex" }}>
                    <h2 className="header-scatterplot">
                        {"Latency"}
                    </h2>
                    <HeatMaps
                        gColor={props.gColor}
                        width={plotWidth}
                        height={PlotHeight}
                        data={latency}
                        allData={props.data}
                        marginWidth={plotMarginWidth}
                        marginHeight={plotMarginHeight}
                        brushedTime={props.brushedTime}
                        setBrushedTime={props.setBrushedTime}
                        type={Latency} />
                </div>
            </div>
            <div>
                <div style={{ display: "flex" }}>
                    <h2 className="header-scatterplot">
                        {"CPU"}
                    </h2>
                    <HeatMaps
                        gColor={props.gColor}
                        width={plotWidth}
                        height={PlotHeight}
                        data={parsedData}
                        allData={props.data}
                        marginWidth={plotMarginWidth}
                        marginHeight={plotMarginHeight}
                        brushedTime={props.brushedTime}
                        setBrushedTime={props.setBrushedTime}
                        type={CPU} />
                </div>
            </div>


            {/* <div>
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
            </div> */}

            {/* <div>
                {stateCheckbox.queue && ( //graphvisivility가 참이면 랜더링, 거짓이면 렌더링 안됨.
                    <div style={{ display: "flex" }}>
                        <h2 className="header-scatterplot">
                            {"Queue Count"}
                        </h2>
                        <Scatterplot
                            width={plotWidth}
                            height={PlotHeight}
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
                            height={PlotHeight}
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
                            height={PlotHeight}
                            data={calc.map((d) => ({ issue_time: d.issue_time, value: d.lba, idx: d.idx }))}
                            margin={plotMargin}
                            radius={radius}
                            setBrushedIndex={props.setBrushedIndex} />
                    </div>

                )}
            </div> */}
        </div>
    )
}
export default PlotView;