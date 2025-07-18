import React from 'react';
import CitationsDataDisplay from "../services/CitationsDataDisplay";
import PathFetch from "../PathFetch";
import {ConfigContext} from "../../contexts/ConfigContext";
import Loader from "../Loader";
import MakeLink from "../MakeLink";


const CitationsDatabase = () => {
    const pathInitial = "https://en.wikipedia.org/wiki/Siemens_scandal"

    const hasMounted = React.useRef(false);
    const [isLoading, setIsLoading] = React.useState(false)
    const [isLoadingTimer, setIsLoadingTimer] = React.useState(false)
    const [citationParams, setCitationParams] = React.useState({
        pathName: pathInitial,
        useRawRefs: false
    })
    const [citationData, setCitationData] = React.useState(null);
    const [displayApiUrl, setDisplayApiUrl] = React.useState('');
    const [error, setError] = React.useState(null);


    let myConfig = React.useContext(ConfigContext)
    myConfig = myConfig ? myConfig : {} // prevents "myConfig.[param_name]" "undefined" errors
    const iariBase = myConfig && myConfig.iariBase


    const handleAction = (result) => {
        const {action, value} = result;
        console.log (`CitationsDatabase: handleAction: action=${action}, value=${value}`);

        if (0) {
            // allows for easy addition of "else if"
        }

        else if (action === "fetch_citation_data"
        ) {
            console.log("CitationsDatabase: Action: fetch citation data")
        }

        else {
            console.log(`Action "${action}" not supported.`)
            alert(`Action "${action}" not supported.`)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }

    const handlePathResults = (pathResults) => {
        setCitationParams({
            pathName: pathResults.path,
            useRawRefs: pathResults.options?.useRawRefs,
        })
    }


    // used to display in console
    React.useEffect(() => {
        if (hasMounted.current) {
            // use of "hasMounted" prevents fetching of data during
            // component first time with null citationParams.pathName

            console.log(`citationParams: pathName: ${citationParams.pathName}; checkRawRefs: ${citationParams.useRawRefs}`)
            // alert(`Received new citationParams: pathName: ${citationParams.pathName} and checkRawRefs: ${citationParams.useRawRefs}`)

            // const citationApiUrl = `https://wikipediacitations.scatter.red/?url=${encodedUrl}&output=json`
            const baseUrl = `${iariBase}refs_lookup`
            const params = new URLSearchParams({
                url: encodeURI(citationParams.pathName),
                output: 'json',
                raw: citationParams.useRawRefs ? 'true' : 'false',
            });

            const apiUrl = `${baseUrl}?${params.toString()}`
            console.log(`Citations Database apiUrl: ${apiUrl}`)
            setDisplayApiUrl(apiUrl)

            const fetchData = async () => {
                setIsLoading(true)
                setError(null)
                setIsLoadingTimer(true)  // prevents "too soon" flashing of loading icon
                setTimeout(() => {
                    setIsLoadingTimer(false)
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

        } else {
            hasMounted.current = true
        }
    }, [citationParams, iariBase]);


    const errors = !error ? null : (
        <div className={"errors"}>Error: {error}</div>
    )


    return <div className="citation-data-container">

        <div className="row gx-0 citation-data-header">
            <div className="col col-12 citation-path-fetch-container">
                <PathFetch
                    initialPath={citationParams.pathName}
                    initialUseRawRefs={citationParams.useRawRefs}
                    initialUseRawRefsLabel = "Show Raw References"

                    handleSubmit={handlePathResults}
                    submitButtonText = "Submit"

                    placeholder={"Enter a Wikipedia article here"}
                />
            </div>
        </div>

        <div className="row citation-data-body">
        {isLoading || isLoadingTimer
            ? <Loader message={"Fetching Citations Data..."}/>
            : <CitationsDataDisplay
                    citationData={citationData}
                    citationLabel={{
                        caption: `Citation Data for: ${citationParams.pathName}`,
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

export default CitationsDatabase;