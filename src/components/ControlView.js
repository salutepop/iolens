import React, { useRef, useEffect, useState } from "react";

const ControlView = (props) => {
    return (
        <div className="control-container">
          
            <label className='checkbox-label'>&nbsp;</label>
            <div className="checkbox-container">
                <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={props.stateCheckbox.cpu_user}
                    onChange={() => props.handleCheckboxChange('cpu_user')}
                />
                <label className='checkbox-label'>CPU User</label>
            </div>
            <div className="checkbox-container">
                <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={props.stateCheckbox.cpu_system}
                    onChange={() => props.handleCheckboxChange('cpu_system')}
                />
                <label className='checkbox-label'>CPU System</label>
            </div>
            <div className="checkbox-container">
                <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={props.stateCheckbox.mem_free}
                    onChange={() => props.handleCheckboxChange('mem_free')}
                />
                <label className='checkbox-label'>Free Memory</label>
            </div>
            <div className="checkbox-container">
                <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={props.stateCheckbox.throughput}
                    onChange={() => props.handleCheckboxChange('throughput')}
                />
                <label className='checkbox-label'>Throughput </label>
            </div>
            <div className="checkbox-container">
                <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={props.stateCheckbox.queue}
                    onChange={() => props.handleCheckboxChange('queue')}
                />
                <label className='checkbox-label'>Queue depth</label>
            </div>
            <div className="checkbox-container">
                <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={props.stateCheckbox.latency}
                    onChange={() => props.handleCheckboxChange('latency')}
                />
                <label className='checkbox-label'>Latency </label>
            </div>
            <div className="checkbox-container">
                <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={props.stateCheckbox.lba}
                    onChange={() => props.handleCheckboxChange('lba')}
                />
                <label className='checkbox-label'>LBA </label>
            </div>
        </div>

    )
};

export default ControlView;