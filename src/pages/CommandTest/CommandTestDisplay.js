import React, {useEffect, useState} from "react";
import './commandTest.css'
import {JsonEditor} from "json-edit-react";

/*
displays results of command test sent over the wire
 */

export default function CommandTestDisplay(
    {
        commandText = null,
        commandResults = null,
        commandList = [],
        commandSetSelected = "test",
        onAction
    }) {

    const editable = true
    const [localCommandText, setLocalCommandText]= useState( commandText ? commandText : "")
    const [textData, setTextData] = useState(commandResults?.results || {});

    // update command results text data area when commandResults
    useEffect(() => {
        if (commandResults?.results !== undefined &&
            commandResults.command === localCommandText)   // NB Why this? to ensure synchronicity?
        {
            setTextData(commandResults.results);
        }
    }, [commandResults, localCommandText]);


    const engageCommand = () => {
        const now = new Date();
        const hours = now.getHours() % 12 || 12;
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
        const timestamp = `${hours}:${minutes}:${seconds} ${ampm}`;
        console.log(`Command executed at: ${timestamp}`);
        setTextData(`Waiting for response (${timestamp})`)

        onAction({action: "run_command", value: localCommandText})
    }

    const buttonEngageCommand = <button
        className={`utility-button`} style={{width:"7rem", marginTop: "-0.2rem", marginLeft: "1rem"}}
        onClick={engageCommand}><span>{editable ? "Run Command" : "???"}</span></button>

    const suggestedCommands = commandList.length > 0
        // eslint-disable-next-line
        ? commandList.map((command, i) => <a
            key={i}
            href={"#"}
            onClick={(e) => {
                e.preventDefault();
                setLocalCommandText(command)}
            }
            className="suggested-command"
        >{command}</a>)
        : <p>No commands to show</p>

    // const commandSets = ["test", "iari", "other"]
    const commandSets = ["test", "iari"]

    const commandSetChooser = (
        <div style={{marginLeft: "1rem", display: "inline-flex", alignItems: "center"}}>
            {commandSets.map((commandSet) => {
                const label = commandSet === "test"
                    ? "IARI version tests"
                    : commandSet === "iari"
                        ? "IARI Commands"
                        : commandSet

                return <>
                    <label key={commandSet} style={{marginRight: "1rem"}}>
                        <input
                            type="radio"
                            name="commandSet"
                            value={commandSet}
                            checked={commandSetSelected === commandSet}
                            onChange={(e) => onAction({
                                "action": "change_command_set", "value": e.target.value
                            })}
                        /><span className={"iare-label"}>{label}</span>
                    </label>
                </>
                }
            )}
        </div>
    );

    return <>

        <div className="row">
            <div className="col col-12">

                <div className={"header-all-parts"}>
                    <div className={"row header-left-part"}>
                        <h3>Suggested Commands{commandSetChooser}<br/><span className={"sub-command"}>Clicking an item
                            inserts it into Command Text</span></h3>
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
                        <h3>Command Text{buttonEngageCommand} <br/><span
                            className={"sub-command"}>Click "Run Command" to execute command</span></h3>
                    </div>
                </div>

                <textarea className="command-text"
                          id="command-text"
                          name="command-text"
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
                <div className={`command-string`}>
                    <span className={"iari-label"}>Command:</span> {commandResults.command}
                </div>
                <div className={`command-string`}>
                    <span className={"iari-label"}>Results:</span>
                </div>

                <div className={`command-results`}>
                    <JsonEditor data={textData}/>
                </div>

            </div>
        </div>

    </>
}


