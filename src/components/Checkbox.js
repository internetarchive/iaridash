import React from "react";

export default function Checkbox ( { label, id='', value, onChange, className='' }) {
    return <label><input
        className={className}
        id={id}
        type="checkbox"
        checked={value}
        onChange={onChange}
    />{label}</label>;
}
