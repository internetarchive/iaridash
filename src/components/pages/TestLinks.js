// src/components/pages/TestLinks.js
import React from 'react';

const TestLinks = () => {

    // const handleAction = (result) => {
    //     // error if not object like: {action: <action>, value: <value>}
    //     const {action, value} = result;
    //     console.log(`TestLinks:handleAction: action=${action}, value=${value}`);
    //
    //     if (0) {
    //         // placebo to make coding easier for adding "else if" conditions
    //     } else {
    //         console.log(`Action "${action}" not supported.`)
    //         alert(`Action "${action}" not supported.`)
    //     }
    //
    // }

    const endpoints = [

        "version",

        "check-url?url=https://example.com/",

        "check-url"
        + "?refresh=true"
        + "&method=wayback"
        + "&url=google.com/",

        "check-url"
            + "?url=https://www.easterisland.travel/easter-island-facts-and-info/tapati-rapa-nui-festival/",

        "check-url"
        + "?refresh=true"
        + "&method=wayback"
        + "&url=https://www.easterisland.travel/easter-island-facts-and-info/tapati-rapa-nui-festival/",
    ]

    const iari_sources = [
        {name: "Local", source: "http://localhost:5000/v2/"},
        {name: "Staging", source: "https://iabot-api.archive.org/services/context/iari-stage/v2/"},
    ]

    const linksForSource = (source) => {
        return <>
            <h2>{source.name} <span className={"smaller"}>{source.source}</span></h2>
            {
                endpoints.map(endpoint => {
                    return <div className={"another-link"}>
                        <a target={"_blank"} rel="noreferrer"
                           href={source.source + endpoint}>{endpoint}</a>
                    </div>
                })
            }
            </>
        }

    return <>
        <div className={"container-fluid"}>
            
            <div className={"row"}>
                <h1>Test Links</h1>
            </div>

            <div className="row">
                <div className={"col-12"}>

                    {
                        iari_sources.map(iSrc => {
                            return linksForSource(iSrc)
                        })
                    }

                </div>
            </div>

        </div>
    </>
};

export default TestLinks;
