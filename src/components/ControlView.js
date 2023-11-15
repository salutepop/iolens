


const ControlView = (props) => {

    return (
        <div className="control-container">
        <h1 style={{ marginRight: 5 }}>
            {"Control box"}
        </h1>
        <label>&nbsp;</label>
        <div className="checkbox-container">
            <input
                type="checkbox"
                checked={props.stateCheckbox.queue}
                onChange={() => props.handleCheckboxChange('queue')}
            />
            <label>Queue depth</label>
        </div>
        <div className="checkbox-container">
            <input
                type="checkbox"
                checked={props.stateCheckbox.throughput}
                onChange={() => props.handleCheckboxChange('throughput')}
            />
            <label>Throughput </label>
        </div>
        <div className="checkbox-container">
            <input
                type="checkbox"
                checked={props.stateCheckbox.latency}
                onChange={() => props.handleCheckboxChange('latency')}
            />
            <label>Latency </label>
        </div>
        <div className="checkbox-container">
            <input
                type="checkbox"
                checked={props.stateCheckbox.lba}
                onChange={() => props.handleCheckboxChange('lba')}
            />
            <label>LBA </label>
        </div>
    </div>
    )
};

export default ControlView;