import React from 'react';
import RouteHeader from "../components/RouteHeader";

const Home = () => {

    return ( <>
        <RouteHeader caption = {"Home"}
                     subCaption = "Welcome to the Home page" />

        <div className={"container-fluid"}>
            <div className={"row"}>
                <ul>
                    <li>Citations Database: Interact with James Hare's Citation Database</li>
                    <li>WebRx: Show statistics from WebMedic and LAMP</li>
                    <li>TARB: Show statistics from TARB Insights (currently not working on staging site)</li>
                    <li>Archive test: Quick archive status results for links</li>
                </ul>
            </div>
        </div>
    </> )
}

export default Home