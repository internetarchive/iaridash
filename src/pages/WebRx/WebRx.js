import React from 'react';
import Loader from "../../components/Loader";
import RouteHeader from "../../components/RouteHeader";
import WebRxDisplay from "./WebRxDisplay";
import './webrx.css';
// import webRxDataFromFile from '../../__tests__/_test_data/webRxData.json';
import {ConfigContext} from "../../contexts/ConfigContext";


const WebRx = () => {

    const [webRxData, setWebRxData] = React.useState({})
    const [isLoading, setIsLoading] = React.useState(false)

    let myConfig = React.useContext(ConfigContext)
    myConfig = myConfig ? myConfig : {} // prevents "myConfig.[param_name]" "undefined" errors
    const iariBase = myConfig && myConfig.iariBase

    React.useEffect( () => {

        const fetchWebRxData = async () => {

            const urlFetchWebRx = `${iariBase}insights`

            return fetch(urlFetchWebRx);

        }

        const gatherWebRxData = async () => {

            try {
                setIsLoading(true)

                const response = await fetchWebRxData()
                const myData = await response.json()

                setWebRxData(myData)

            } catch (error) {
                console.error('Error fetching data:', error.message);
                console.error(error.stack);
                setWebRxData(null)

            } finally {
                setIsLoading(false);
            }

        }

        gatherWebRxData();

    }, [iariBase])





    return <div className={"webrx-container"}>
        <div className={"webrx-header"}>
            <RouteHeader caption={"WebRx Metrics"}
                          subCaption={false && "Show WebRx aggregate data results."}/>
        </div>

        <div className={"webrx-body"}>
        {isLoading
            ? <Loader message={"Fetching WebRx Data..."}/>
            : <WebRxDisplay
                webRxData={webRxData}
                options={{dateRange:"2001-2025", anotherDate:"latest"}}
            />
        }
        </div>
    </div>
}

export default WebRx;