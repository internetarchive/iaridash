// src/components/pages/WebRx.js
import React from 'react';
import RouteHeader from "../RouteHeader";
import {nowTime} from "../main/dataUtils";
import WebRxStats from "../main/WebRxStats";

const WebRx = () => {

    return <>
            <RouteHeader caption = {"WebRx"}
                         subCaption = "Show results of WebRx accromination of different operations." />
            <WebRxStats options={{ dateRange:"2001-2025", anotherDate:"latest"}} />
        </>

}

export default WebRx;