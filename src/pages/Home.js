import React from 'react';
import RouteHeader from "../components/RouteHeader";

const Home = () => {

    return ( <>
        <RouteHeader caption = {"Home"}
                     subCaption = "Welcome to the Home page of IARI Dashboard" />

        <div className={"container-fluid"}>
            <div className={"row"}>
                <ul>
                    <li><span className={"hilite"}>Citations Database:</span> Interact with James Hare's Citation Database</li>
                    <li><span className={"hilite"}>WebRx:</span> Show statistics from WebMedic and LAMP</li>
                    <li><span className={"hilite"}>Wiki:</span> Show statistics from Wikipedia</li>
                    <li><span className={"hilite"}>TARB:</span> Show statistics from TARB Insights (currently not working on staging site)</li>
                    <li><span className={"hilite"}>Archive test:</span> Quick archive status results for links</li>
                </ul>
            </div>
        </div>
    </> )
}

export default Home