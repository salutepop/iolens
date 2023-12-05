import React, { useRef, useEffect, useState } from "react";

const ControlView = (props) => {
    return (
        <div className="control-container">
          
            <label className='checkbox-label'>&nbsp;</label>
            <div className="checkbox-container">
                <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={props.graphVisibility.performance}
                    onChange={() => props.handleCheckboxChange('performance')}
                />
                <label className='checkbox-label'>I/O Performance</label>
            </div>
            <div className="checkbox-container">
                <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={props.graphVisibility.performance}
                    onChange={() => props.handleCheckboxChange('cpu')}
                />
                <label className='checkbox-label'>CPU Utilization</label>
            </div>
            <div className="checkbox-container">
                <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={props.graphVisibility.memory}
                    onChange={() => props.handleCheckboxChange('memory')}
                />
                <label className='checkbox-label'>Memory</label>
            </div>
            <div className="checkbox-container">
                <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={props.graphVisibility.f2fs_status}
                    onChange={() => props.handleCheckboxChange('f2fs_status')}
                />
                <label className='checkbox-label'>F2FS Status</label>
            </div>
            <div className="checkbox-container">
                <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={props.graphVisibility.lba}
                    onChange={() => props.handleCheckboxChange('lba')}
                />
                <label className='checkbox-label'>LBA</label>
            </div>
            <div className="checkbox-container">
                <input
                    type="checkbox"
                    className="checkbox-input"
                    checked={props.graphVisibility.queue_count}
                    onChange={() => props.handleCheckboxChange('queue_count')}
                />
                <label className='checkbox-label'>Queue count</label>
            </div>
            
        </div>

    )
};

export default ControlView;