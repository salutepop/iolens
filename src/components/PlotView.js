import Queueplot from './Queueplot';
import Throughputplot from './Throughputplot';
import LBAplot from './LBAplot';
import Latencyplot from './Latencyplot';

const PlotView = (props) => {
    const data = props.data;
    const stateCheckbox = props.stateCheckbox
    const svgMargin = 20;
    const svgSize = 200;
    const radius = 0.5;

    /* 지원 */
    //scatter plot으로 통일
    //line plot 추가 (throughput, resorce) = > y축 짧게

    /* 청만 */
    //latency 히스토그램. summary 아래 구현 

    /* 효림 */
    //brush는 scatter에서만 동작. scatter plot에서 구현

    //line plot에서는 index data받아서 해당 영역 색칠

    //scatterplot, linecplot에사  줌 구현 => 줌 자료 조사
    //y값 분포 line으로 그리기(논문)
    return (
        <div className="plot-container">
            <div class="splotContainer">
                {stateCheckbox.queue && ( //graphvisivility가 참이면 랜더링, 거짓이면 렌더링 안됨.
                    <Queueplot size={svgSize} data={data.queue} margin={svgMargin} radius={radius} />
                    //
                )}
            </div>

            <div class="splotContainer">
                {stateCheckbox.throughput && (
                    <Throughputplot size={svgSize} data={data.throughput} margin={svgMargin} radius={radius} />
                )}
            </div>

            <div class="splotContainer">
                {stateCheckbox.latency && (
                    <Latencyplot size={svgSize} data={data.latency} margin={svgMargin} radius={radius} />
                )}
            </div>

            <div class="splotContainer">
                {stateCheckbox.lba && (
                    <LBAplot size={svgSize} data={data.lba} margin={svgMargin} radius={radius} />
                )}
            </div>
        </div>
    )
}
export default PlotView;