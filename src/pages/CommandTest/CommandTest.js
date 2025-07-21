import React from 'react';
import CommandTestDisplay from "./CommandTestDisplay";
import RouteHeader from "../../components/RouteHeader";

const CommandTest = () => {

    const handleAction = (result) => {
        // error of not object like: {action: <action>, value: <value>}
        const {action, value} = result;
        console.log (`Command:handleAction: action=${action}, value=${value}`);

        if (0) {
            // placebo to make coding easier for adding "else if" conditions
        }

        else if (action === "opCommand") {
            console.log(`CommandTest Action: "${action}" engaged.`)
            alert(`CommandTest Action: "${action}" engaged.\n`
            + `What does it do? run as http and hope it gets results as JSON?\n`
            + `Display as html if can be?\n`
            + `or, what...show as plain text or offer reader?`)
        }


        else {
            console.log(`CommandTest Action "${action}" not supported.`)
            alert(`CommandTest Action "${action}" not supported.`)
        }

    }

    return (<>
        <RouteHeader caption = {"CommandTest Tester"} subCaption = "Page to exercise commands over the wire" />

        <div className={"container-fluid"}>
            <div className="row">
                <div className={"col-12"}>
                    <CommandTestDisplay commandData={{}} onAction={handleAction}/>
                </div>
            </div>
        </div>
        </>
    );
};

export default CommandTest;