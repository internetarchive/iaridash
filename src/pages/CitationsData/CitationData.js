import React from 'react';
import PathFetch from "../../components/PathFetch";
import MakeLink from "../../components/MakeLink";
import Loader from "../../components/Loader";
import RouteHeader from "../../components/RouteHeader";
import {ConfigContext} from "../../contexts/ConfigContext";
import CitationDataDisplay from "./CitationDataDisplay";

const CitationData = (
//     {
//       // todo: get apiParams from myConfig.queryParams
//       //  looking for: url, useRawRefs
//       apiParams = {
//         pathName: "https://en.wikipedia.org/wiki/Easter_Island",
//         useRawRefs: false
//     },
//     onAction
// }
) => {
                // // const pathInitial = "https://en.wikipedia.org/wiki/Siemens_scandal"
    const pathInitial = "https://en.wikipedia.org/wiki/Easter_Island"

    const componentHasMounted = React.useRef(false);

    // isLoading indicates the fetch process is in process.
    // loadingTimer is set to a minimum time that loading icon should be displayed.
    // this prevents the loading icon flashing "too quick" - the loading
    // icon is guaranteed to be shown for a specified minimum of time.
    const [isLoading, setIsLoading] = React.useState(false)
    const [loadingTimer, setLoadingTimer] = React.useState(false)

    const [citationData, setCitationData] = React.useState(null);
    const [displayApiUrl, setDisplayApiUrl] = React.useState('');
    const [error, setError] = React.useState(null);


    let myConfig = React.useContext(ConfigContext)
    myConfig = myConfig ? myConfig : {} // prevents "myConfig.[param_name]" "undefined" errors
    const iariBase = myConfig && myConfig.iariBase

    const [apiParams, setApiParams] = React.useState({
        pathName: pathInitial,
        useRawRefs: false
    })



    const handleAction = (result) => {
        const {action, value} = result;
        console.log (`CitationsData: handleAction: action=${action}, value=${value}`);

        if (0) { // allows for easy addition of "else if"s
        }

        else if (action === "fetch_citation_data") {
            console.log("CitationData: Action: fetch citation data")

        }

        else {
            console.log(`Action "${action}" not supported.`)
            alert(`Action "${action}" not supported.`)
        }

    }

    const handlePathResults = (pathResults) => {
        // TODO:
        //  send results back up to parent component
        //  these results would t hen be transformed into a parmaterized URL that
        //  would be wondow.locted so a URL coul be made to exactly describe what
        //  is being donw in this program. Similar to IARE

        // for now, just set local params...

        setApiParams({
            pathName: pathResults.path,
            useRawRefs: pathResults.options?.useRawRefs,
        })
    }


    // when apiParams changed, run this
    React.useEffect(() => {

        // use of "componentHasMounted" prevents fetching of data
        // when apiParams.pathName is null upon component creation
        if (!componentHasMounted.current) {
            componentHasMounted.current = true
            return
        }

        const buildApiUrl = (apiParams) => {
            console.log(`getApiUrl: pathName: ${apiParams.pathName}; useRawRefs: ${apiParams.useRawRefs}`)

            const baseUrl = `${iariBase}refs_lookup`

            const urlParams = new URLSearchParams({
                url: encodeURI(apiParams.pathName),
                output: 'json',
                raw: apiParams.useRawRefs ? 'true' : 'false',
            });

            return `${baseUrl}?${urlParams.toString()}`

        }

        const apiUrl = buildApiUrl(apiParams);
        console.log(`Citations Database apiUrl: ${apiUrl}`)
        setDisplayApiUrl(apiUrl)

        const fetchData = async () => {
            setError(null)

            setIsLoading(true)
            setLoadingTimer(true)  // ensures "Loading" icon is visible for a comfortable period of time
            setTimeout(() => {
                setLoadingTimer(false)
            }, 853); // milliseconds

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
                setIsLoading(false);
            }

        }

        fetchData();

        // XXXeslint-disable-next-line react-hooks/exhaustive-deps
    }, [apiParams, iariBase]);


    const errors = !error ? null : (
        <div className={"errors"}>Error: {error}</div>
    )

// TODO: get path_to_fetch from parameters for this component OR from context

    return <div className="citation-data-container">

        <div className="citation-data-header">

            <RouteHeader caption={"Citations Database"}
                         subCaption={null}/>

            <div className="row gx-0">
                <div className="col col-12 citation-path-fetch-container">
                    <PathFetch
                        initialPath={apiParams.pathName}
                        initialUseRawRefs={apiParams.useRawRefs}
                        initialUseRawRefsLabel = "Show Raw References"

                        handleSubmit={handlePathResults}
                        submitButtonText = "Submit"

                        placeholder={"Enter a Wikipedia article here"}
                    />
                </div>
            </div>
        </div>

        <div className="row citation-data-body">
        {isLoading || loadingTimer
            ? <Loader message={"Fetching Citations Data..."}/>
            : <CitationDataDisplay
                    citationData={citationData}
                    citationLabel={{
                        caption: `Citation Data for: ${apiParams.pathName}`,
                        details: <div>Api Url: <MakeLink href={displayApiUrl}/></div>
                    }}
                    options={{}}
                    onAction={handleAction}
                    errors={{errors}}
                />
        }
        </div>

    </div>
}

export default CitationData;