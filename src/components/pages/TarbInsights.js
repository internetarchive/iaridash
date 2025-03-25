import React from 'react';
// import RouteHeader from "../RouteHeader";

const TarbInsights = () => {

    const tarbUrl = "http://tarb.crawl1.archive.org/"



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