import React from 'react';
import {ConfigContext} from "../../contexts/ConfigContext";
// import {IareEnvironments} from "../../constants/environments";
import RouteHeader from "../../components/RouteHeader";
import Loader from "../../components/Loader";
// import WikiDisplay from "../Wiki/WikiDisplay";
import TarbInsightsDisplay from "./TarbInsightsDisplay";
import TarbInsightsDisplayRaw from "./TarbInsightsDisplayRaw";
// import RouteHeader from "../RouteHeader";


const FETCHING_FROM_TEST = false;


const TarbInsights = () => {

    const [tarbData, setTarbData] = React.useState({})
    const [isLoading, setIsLoading] = React.useState(false)

    let myConfig = React.useContext(ConfigContext)
    myConfig = myConfig ? myConfig : {} // prevents "myConfig.[param_name]" "undefined" errors
    const iariBase = myConfig && myConfig.iariBase

    React.useEffect(() => {

        const fetchTarbData = async () => {

            // if fetching quick test data from file
            if (FETCHING_FROM_TEST) {
                return fetchJsonFromFile()
            }

            // Fetch from API endpoint
            const urlFetchTarb = `${iariBase}tarb_insights`

            return fetch(urlFetchTarb);

        }

        const fetchJsonFromFile = async () => {
            // Fetch from local JSON file
            const tarbDataFromFile = require('../../__tests__/_test_data/tarb_insights_short.json');
            return new Promise((resolve) => {
                resolve({
                    json: () => Promise.resolve(tarbDataFromFile)
                });
            });
        }


        const gatherTarbData = async () => {

            try {

                setIsLoading(true)

                const response = await fetchTarbData()
                const myData = await response.json()

                if (FETCHING_FROM_TEST) {
                    // do this if displaying raw IABot data:
                    // validate, returning null if fail
                    if (!myData?.['tarb_data']?.['statistics']) {
                        setTarbData(null)
                        // TODO: somehow indicate error
                    } else {
                        setTarbData(myData['tarb_data'])
                    }
                } else {
                    // do this if from iari/tarb_insights

                    // validate, returning null if fail
                    if (!myData?.['summary_data']) {
                        setTarbData(null)
                        // TODO: somehow indicate error
                    } else {
                        setTarbData(myData)
                    }
                }


            } catch (error) {
                console.error('Error fetching data:', error.message);
                console.error(error.stack);
                setTarbData(null)

            } finally {
                setIsLoading(false);
            }

        }

        gatherTarbData();

    }, [iariBase])

    return <div className={"wiki-container"}>
        <div className={"wiki-header"}>
            <RouteHeader caption={"TARB Metrics"}
                         subCaption={true && "Show TARB statistical data."}/>
        </div>

        <div className={"wiki-body"}>
            {isLoading
                ? <Loader message={"Fetching Tarb Data..."}/>
                : FETCHING_FROM_TEST
                    ? <TarbInsightsDisplayRaw
                    tarbData={tarbData}
                    options={{dateRange: "2016-2025", anotherDate: "latest"}} />
                    : <TarbInsightsDisplay
                        tarbData={tarbData}
                        options={{dateRange: "2016-2025", anotherDate: "latest"}} />

            }
        </div>
    </div>
}

export default TarbInsights