import React from "react";
import Loader from "../Loader";
import {ConfigContext} from "../../contexts/ConfigContext";
import PathFetch from "../PathFetch";

// temporary...
import { JsonEditor } from 'json-edit-react'


export default function CitationsDatabaseDisplay(
    {
        pathInitial = "https://en.wikipedia.org/wiki/Siemens_scandal",
        options = {},
        onAction = null
    }) {

    const hasMounted = React.useRef(false);
    const [citationData, setCitationData] = React.useState(null);
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    // temporary...
    const jsonHeight = 300


    let myConfig = React.useContext(ConfigContext)
    myConfig = myConfig ? myConfig : {} // prevents "myConfig.[param_name]" "undefined" errors
    const iariBase = myConfig && myConfig.iariBase

    const [isLoading, setIsLoading] = React.useState(false)

    // const [pathName, setPathName] = React.useState('')  // init with passed in name
    // const [checkedRawRefs, setCheckedRawRefs] = React.useState(false);
    const [citationParams, setCitationParams] = React.useState({
        pathName: pathInitial,
        checkedRawRefs: false
    })

    const handlePathResults = (pathResults) => {
        setCitationParams({
            pathName: pathResults.path,
            checkedRawRefs: pathResults.options?.checkedRawRefs,
        })
    }

    // used to display in console
    React.useEffect(() => {
        if (hasMounted.current) {
            // use of "hasMounted" prevents fetching of data during
            // component first time with null citationParams.pathName

            console.log(`citationParams: pathName: ${citationParams.pathName} and checkRawRefs: ${citationParams.checkedRawRefs}`)
            alert(`Received new citationParams: pathName: ${citationParams.pathName} and checkRawRefs: ${citationParams.checkedRawRefs}`)

            // const baseUrl = `https://wikipediacitations.scatter.red/`
            const baseUrl = `${iariBase}/`
            //     `${iariBase}/statistics/analyze?url=${path}${
            //         refresh
            //             ? "&refresh=true"
            //             : ''}${
            //         mediaType
            //             ? `&media_type=${mediaType}`
            //             : ''}`;

            // const citationApiUrl = `https://wikipediacitations.scatter.red/?url=${encodedUrl}&output=json`

            const params = new URLSearchParams({
                url: encodeURIComponent(citationParams.pathName),
                output: 'json',
                // ...extraParams
            });
            // return `${base}?${params.toString()}`;
            const apiUrl = `${baseUrl}?${params.toString()}`

            const fetchData = async () => {
                setLoading(true)
                setError(null)

                try {
                    const response = await fetch(apiUrl)
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`)
                    }

                    const data = await response.json()
                    setCitationData(data)

                } catch (err) {
                    setError(err.message || 'Something went wrong');
                    setCitationData(null);

                } finally {
                    setLoading(false);
                }

            }

            fetchData();

        } else {
            hasMounted.current = true
        }
    }, [citationParams]);

    const errors = !error ? null : (
        <div className={"errors"}>Error: {error}</div>
    )

    console.log(`CitationsDatabaseDisplay render`)

    return <>

        <div className="row citations-display">
            <div className="col col-12">
                <PathFetch
                    initialPath={citationParams.pathName}
                    initialCheckedRawRefs={citationParams.checkedRawRefs}
                    initialCheckedRawRefsLabel = "Show Raw References"

                    handleSubmit={handlePathResults}
                    submitButtonText = "Submit"

                    placeholder={"Enter a Wikipedia article here"}
                />
            </div>
        </div>

        {isLoading
            ? <Loader message={"Fetching Citations Data..."}/>
            : <div>
                {errors}

                <div>Citation Data will go here...will render citationData</div>
                <div id={'citation-data-caption'}>Citation Data Caption</div>

                <div
                    style={{
                        height: jsonHeight,
                        overflowY: 'auto'
                    }}
                    className="citation-data-json">
                    <JsonEditor data={citationData}/>
                </div>
            </div>
        }

    </>
}


