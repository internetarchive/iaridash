// import React, {useEffect} from 'react';
import React from 'react';
import RouteHeader from "../RouteHeader";
import WebRxStats from "../main/WebRxStats";

const WebRx = () => {

    // useEffect( () => { // [myIariBase, pageData, processReferences, processUrls, myStatusCheckMethod]
    //
    //     const fetchWebRxData = async () => {
    //
    //         const iariBase: myIariBase,
    //             urlArray: pageData.urls,
    //             refresh: pageData.forceRefresh,
    //             timeout: 60,
    //             method: myStatusCheckMethod
    //         })
    //     }
    //
    //
    //     const fetchData = async () => {
    //
    //         try {
    //
    //             // setUrlStatusLoadingMessage(`Retrieving URL status codes with ${UrlStatusCheckMethods[myStatusCheckMethod].caption} method`)
    //             // setIsDataReady(false);
    //             // setIsLoadingUrls(true);
    //
    //             console.log(`BEFORE fetch data`)
    //             // fetch info for all urls and wait for results before continuing
    //             const myData = await fetchWebRxData()
    //             console.log(`AFTER fetch data`)
    //
    //
    //             // NB TODO: fetch article data from IARI for V2 or article parsing to get array of citerefs
    //             // const newRefs = await fetchNewRefs()  // grabs article_V2 data from IARI
    //
    //             // process received data - TODO this should eventually be done in IARI
    //             processUrls(pageData, myUrls);  // creates pageData.urlDict and pageData.urlArray; loads pageData.errors
    //             processReferences(pageData)  //
    //             associateRefsWithLinks(pageData)  // associates url links with references
    //
    //             processReliabilityData(pageData)
    //             processBooksData(pageData)
    //
    //             processProbes(pageData)
    //
    //             processActionables(pageData)
    //
    //             // if any errors, display
    //             if (pageData.process_errors?.length > 0) setPageErrors(pageData.process_errors)
    //
    //             // announce to UI all is ready
    //             setIsDataReady(true);
    //             setIsLoadingUrls(false);
    //
    //         } catch (error) {
    //             console.error('Error fetching data:', error.message);
    //             console.error(error.stack);
    //             pageData.urlResults = []
    //
    //             setPageErrors(error.message)
    //             setIsLoadingUrls(false);
    //         }
    //
    //     }
    //
    //     fetchPageData()
    //
    // },   [
    //     myIariBase,
    //     pageData,
    //     processReferences,
    //     processUrls,
    //     associateRefsWithLinks,
    //     myStatusCheckMethod,
    //     processReliabilityData,
    //     processBooksData,
    //     processActionables,
    // ])




    return <>
            <RouteHeader caption = {"WebRx"}
                         subCaption = "Show WebRx aggregate data results." />
            <WebRxStats options={{dateRange:"2001-2025", anotherDate:"latest"}} />
        </>

}

export default WebRx;