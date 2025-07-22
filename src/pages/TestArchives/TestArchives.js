import React, {useState} from 'react';
import {getIabotArchiveData, getWaybackArchiveData} from "../../utils/archiveUtils"
import RouteHeader from "../../components/RouteHeader";
import './testArchives.css'
import Loader from "../../components/Loader";

const TestArchives = () => {

    const testUrl = "http://travel.nationalgeographic.com/travel/world-heritage/easter-island/"

    const textIsEditable = true
    const [localSourceText, setLocalSourceText]= useState(testUrl)
    const [localResultsText, setLocalResultsText]= useState("test results here")

    const [isLoading, setIsLoading] = React.useState(false)
    const [isLoadingTimer, setIsLoadingTimer] = React.useState(false)

    const showIabotArchiveResults = (urlLink) => {

        // alert(`showIabotArchiveResults: Will Fetch archive for ${urlLink}.`)

        // eslint-disable-next-line no-unused-vars
        const result = getIabotArchiveData(urlLink)
            .then( response => {
                    // console.log("getArchiveData return; results: ", response)
                    setLocalResultsText(JSON.stringify(response, null, 2))
                }
            )

        // alert(`Back from fetch archive call`)

    }

    const fetchWaybackArchiveResults = async (urlLink) => {

        setIsLoading(true)
        // setError(null)
        setIsLoadingTimer(true)  // prevents "too soon" flashing of loading icon
        setTimeout(() => {
            setIsLoadingTimer(false)
        }, 853); // milliseconds

        try {
            const response = await getWaybackArchiveData(urlLink)
            setLocalResultsText(JSON.stringify(response, null, 2))
        } catch (error) {
            console.error('Error fetching Wayback data:', error)
            setLocalResultsText("Error fetching Wayback data.")
        } finally {
            setIsLoading(false);
        }

    }

    const handlePageAction = (result) => {

        // TODO error if object not like: {action: <action>, value: <value>}
        const {action, value} = result;
        console.log (`Command:handleHomeAction: action=${action}, value=${value}`);

        if (0) {
            // placebo to make coding easier for adding "else if" conditions
        }


        else if (action === "FETCH_IABOT_ARCHIVE") {
            showIabotArchiveResults(value)
        }

        else if (action === "FETCH_WAYBACK_ARCHIVE") {
            fetchWaybackArchiveResults(value)
        }

        else {
            console.log(`Home Action "${action}" not supported.`)
            alert(`Home Action "${action}" not supported.`)
        }

    }

    // const engageIabotArchive = () => {
    //     // may want to set "fetching / waiting" status
    //     handlePageAction({action: "FETCH_IABOT_ARCHIVE", value: localSourceText})
    // }

    const engageWaybackArchive = () => {
        // may want to set "fetching / waiting" status
        handlePageAction({action: "FETCH_WAYBACK_ARCHIVE", value: localSourceText})
    }

    // const buttonIabotArchive = <button
    //     className={`utility-button`} style={{padding:".375rem 1rem"}}
    //     onClick={engageIabotArchive}><span>{textIsEditable ? "Query IABot Archive Database" : "???"}</span></button>

    const buttonWaybackArchive = <button
        className={`utility-button`} style={{padding:".375rem 1rem"}}
        onClick={engageWaybackArchive}><span>Query Wayback Archive</span></button>


    return ( <div className="iari-ux-container">
        <div className={"iari-ux-header"}>
            <RouteHeader caption = {"Archive Test"}
                         subCaption = "Check archive status of URL link at archive.org" />
        </div>

        <div className={"iari-ux-body"}>

            <div className={"iari-ux-container"}>

                <div className={"iari-ux-header iari-input-box"} >
                    <div className={"row header-left-part"} style={{marginBottom: '.5rem'}}>
                        <h3>URL to test:</h3>
                    </div>

                    <textarea className={`source-url-text ${''/* your code here */}`}
                              readOnly={textIsEditable ? false : true}
                              value={localSourceText}
                              onChange={(e) => setLocalSourceText(e.target.value)}/>

                    {/*<div className={"row xxheader-right-part"}>*/}
                    {/*    {buttonIabotArchive}*/}
                    {/*</div>*/}

                    <div className={"row gx-0"}>
                        <div style={{marginTop: '.5rem'}}>
                            {buttonWaybackArchive}
                        </div>
                    </div>
                </div>

                <div className={"iari-ux-body"}>

                    <div className={"iari-ux-container"}>

                        <div className={"iari-ux-header"}>
                            <h3>Results:</h3>
                        </div>

                        <div className={"iari-ux-body"}>
                        {isLoading || isLoadingTimer
                            ? <Loader message={"Fetching Archive Data..."} options={{width: '100px'}}/>
                            : <textarea className={`multi-line-textarea test-results-textarea`}
                                          readOnly={textIsEditable ? false : true}
                                          value={localResultsText}
                            />
                        }
                        </div>

                    </div>

                </div>

            </div>
        </div>
    </div> )
}

export default TestArchives