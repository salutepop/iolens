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

    return (
        <div className="plot-container">
            <div class="splotContainer">
                {stateCheckbox.queue && ( //graphvisivility가 참이면 랜더링, 거짓이면 렌더링 안됨.
                    <Queueplot size={svgSize} data={data.queue} margin={svgMargin} radius={radius} />
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