import React, { useRef, useEffect, useState } from "react";
import Scatterplot from './Scatterplot';
import Lineplot from './Lineplot';
import Stackareaplot from "./Stackareaplot";
import HeatMaps from './HeatMaps';
import CPUHeatMaps from './CPUHeatMaps';
import Performanceplot from './Performanceplot'
import ControlView from './ControlView'

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

    const [cpuMode, setCpuMode] = useState("Total");
    const toggleView = () => {
        setCpuMode((prevMode) => (prevMode === "Split" ? "Total" : "Split"));
    };

    //CPU data parsing
    const cpuData = props.data.top;
    const LBA = "LBA"
    const CPU = "CPU"
    const F2FS = "F2FS"
    const Latency = "Latency"
    const Queue = "Queue"
    const parsedData = [];
    let ptime = cpuData[0].time - 1;
    let pcount = cpuData[0].count;
    let tmpData = [];
    let tmpArray = [];

    const [graphVisibility, setGraphVisibility] = useState({
        performance: true,
        cpu: true,
        memory: false,
        f2fs_status: true,
        lba: true,
        queue_count: false,
    });

    cpuData.forEach((d) => {

        let time = d.time;
        if (time !== ptime + 1) {
            // console.log("time", d.time)
            // console.log("ptime", ptime)
            for (let i = 0; i <= 7; i++) {

                parsedData.push({
                    time: (Number(tmpArray[i].time) + 1),
                    value_y: tmpArray[i].value_y,
                    count: tmpArray[i].count
                })
            }
        }
        for (let i = 0; i <= 7; i++) {
            let cpuKey = `c${i}_idle`;
            let count = 100 - d[cpuKey];
            tmpData = {
                time: Number(time),
                value_y: `c${i}`,
                count: Number(count)
            }
            tmpArray[i] = tmpData;
            // console.log("tmpA", tmpArray[i].time)
            parsedData.push(tmpData)
        }
        ptime = time;
    })

    //각 코어별로 count를 모두 더해서 가장 사용비율이 많은 코어순으로 나열

    let coreArray = [0, 0, 0, 0, 0, 0, 0, 0];

    for (let i = 0; i < parsedData.length; i++) {

        coreArray[i % 8] = coreArray[i % 8] + parsedData[i].count;

    }

    let indexedArray = coreArray.map((value, index) => ({ value, index }));

    indexedArray.sort((a, b) => b.value - a.value);

    let sortedIndex = indexedArray.map(item => `c${item.index}`);


    //stack char CPU data parsing
    const stackCPUData = props.data.top;
    const parsedData_cpu = []
    stackCPUData.forEach((d) => {
        let sum_usr = 0;
        let sum_sys = 0;
        let sum_disk = 0;
        let sum_idle = 0;
        let time = d.time
        for (let i = 0; i <= 7; i++) {
            let cpuKey_usr = `c${i}_usr`;
            let cpuKey_sys = `c${i}_sys`;
            let cpuKey_idle = `c${i}_idle`;
            sum_usr = sum_usr + d[cpuKey_usr]
            sum_sys = sum_sys + d[cpuKey_sys]
            sum_idle = sum_idle + d[cpuKey_idle]
            // console.log("tmpA", tmpArray[i].time)
        }
        tmpData = {
            time: Number(d.time),
            usr: sum_usr,
            sys: sum_sys,
            idle: sum_idle,
            disk: 800 - sum_usr - sum_sys - sum_idle
        }
        parsedData_cpu.push(tmpData)

    })




    // console.log("parsedData", parsedData_cpu)
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

    const handleCheckboxChange = (graphName) => {
        setGraphVisibility((prevVisibility) => ({
            ...prevVisibility, //현재 상태 복사.
            [graphName]: !prevVisibility[graphName], //토글된것만 flase로 바꿈
        }));
    };

    return (
        <div className="plot-container">
            <ControlView
                graphVisibility={graphVisibility}
                handleCheckboxChange={handleCheckboxChange}
                gColor={props.gColor}
                gColorRGBA={props.gColorRGBA}
            />
            <div>
                {graphVisibility.performance && (
                    <div style={{ display: "flex", position: "relative" }}>
                        <h2 className="header-scatterplot">
                            {"Performance"}
                        </h2>
                        <h2 className="subtitle-scatterplot">
                            {"(Y1: MB/s, Y2: ms)"}
                        </h2>
                        <button className="btn-helper">
                            ?
                            <span className="tooltiptext tooltip-3">
                                Line and area graphs representing I/O performance.
                            </span>
                            <span className="tooltiptext tooltip-2">
                                Shows three f2fs functions with high execution time
                            </span>
                            <span className="tooltiptext tooltip-1">
                                through the hovering event.
                            </span>
                        </button>
                        <Performanceplot
                            gColor={props.gColor}
                            gColorRGBA={props.gColorRGBA}
                            width={plotWidth}
                            height={PlotHeight}
                            allData={props.data}
                            marginWidth={plotMarginWidth}
                            marginHeight={plotMarginHeight}
                            brushedTime={props.brushedTime}
                            setBrushedTime={props.setBrushedTime}
                        />

                    </div>
                )}
            </div>
            <div>
                {graphVisibility.cpu && (
                    <div>
                        <button onClick={toggleView} className='btn-summary-toggle'>
                            {cpuMode === "Split" ? "Total" : "Split"}

                        </button>
                        {cpuMode === "Split" ? (
                            <div>
                                <div style={{ display: "flex", position: "relative" }}>
                                    <h2 className="header-scatterplot">
                                        {"CPU"}
                                    </h2>
                                    <h2 className="subtitle-scatterplot">
                                        {"(Core #, %)"}
                                    </h2>
                                    <button className="btn-helper">
                                        ?
                                        <span className="tooltiptext tooltip-3">
                                            Cumulative stacked area graph representing CPU utilization.
                                        </span>
                                        <span className="tooltiptext tooltip-2">
                                            Provides a toggle button to switch the usage of
                                        </span>
                                        <span className="tooltiptext tooltip-1">
                                            each core and the overall CPU usage graph.
                                        </span>
                                    </button>
                                    <CPUHeatMaps
                                        gColor={props.gColor}
                                        gColorRGBA={props.gColorRGBA}
                                        width={plotWidth}
                                        height={PlotHeight}
                                        data={parsedData}
                                        allData={props.data}
                                        marginWidth={plotMarginWidth}
                                        marginHeight={plotMarginHeight}
                                        brushedTime={props.brushedTime}
                                        setBrushedTime={props.setBrushedTime}
                                        type={CPU}
                                        sortedIndex={sortedIndex} />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div style={{ display: "flex", position: "relative" }}>
                                    <h2 className="header-scatterplot">
                                        {"CPU"}
                                    </h2>
                                    <h2 className="subtitle-scatterplot">
                                        {"(Total Util. %)"}
                                    </h2>
                                    <button className="btn-helper">
                                        ?
                                        <span className="tooltiptext tooltip-3">
                                            Cumulative stacked area graph representing CPU utilization.
                                        </span>
                                        <span className="tooltiptext tooltip-2">
                                            Provides a toggle button to switch the usage of
                                        </span>
                                        <span className="tooltiptext tooltip-1">
                                            each core and the overall CPU usage graph.
                                        </span>
                                    </button>
                                    <Stackareaplot
                                        gColor={props.gColor}
                                        gColorRGBA={props.gColorRGBA}
                                        width={plotWidth}
                                        height={PlotHeight}
                                        allData={props.data}
                                        data={parsedData_cpu.map((d) => ({ time: d.time, sys: d.sys, usr: d.usr, disk: d.disk, idle: d.idle }))}
                                        marginWidth={plotMarginWidth}
                                        marginHeight={plotMarginHeight}
                                        brushedTime={props.brushedTime}
                                        setBrushedTime={props.setBrushedTime}
                                        type="CPU"
                                    />
                                </div>
                            </div>
                        )}

                    </div>
                )}
            </div>


            <div>
                {graphVisibility.memory && (
                    <div style={{ display: "flex", position: "relative" }}>
                        <h2 className="header-scatterplot">
                            {"Memory"}
                        </h2>
                        <h2 className="subtitle-scatterplot">
                            {"(Utilization, MB)"}
                        </h2>
                        <button className="btn-helper">
                            ?
                            <span className="tooltiptext tooltip-3">
                                Cumulative stacked area graph representing changes in
                            </span>
                            <span className="tooltiptext tooltip-2">
                                memory utilization.
                            </span>
                            <span className="tooltiptext tooltip-1">
                                Memory usage can be analyzed separately by purpose.
                            </span>
                        </button>
                        <Stackareaplot
                            gColor={props.gColor}
                            gColorRGBA={props.gColorRGBA}
                            width={plotWidth}
                            height={PlotHeight}
                            allData={props.data}
                            data={top.map((d) => ({ time: d.time, Used: d.mem_used, Buff: d.mem_buff, Free: d.mem_free }))}
                            marginWidth={plotMarginWidth}
                            marginHeight={plotMarginHeight}
                            brushedTime={props.brushedTime}
                            setBrushedTime={props.setBrushedTime}
                            type="Memory"
                        />
                    </div>
                )}
            </div>
            <div>
                {graphVisibility.f2fs_status && (

                    <div style={{ display: "flex", position: "relative" }}>
                        <h2 className="header-scatterplot">
                            {"F2FS Segment"}
                        </h2>
                        <h2 className="subtitle-scatterplot">
                            {"(# of Segments)"}
                        </h2>
                        <button className="btn-helper">
                            ?
                            <span className="tooltiptext tooltip-3">
                                Cumulative stacked area graph showing segment status
                            </span>
                            <span className="tooltiptext tooltip-2">
                                of the F2FS Filesystem. And dashed lines indicate
                            </span>
                            <span className="tooltiptext tooltip-1">
                                when garbage collection and check point events occurred
                            </span>
                        </button>
                        <Stackareaplot
                            gColor={props.gColor}
                            gColorRGBA={props.gColorRGBA}
                            width={plotWidth}
                            height={PlotHeight}
                            allData={props.data}
                            data={f2fs_status.map((d) => ({ time: d.time, Valid: d.seg_valid, Dirty: d.seg_dirty, Prefree: d.seg_prefree, Free: d.seg_free }))}
                            checkPointData={f2fs_status.map((d) => ({ time: d.time, event: d.cp_calls }))}
                            gcData={f2fs_status.map((d) => ({ time: d.time, event: d.gc_calls}))}
                            marginWidth={plotMarginWidth}
                            marginHeight={plotMarginHeight}
                            brushedTime={props.brushedTime}
                            setBrushedTime={props.setBrushedTime}
                            type={F2FS}
                        />
                    </div>
                )}
            </div>


            {/* heatmap */}
            <div>
                {graphVisibility.lba && (
                    <div style={{ display: "flex", position: "relative" }}>
                        <h2 className="header-scatterplot">
                            {"LBA"}
                        </h2>
                        <h2 className="subtitle-scatterplot">
                            {"(Address)"}
                        </h2>
                        <button className="btn-helper">
                            ?
                            <span className="tooltiptext tooltip-3">
                                Heatmap graph representing the access pattern of LBA Address.
                            </span>
                            <span className="tooltiptext tooltip-2">
                                The Histogram on the right side of the graph indicates
                            </span>
                            <span className="tooltiptext tooltip-1">
                                the access frequency by address of all data.
                            </span>
                        </button>
                        <HeatMaps
                            gColor={props.gColor}
                            gColorRGBA={props.gColorRGBA}
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
                )}
            </div>
            <div>
                {graphVisibility.queue_count && (
                    <div style={{ display: "flex", position: "relative" }}>
                        <h2 className="header-scatterplot">
                            {"Queue Counts"}
                        </h2>
                        <h2 className="subtitle-scatterplot">
                            {"(# of Requests)"}
                        </h2>
                        <button className="btn-helper">
                            ?
                            <span className="tooltiptext tooltip-1">
                                Heatmap graph showing the number of I/O requests waiting in the queue.
                            </span>
                        </button>
                        <HeatMaps
                            gColor={props.gColor}
                            gColorRGBA={props.gColorRGBA}
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
                )}
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