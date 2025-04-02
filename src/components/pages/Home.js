import React from 'react';
import RouteHeader from "../RouteHeader";

const Home = () => {

    return ( <>
        <RouteHeader caption = {"Home"}
                     subCaption = "Welcome to the Home page" />

        <div className={"container-fluid"}>
            <div className={"row"}>
                <ul>
                    <li>WebRx: Show statistics from WebMedic and LAMP</li>
                    <li>TARB: Show statistics from TARB Insights (currently not working on public site)</li>
                    <li>Archives: Quick archive status results for links</li>
                    <li>Data Grid: Compare operation results for set of links</li>
                </ul>
            </div>
        </div>
    </> )
}

export default Home