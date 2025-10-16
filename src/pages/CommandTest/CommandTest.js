import React from 'react';
import CommandTestDisplay from "./CommandTestDisplay";
import RouteHeader from "../../components/RouteHeader";

const CommandTest = () => {

    const [jsonCommandResults, setJsonCommandResults] = React.useState({})

    const sectionTitle = "Command Tester"
    const sectionDescription = "Exercise commands over the wire; assumes output is in JSON format"

    const commandList = [
        // "https://iabot.wmcloud.org/api.php?action=statistics&format=flat", // from tarb_insighta
        "https://iabot-api.archive.org/services/context/iari-stage/v2/version", // version of stage IARI
        "https://iabot-api.archive.org/services/context/iari-stage/v2/tarb_insights", // TARB stats data

        "http://localhost:5001/v2/version",
        "http://localhost:5001/v2/tarb_insights",   // TARB stats data
        "http://localhost:5001/v2/wiki_insights",   // Wiki stats data
        "http://localhost:5001/v2/insights",        // WebRx stats data

        "(following has CORS issue)", // TARB stats data
        "https://commons.wikimedia.org/w/index.php?title=Data%3AWikipedia%5Fstatistics%2Fexturls%2Etab&action=raw",

    ]

    const commandText = "https://iabot.wmcloud.org/api.php?action=statistics&format=flat"

    const fetchJsonCommandResults = async (command) => {

        let method = "GET"
        try {
            const response = await fetch(
                command,
                {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
            const jsonData = await response.json();
            return {
                "command": command,
                "results": jsonData
            };
        } catch (error) {
            console.error('Error fetching command results:', error);
            return {
                "command": command,
                "results": `Error: ${error.message}`
            };
        }
    }

    const handleAction = (result) => {
        // error of not object like: {action: <action>, value: <value>}
        const {action, value} = result;
        console.log (`Command:handleAction: action=${action}, value=${value}`);

        if (0) {
            // placebo to make coding easier for adding "else if" conditions
        }

        else if (action === "opCommand") {
            console.log(`CommandTest Action: "${action}" engaged.`)
            // alert(`CommandTest Action: ${action}, command: ${value}`)

            // fetch command results, and set property to be delegated to CommandTest display
            fetchJsonCommandResults(value).then(results => setJsonCommandResults(results))
        }


        else {
            console.log(`CommandTest Action "${action}" not supported.`)
            alert(`CommandTest Action "${action}" not supported.`)
        }

    }

    return (<>
        <RouteHeader caption = {sectionTitle} subCaption ={sectionDescription} />

        <div className={"container-fluid"}>
            <div className="row">
                <div className={"col-12"}>
                    <CommandTestDisplay
                        commandResults={jsonCommandResults}
                        commandList={commandList}
                        commandText={commandText} onAction={handleAction}/>
                </div>
            </div>
        </div>
        </>
    );
};

export default CommandTest;