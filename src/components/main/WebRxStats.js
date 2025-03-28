import React from "react";
import RawJson from "../RawJson";
import webRxData from '../../__tests__/_test_data/webRxData.json';

/*
display command test for generic command, with response in response box
 */
export default function WebRxStats({options = null, onAction}) {

    // await fetch results for rx data:
////    iariSource/insights

    const displayData = <div>
        <h3>Raw WebRx data</h3>
        <RawJson obj={webRxData}/>
    </div>

    return <>

        <div className="row">
            <div className="col col-12">
                <p>WebRx stats data will go here.</p>
                {displayData}
            </div>
        </div>

    </>
}


