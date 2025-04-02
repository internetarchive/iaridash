import React from 'react';
import {ConfigContext} from "../../contexts/ConfigContext";
import {IareEnvironments} from "../../constants/environments";
// import RouteHeader from "../RouteHeader";

const TarbInsights = () => {

    const myConfig = React.useContext(ConfigContext);
    const myEnvironmentKey = myConfig?.environmentKey;

    if ([IareEnvironments.STAGE.key, IareEnvironments.PROD.key].includes(myEnvironmentKey) ) {
        return <p>TARB Results not yet available on public server</p>
    }

    const tarbUrl = "http://tarb.crawl1.archive.org/"
    // const tarbUrl = "http://tarb.crawl1.archive.org/?start=2016-07-13&end=2025-03-24"

    return <>
        {/*<RouteHeader caption = {"TARB Insights"}*/}
        {/*             subCaption = "Up to the minute TARB results" />*/}

        {/*<div style={{height:"100%"}}>*/}
            <iframe
                src={tarbUrl}
                title="TARB Insights"
                // sandbox="allow-scripts allow-same-origin"
                width="100%"
                height="100%"
                allow="fullscreen"
            />
        {/*</div>*/}
    </>
}

export default TarbInsights