import React from "react";
import '../components.css';

// TODO: add tooltipID? add onAction? or is all this covered in contents?
export default function ControlBox({
                            caption = null,
                            className = null,
                            options = {},
                            children
                       }) {
    return <>
        <div className={`control-box ${className ? `${className}` : ''}`}>
            {caption && (options.showCaption) && <div className={"control-box-caption"}>{caption}</div>}
            <div className={"control-box-contents"}>{children}</div>
        </div>
    </>
}
