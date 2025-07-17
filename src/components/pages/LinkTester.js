// src/components/pages/LinkTester.js
import React from 'react'
import RouteHeader from "../RouteHeader"
import {IariSources} from "../../constants/iariSources"

const LinkTester = () => {
    // test links for IARI right now...could be expanded for general links later

    const endpoints = [

        "version",

        "refs_lookup?url=https://en.wikipedia.org/wiki/Siemens_scandal",

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

    // const iari_sources = [
    //     {name: "Local", source: "http://localhost:5000/v2/"},
    //     {name: "Staging", source: "https://iabot-api.archive.org/services/context/iari-stage/v2/"},
    // ]
    const iari_sources = ['iari_local', 'iari_stage']  // keys into IariSources

    const linksForSource = (source) => {
        return <>
            <h2>{source.caption} <span className={"smaller"}>{source.api_base}</span></h2>
            {
                endpoints.map(endpoint => {
                    return <div className={"another-link"} key={endpoint}>
                        <a target={"_blank"} rel="noreferrer"
                           href={source.api_base + endpoint}>{endpoint}</a>
                    </div>
                })
            }
            </>
        }

    return <>
        <RouteHeader caption = {"Test Links"} />

        <div className={"container-fluid"}>
            <div className="row">
                <div className={"col-12"}>
                    {
                        iari_sources.map(source_key => {
                            return <div key={source_key}>{linksForSource(IariSources[source_key])}</div>
                        })
                    }
                </div>
            </div>
        </div>
    </>
}

export default LinkTester
