import React from 'react';
import CitationsDataDisplay from "../modules/CitationsDataDisplay";
import PathFetch from "../PathFetch";
import {ConfigContext} from "../../contexts/ConfigContext";
import Loader from "../Loader";


const CitationsDatabase = () => {
    const pathInitial = "https://en.wikipedia.org/wiki/Siemens_scandal"

    const hasMounted = React.useRef(false);
    const [isLoading, setIsLoading] = React.useState(false)
    const [citationParams, setCitationParams] = React.useState({
        pathName: pathInitial,
        checkedRawRefs: false
    })
    const [citationData, setCitationData] = React.useState(null);
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
            const baseUrl = `${iariBase}/refs_lookup/`

            // const citationApiUrl = `https://wikipediacitations.scatter.red/?url=${encodedUrl}&output=json`

            const params = new URLSearchParams({
                url: encodeURIComponent(citationParams.pathName),
                output: 'json',
                // ...extraParams
            });
            // return `${base}?${params.toString()}`;
            const apiUrl = `${baseUrl}?${params.toString()}`

            const fetchData = async () => {
                setIsLoading(true)
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
                <CitationsDataDisplay
                    citationData={citationData}
                    citationLabel={{
                        caption: `Data for Citation Data for ${citationParams.pathName}`,
                        other: 'other caption data, like num records, e.g., can go here'
                    }}
                    options = {{}}
                    onAction = {handleAction}
                />
            </div>
        }
    </>
}

export default CitationsDatabase;