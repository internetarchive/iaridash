// src/components/pages/Grid.js
import React from 'react';
import ScoreBoard from "../../components/main/ScoreBoard";
import RouteHeader from "../RouteHeader";

const Grid = () => {
    console.log("Page: Grid.js")
    return <>
        <RouteHeader caption = {"Grid"}
                     subCaption = "Compare results of different operations on a set of URLs." />
        <ScoreBoard options={{}} />
    </>
}

export default Grid;