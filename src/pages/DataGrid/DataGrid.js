// src/components/pages/DataGrid.js
import React from 'react';
import ScoreBoard from "./ScoreBoard";
import RouteHeader from "../../components/RouteHeader";

const DataGrid = () => {
    console.log("Page: DataGrid.js")
    return <>
        <RouteHeader caption = {"DataGrid"}
                     subCaption = "Compare results of different operations on a list of URLs." />
        <p style={{color:"#e30040", fontWeight:"bold"}}>Under Construction...</p>
        <ScoreBoard options={{}} />
    </>
}

export default DataGrid;