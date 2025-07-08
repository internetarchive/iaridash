import React, {useState} from "react";
import '../css/commandTest.css'

/*
display command test for generic command, with response in response box
 */
export default function CommandTestDisplay(
    {
        commandData = null,
        onAction
    }) {

    const editable = true
    const [localCommandText, setLocalCommandText]= useState("command text here")
    const localCommandResults = "Results will go here (state variable passed in to component)"

    const engageCommand = () => {
        // may want to set "fetching / waiting" status
        onAction({action: "engageCommand", value: localCommandText})
    }

    const buttonEngageCommand = <button
        className={`utility-button`} style={{width:"7rem"}}
        onClick={engageCommand}><span>{editable ? "Run CommandTest" : "???"}</span></button>

    // const header = <div className={"header-all-parts"}>
    //     <div className={"header-left-part"}>
    //         <h3>CommandTest Text</h3>{buttonEngageCommand}
    //     </div>
    // </div>

    return <>

            <div className="row">
                <div className="col col-12">

                    <div className={"header-all-parts"}>
                        <div className={"row header-left-part"}>
                            <h3>Command Text {buttonEngageCommand}</h3>
                        </div>
                    </div>

                    <textarea className={`command-text ${''/* your code here */}`}
                              readOnly={editable ? false : true}
                              value={localCommandText}
                              onChange={(e) => setLocalCommandText(e.target.value)}/>
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
                    <textarea className={`command-results-text result-text ${''/* your code here */}`}
                              readOnly={true}
                              value={localCommandResults} />
                </div>
            </div>

    </>
}


