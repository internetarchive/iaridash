import React from 'react';
import Loader from "../../components/Loader";
import RouteHeader from "../../components/RouteHeader";
import WikiDisplay from "./WikiDisplay";
import './wiki.css';
// import webRxDataFromFile from '../../__tests__/_test_data/webRxData.json';
import {ConfigContext} from "../../contexts/ConfigContext";


const Wiki = () => {

    const [wikiData, setWikiData] = React.useState({})
    const [isLoading, setIsLoading] = React.useState(false)

    let myConfig = React.useContext(ConfigContext)
    myConfig = myConfig ? myConfig : {} // prevents "myConfig.[param_name]" "undefined" errors
    const iariBase = myConfig && myConfig.iariBase

    React.useEffect( () => {

        const fetchWikiData = async () => {

            const urlFetchWiki = `${iariBase}wiki_insights`

            return fetch(urlFetchWiki);

        }

        const gatherWikiData = async () => {

            try {
                setIsLoading(true)

                const response = await fetchWikiData()
                const myData = await response.json()

                setWikiData(myData)

            } catch (error) {
                console.error('Error fetching data:', error.message);
                console.error(error.stack);
                setWikiData(null)

            } finally {
                setIsLoading(false);
            }

        }

        gatherWikiData();

    }, [iariBase])


    return <div className={"wiki-container"}>
        <div className={"wiki-header"}>
            <RouteHeader caption={"Wiki Metrics"}
                         subCaption={false && "Show Wiki statistical data."}/>
        </div>

        <div className={"wiki-body"}>
            {isLoading
                ? <Loader message={"Fetching Wiki Data..."}/>
                : <WikiDisplay
                    wikiData={wikiData['external_urls']}
                    options={{dateRange:"2001-2025", anotherDate:"latest"}}
                />
            }
        </div>
    </div>
}

export default Wiki;