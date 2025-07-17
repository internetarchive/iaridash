import React from "react";
import '../css/citationsData.css'

// temporary...
import { JsonEditor } from 'json-edit-react'


export default function CitationsDataDisplay(
    {
        citationData = {},
        citationLabel = null,
        options = {},
        onAction = null
    }) {


    // temporary...
    const jsonHeight = 300

    const caption = citationLabel?.caption
        ? <div id={'citation-data-caption'}>{citationLabel.caption}</div>
        : null

    console.log(`CitationsDataDisplay render`)


    // NB OnAction can be setup and linked to any event of the displayed data
    return <div>
        {caption}
        <div
            style={{
                height: jsonHeight,
                overflowY: 'auto'
            }}
            className="citation-data-json">
            <JsonEditor data={citationData}/>
        </div>
    </div>
}


