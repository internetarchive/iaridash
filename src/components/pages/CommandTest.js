import React from 'react';
import CommandTestDisplay from "../modules/CommandTestDisplay";
import RouteHeader from "../RouteHeader";

const CommandTest = () => {

    const handleAction = (result) => {
        // error of not object like: {action: <action>, value: <value>}
        const {action, value} = result;
        console.log (`Command:handleAction: action=${action}, value=${value}`);

        if (0) {
            // placebo to make coding easier for adding "else if" conditions
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