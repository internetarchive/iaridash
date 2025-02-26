// src/components/pages/Grid.js
import React from 'react';
import ScoreBoard from "../../components/main/ScoreBoard";

const Grid = () => {
    console.log("Page: Grid.js")
    return (
        <div>
            <h1>Grid</h1>
            <div className={""}>

                <p>Compare results of different operations on the same set of data.</p>
                <ScoreBoard options={{}} />
            </div>
        </div>
    );
};

export default Grid;