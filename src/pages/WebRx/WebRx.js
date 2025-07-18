import React from 'react';
import Loader from "../../components/Loader";
import RouteHeader from "../../components/RouteHeader";
import WebRxStats from "./WebRxStats";
import './webrx.css';
// import webRxDataFromFile from '../../__tests__/_test_data/webRxData.json';
import {ConfigContext} from "../../contexts/ConfigContext";


const WebRx = () => {

    const myConfig = React.useContext(ConfigContext);
    const myIariSource = myConfig?.iariSource;

    // await fetch results for rx data:
////    iariSource/insights

    const [webRxData, setWebRxData] = React.useState({})
    const [isLoading, setIsLoading] = React.useState(false)

    React.useEffect( () => {

        const fetchWebRxData = async () => {

            const urlFetchWebRx = `${myIariSource}/insights`

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

    }, [myIariSource])





    return <>
        {false && <RouteHeader caption = {"WebRx Statistics"}
                         subCaption = {false && "Show WebRx aggregate data results."} />}

        {isLoading
            ? <Loader message={"Fetching WebRx Data..."}/>
            : <WebRxStats
                webRxData={webRxData}
                options={{dateRange:"2001-2025", anotherDate:"latest"}}
            />
        }
    </>
}

export default WebRx;