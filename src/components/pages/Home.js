// src/components/pages/Home.js
import React, {useState} from 'react';
import {getIabotArchiveData, getWaybackArchiveData} from "./../../utils/archiveUtils"

const Home = () => {

    const testUrl = "http://travel.nationalgeographic.com/travel/world-heritage/easter-island/"

    const testIsEditable = true
    const [localSourceText, setLocalSourceText]= useState(testUrl)
    const [localResultsText, setLocalResultsText]= useState("test results here")


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


    const showWaybackArchiveResults = (urlLink) => {

        // eslint-disable-next-line no-unused-vars
        const result = getWaybackArchiveData(urlLink)
            .then( response => {
                    setLocalResultsText(JSON.stringify(response, null, 2))
                }
            )
    }

    const handleHomeAction = (result) => {

        // error of not object like: {action: <action>, value: <value>}
        const {action, value} = result;
        console.log (`Command:handleHomeAction: action=${action}, value=${value}`);

        if (0) {
            // placebo to make coding easier for adding "else if" conditions
        }


        else if (action === "FETCH_IABOT_ARCHIVE") {
            showIabotArchiveResults(value)
        }

        else if (action === "FETCH_WAYBACK_ARCHIVE") {
            showWaybackArchiveResults(value)
        }

        else {
            console.log(`Home Action "${action}" not supported.`)
            alert(`Home Action "${action}" not supported.`)
        }

    }

    const engageIabotArchive = () => {
        // may want to set "fetching / waiting" status
        handleHomeAction({action: "FETCH_IABOT_ARCHIVE", value: localSourceText})
    }

    const engageWaybackArchive = () => {
        // may want to set "fetching / waiting" status
        handleHomeAction({action: "FETCH_WAYBACK_ARCHIVE", value: localSourceText})
    }

    const buttonIabotArchive = <button
        className={`utility-button`} style={{padding:".375rem 1rem"}}
        onClick={engageIabotArchive}><span>{testIsEditable ? "Query IABot Archive Database" : "???"}</span></button>

    const buttonWaybackArchive = <button
        className={`utility-button`} style={{padding:".375rem 1rem"}}
        onClick={engageWaybackArchive}><span>Query Wayback Archive</span></button>


    return ( <div className={"container-fluid"}>
            <div className={"row"}>
                <h1>Home</h1>
                <p>Welcome to the Home page</p>
            </div>

            <div className={"row"}>

                <div className={"row header-left-part"}>
                    <h3>URL to test: {buttonIabotArchive} {buttonWaybackArchive}</h3>
                </div>

                <textarea className={`source-url-text ${''/* your code here */}`}
                          readOnly={testIsEditable ? false : true}
                          value={localSourceText}
                          onChange={(e) => setLocalSourceText(e.target.value)}/>

                {/*<div className={"row xxheader-right-part"}>*/}
                {/*    {buttonIabotArchive}*/}
                {/*</div>*/}
            </div>

            <div className={"row"}>&nbsp;</div>

            <div className={"row"}>
                    <h3>Test Results here</h3>
                    <textarea className={`result-text multi-line-textarea ${''/* your code here */}`}
                              readOnly={testIsEditable ? false : true}
                              value={localResultsText}
                              />
            </div>
        </div>
    );
};

export default Home;