import React from "react";
import '../css/citationsData.css'

// temporary...
import { JsonEditor } from 'json-edit-react'


export default function CitationsDataDisplay(
    {
        citationData = {},
        citationLabel = null,
        options = {},
        onAction = null,
        errors = null,
    }) {


    const caption = citationLabel?.caption
        ? <div className={'citation-data-display-caption'}>{citationLabel.caption}</div>
        : null

    const statistics = citationData
        ? <div>Execution time: {citationData["execution_time"]}</div>
        : <p>Nothing to show</p>

    console.log(`CitationsDataDisplay render`)


    // NB OnAction can be setup and linked to any event of the displayed data
    return <div className="citation-data-display-container">
        <div className="citation-data-display-header">
            {caption}
        </div>

        <div className="citation-data-display-statistics">
            {statistics}
        </div>

        <div className="citation-data-display-body">
            <div className="citation-data-json">
                <JsonEditor data={citationData}/>
            </div>
        </div>
    </div>
}


