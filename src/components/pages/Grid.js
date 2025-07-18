// src/components/pages/Grid.js
import React from 'react';
import ScoreBoard from "../services/ScoreBoard";
import RouteHeader from "../RouteHeader";

const Grid = () => {
    console.log("Page: Grid.js")
    return <>
        <RouteHeader caption = {"Grid"}
                     subCaption = "Compare results of different operations on a list of URLs." />
        <p style={{color:"#e30040", fontWeight:"bold"}}>Under Construction...</p>
        <ScoreBoard options={{}} />
    </>
}

export default Grid;