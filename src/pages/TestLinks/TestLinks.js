// src/components/pages/TestLinks.js
import React from 'react'
import RouteHeader from "../../components/RouteHeader"
import {IariSources} from "../../constants/iariSources"
import './testLinks.css'

import { exampleEndpoints } from "../../constants/endpointsDefs.js"

const TestLinks = () => {
    // test links for IARI right now...could be expanded for general links later
    // links are made fron each iari source and all defined endpoints.

    const iari_sources = ['iari_local', 'iari_stage']  // keys into IariSources
    const filteredExampleEndpoints = exampleEndpoints // for when we get to where we want to filter default...

    const linksForSource = (source) => {
        return <>
            <h2>{source.caption} <span className={"smaller"}>{source.api_base}</span></h2>
            <h3 className={"iari-list-label"}>{"endpoint links:"}</h3>
            {
                filteredExampleEndpoints.map(endpoint => {
                    return <div className={"another-link"} key={endpoint}>
                        <a target={"_blank"} rel="noreferrer"
                           href={source.api_base + endpoint}>{endpoint}</a>
                    </div>
                })
            }
            </>
        }

    return <>
        <RouteHeader caption = {"IARI Test Links"} subCaption = {"Click on Endpoint Link to open up results in another tab."}/>

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

export default TestLinks
