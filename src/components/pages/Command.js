import React from 'react';
import CommandTest from "../main/CommandTest";
import RouteHeader from "../RouteHeader";

const Command = () => {

    const handleAction = (result) => {
        // error of not object like: {action: <action>, value: <value>}
        const {action, value} = result;
        console.log (`Command:handleAction: action=${action}, value=${value}`);

        if (0) {
            // placebo to make coding easier for adding "else if" conditions
        }


        else {
            console.log(`ScoreBoard Action "${action}" not supported.`)
            alert(`Scoreboard Action "${action}" not supported.`)
        }

    }

    return (<>
        <RouteHeader caption = {"Command Tester"} subCaption = "Page to exercise commands over the wire" />

        <div className={"container-fluid"}>
            <div className="row">
                <div className={"col-12"}>
                    <CommandTest commandData={{}} onAction={handleAction}/>
                </div>
            </div>
        </div>
        </>
    );
};

export default Command;