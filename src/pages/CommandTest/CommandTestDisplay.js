import React, {useState} from "react";
import './commandTest.css'
import {JsonEditor} from "json-edit-react";

/*
display command test for generic command, with response in response box
 */
export default function CommandTestDisplay(
    {
        commandText = null,
        commandResults = null,
        commandList = [],
        onAction
    }) {

    const editable = true
    const [localCommandText, setLocalCommandText]= useState( commandText ? commandText : "")

    const engageCommand = () => {
        // may want to set "fetching / waiting" status
        onAction({action: "opCommand", value: localCommandText})
    }

    const buttonEngageCommand = <button
        className={`utility-button`} style={{width:"7rem", marginTop: "-0.2rem", marginLeft: "1rem"}}
        onClick={engageCommand}><span>{editable ? "Run Command" : "???"}</span></button>


    const suggestedCommands = commandList.length > 0
        ? commandList.map((command, i) => <a
            key={i}
            onClick={() => setLocalCommandText(command)}
            className="suggested-command"
        >{command}</a>)
        : <p>No commands to show</p>

    console.log(`suggestedCommands: ${suggestedCommands}`)

    return <>

        <div className="row">
            <div className="col col-12">

                <div className={"header-all-parts"}>
                    <div className={"row header-left-part"}>
                        <h3>Suggested Commands <span style={{fontSize:"67%", fontStyle:"italic", color:"grey"}}>click to insert as Command Text</span></h3>
                    </div>
                </div>

                <div className="suggested-commands-container" style={{marginBottom: "1rem"}}>
                    {suggestedCommands}
                </div>
            </div>
        </div>


        <div className="row">
            <div className="col col-12">

                <div className={"header-all-parts"}>
                    <div className={"row header-left-part"}>
                        <h3>Command Text {buttonEngageCommand}</h3>
                    </div>
                </div>

                <textarea className="command-text"
                          readOnly={editable ? false : true}
                          value={localCommandText}
                          onChange={(e) => setLocalCommandText(e.target.value)}
                          placeholder="Enter your command here"/>
            </div>
        </div>

        <div className="row">&nbsp;</div>

        <div className="row">
            <div className="col col-12">
                <div className={"header-all-parts"}>
                    <div className={"row header-left-part"}>
                        <h3>Command results</h3>
                    </div>
                </div>
            </div>

            <div className="col col-12">
                {/*<textarea className={`command-results-text result-text ${''/* your code here *!/`}*/}
                {/*          readOnly={true}*/}
                {/*          value={localCommandResults} />*/}
                <div className={`command-string`}>
                    <span className={"iari-label"}>Command:</span> {commandResults.command}
                </div>
                <div className={`command-string`}>
                    <span className={"iari-label"}>Results:</span>
                </div>

                <div className={`command-results`}>
                    <JsonEditor data={commandResults.results}/>
                    {/*<pre>{JSON.stringify(commandResults.results, null, 2)}</pre>*/}
                </div>

            </div>
        </div>

    </>
}


