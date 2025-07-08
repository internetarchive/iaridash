import React from "react"
import Checkbox from "./Checkbox";

/*

pathFetch is customized for Citations DB path fetch at the moment, becuase it
has a hard-set checkbox for "Show Raw Refs"

we should generalize this to take an array of auxiliary settings that
 get passed along with the path name upon return
*/

export default function PathFetch(
    {
        initialPath='',
        initialCheckedRawRefs= false,
        initialCheckedRawRefsLabel= 'Show Raw References',
        handleSubmit,
        labelPathText = "Submit",
        submitButtonText = "Submit",
        placeholder='',
        className = '',
    }) {

    const [pathName, setPathName] = React.useState(initialPath); // init with passed in name
    const [checkedRawRefs, setCheckedRawRefs] = React.useState(initialCheckedRawRefs);

    const handlePathChange = (event) => {
        console.log("CitationsDataDisplay::handlePathChange: event.target.value is:" + event.target.value)
        setPathName(event.target.value);
    }

    const handlePathKeyPress = (event) => {
        console.log("PathFetch::handlePathKeyPress: ")
        let key = event.key;
        if (key === "Enter") {
            console.log("PathFetch::handlePathKeyPress: submitting via enter-key")
            returnResults()
        }
    }

    const handlePathSubmit = (event) => {
        console.log("PathFetch::handlePathSubmit: pathName is: " + pathName)
        returnResults()
    }

    const returnResults = () => {
        // TODO handle return checked results in a generic fashion
        handleSubmit({
            path: pathName,
            options: {
                checkedRawRefs: checkedRawRefs
            }
        })
    }

    const pathFetch = <div className={"path-input-wrapper"}
    ><label
        htmlFor="pathInput" className={'path-input-label'}>Wikipedia Article URL:</label
    ><input
        id="pathInput" name="pathInput"
        className={"path-fetch-input"}
        type="search"
        // list="shortcuts-list"  // could add a shortcut list
        //    <datalist id="shortcuts-list">
        // {shortcuts.map(sc => <option key={sc.value} value={sc.value}/>)}
        // </datalist>
        autoComplete="on"
        value={pathName}
        onChange={handlePathChange}
        onKeyPress={handlePathKeyPress} // TODO deprecated - should change to onKeyDown
        placeholder={placeholder ? placeholder : ''}
    />
    </div>

    const fetchOptions = <div>
        <Checkbox className={"chk-fetch-options"}
                  id="chk-raw-refs"
                  label={" " + initialCheckedRawRefsLabel}
                  value={checkedRawRefs}
                  onChange={() => {
                      setCheckedRawRefs(!checkedRawRefs)
                  }}
        />
    </div>

    return <div className={`path-fetch-wrapper ${className ? className : ''}`}>
        {pathFetch}
        {fetchOptions}
        <div style={{display: "block"}}>
            <button
                className={"utility-button"}
                style={{margin: "0 0 0.2rem 10px"}}
                onClick={handlePathSubmit}>
                <span>{submitButtonText}</span>
            </button
            >
        </div>

    </div>
}


