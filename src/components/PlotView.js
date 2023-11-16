import React, { useRef, useEffect, useState } from "react";
import Scatterplot from './Scatterplot';
import Lineplot from './Lineplot';

const PlotView = (props) => {
    const calc = props.calc;
    const throughput = props.throughput;
    const stateCheckbox = props.stateCheckbox
    const svgMargin = 20;
    const svgSize = 200;
    const radius = 0.5;

    //hyo
    // const [Index, setIndex] = useState([]);
    useEffect(() => {

        

	}, []);

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
                {stateCheckbox.queue && ( //graphvisivility가 참이면 랜더링, 거짓이면 렌더링 안됨.
                    <Scatterplot size={svgSize} data={calc.map((d) => ({issue_time: d.issue_time, value: d.queue_cnt, idx: d.idx}))} margin={svgMargin} radius={radius}
                    setBrushedIndex={props.setBrush} />
                )}
            </div>

            <div>
                {stateCheckbox.throughput && (
                    <Lineplot size={svgSize} data={throughput.map((d) => ({timeStamp: d.timeStamp, value: d.throughput}))} margin={svgMargin} radius={radius} />
                )}
            </div>

            <div>
                {stateCheckbox.latency && (
                    <Scatterplot size={svgSize} data={calc.map((d) => ({issue_time: d.issue_time, value: d.latency, idx: d.idx}))} margin={svgMargin} radius={radius}
                    setBrushedIndex={props.setBrush} />
                )}
            </div>

            <div>
                {stateCheckbox.lba && (
                    <Scatterplot size={svgSize} data={calc.map((d) => ({ issue_time: d.issue_time, value: d.lba, idx: d.idx}))} margin={svgMargin} radius={radius}
                    setBrush={props.setBrush} />
                )}
            </div>
        </div>
    )
}
export default PlotView;