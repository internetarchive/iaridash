import React from "react";
import './citationsData.css'

// temporary...
import { JsonEditor } from 'json-edit-react'


export default function CitationDataDisplay(
    {
        citationData = {},
        citationLabel = null,
        options = {},
        onAction = null,
        errors = null,
    }) {

    const [showDetails, setShowDetails] = React.useState(false)

    const showDetailsButton = <button
        className={"utility-button detail-button"}
        // style={{margin: "0 0 0.2rem 10px"}}
        onClick={() => {setShowDetails(prev => !prev)}}
    >
        <span>{'...'}</span>
    </button>

    const caption = citationLabel?.caption
        ? <>
            <h3 className={'citation-data-display-caption'}>{citationLabel.caption}{showDetailsButton}</h3>
            {showDetails
                ? <div className={'citation-data-display-caption-details'}>{citationLabel["details"]}</div>
                : null}
        </>
        : null

    const statistics = citationData
        ? <>
            <div>Execution time: {citationData["execution_time"]}</div>
            <div>{citationData["use_raw"] ? 'Showing raw reference data' : 'Showing normalized reference data'}</div>
        </>
        : <p>Nothing to show</p>

    console.log(`CitationsDataDisplay render`)


    // NB OnAction can be setup and linked to any event of the displayed data

    return <div className="citation-data-display-container">

        <div className="citation-data-display-header">
            {caption}
            <div className="citation-data-display-statistics">
                {statistics}
            </div>
        </div>

        <div className="citation-data-display-body">
            <div className="citation-data-json">
                <JsonEditor data={citationData}/>
            </div>
        </div>
    </div>
}


