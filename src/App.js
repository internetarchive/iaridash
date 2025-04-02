import React, {useEffect, useState} from "react";
import package_json from "../package.json";
import Dropdown from "./components/Dropdown";

import {IariSources} from "./constants/iariEndpoints";
import {UrlStatusCheckMethods} from "./constants/checkMethods";
import {IareEnvironments} from "./constants/environments";

import {ConfigContext, DataContext} from "./contexts/ConfigContext"

import AppRouter from "./AppRouter";


export default function App({
            env,  // this is an Environment structure
            myPath,
            myRefresh,
            myMethod,
            myIariSourceId,
            myDebug
}) {

    const appTitle = "Internet Archive Reference Inventory Dashboard"

    const [isDebug, setDebug] = useState(myDebug);
    const [isShowShortcuts, setIsShowShortcuts] = useState(true);
    const [isShowExpertMode, setIsShowExpertMode] = useState(true);
    const [isShowNewFeatures, setIsShowNewFeatures] = useState(true);

    // params settable from from address url
    const [refreshCheck, setRefreshCheck] = useState(myRefresh);
    const [checkMethod, setCheckMethod] = useState(myMethod);

    // eslint-disable-next-line no-unused-vars
    const [myError, setMyError] = useState(null);

    const [gridItems, setGridItems] = useState("")
    const [gridData, setGridData] = useState({})

    const toggleDebug = () => {
        setDebug(!isDebug);
    }

    // adds to body classList to indicate environment
    useEffect(() => {

        console.log('APP: useEffect[env]: ' +
            'app name: ' + package_json.name + ', ' +
            'version: ' + package_json.version + ', ' +
            'env: ' + env?.className
        )
        document.body.classList.add(env?.className);
    }, [env])
    // TODO do this up in index.js...


    // initialize
    useEffect(() => {
        setRefreshCheck(myRefresh);
    }, [myRefresh])


    const handleCheckMethodChange = (methodId) => {
        // console.log(`handleStatusMethodChange: new method is: ${methodId}`)
        setCheckMethod(methodId);
    };
    const methodChoices = Object.keys(UrlStatusCheckMethods).filter(f => !["IARI", "IABOT_SEARCHURL"].includes(f)).map( key => {
        return { caption: UrlStatusCheckMethods[key].caption, value: UrlStatusCheckMethods[key].key }
    })
    const methodChoiceSelect = <div className={"check-method-wrapper"}>
        <Dropdown choices={methodChoices} label={'Check Method:'} onSelect={handleCheckMethodChange} defaultChoice={checkMethod}/>
    </div>


    const handleIariSourceIdChange = (sourceId) => {

        // TODO:  what do we do here? change iariSource, i guess, and cause ScoreBoard to re-rerender
    };

    const iariChoices = Object.keys(IariSources)
        .filter(key => {
            return env?.key === IareEnvironments.STAGE.key
                ? !(key === "iari_local" || key === "iari")  // do not allow iari_local and iari on Staging
                : true
        })
        .map( key => {
            return { caption: IariSources[key].caption, value: IariSources[key].key }
        })

    const iariChoiceSelect = <div className={"iari-source-wrapper"}>
        <Dropdown choices={iariChoices} label={'Iari Source:'} onSelect={handleIariSourceIdChange} defaultChoice={myIariSourceId}/>
    </div>

    const versionInfo = `version ${package_json.version}`
    const siteInfo = (env?.key !== IareEnvironments.PROD.key)
        ? (env.key !== IareEnvironments.STAGE.key
            ? ` LOCAL `
            : ` STAGING `)
        : ''

    console.log("buttonShowDebug: env is " + env?.key)
    const buttonShowDebug = (env?.key !== IareEnvironments.PROD.key)
        && <button className={"utility-button debug-button small-button"}
            onClick={toggleDebug} >{
                isDebug ? <>&#8212;</> : "+"  // dash and plus sign
            }</button>
            // up and down triangles:  onClick={toggleDebug} >{isDebug ? <>&#9650;</> : <>&#9660;</>}</button>


    // console.log(`rendering App.js:`, JSON.stringify({
    //     refreshCheck: refreshCheck,
    //     statusMethod: checkMethod,
    //     iari_source: myIariSourceId,
    //     config: config,
    // }))
    console.log(`rendering App.js:`)

    useEffect(() => {
        setMyError(null)  // for now until fixed
    }, [])

    const buttons = <>
        <button // this is the 'show shortcuts' button
            className={"utility-button debug-button"}
            onClick={() => {
                setIsShowShortcuts(prevState => !prevState )
            }
            } >{isShowShortcuts ? "Hide" : "Show"} Shortcuts</button>
        &nbsp;
        <button // this is the 'show Expert Mode' button
            className={"utility-button debug-button"}
            onClick={() => {
                setIsShowExpertMode(prevState => !prevState )
            }
            } >{isShowExpertMode ? "Hide" : "Show"} Clipboard Controls</button>
        &nbsp;
        <button // this is the 'show New Features' button
            className={"utility-button debug-button"}
            onClick={() => {
                setIsShowNewFeatures(prevState => !prevState )
            }
            } >{isShowNewFeatures ? "Hide" : "Show"} New Features</button>
    </>

    // eslint-disable-next-line no-unused-vars
    const debugContents = <div className={"debug-section " + (isDebug ? "debug-on" : "debug-off")}>
        <div style={{marginBottom:".5rem"}}>{iariChoiceSelect} {methodChoiceSelect}</div>
        <div>{buttons}</div>
        <p><span className={'label'}>Environment:</span> {env?.caption}, ({window.location.host})</p>
        <p><span className={'label'}>IARE version:</span> {package_json.version}</p>
        <p><span className={'label'}>IARI Source:</span> {myIariSourceId} ({IariSources[myIariSourceId]?.endpoint})</p>
        <p><span className={'label'}>Check Method:</span> {UrlStatusCheckMethods[checkMethod].caption} ({checkMethod})</p>
        <p><span className={'label'}>URL from address line:</span> {myPath}</p>
        <p><span className={'label'}>Force Refresh:</span> {refreshCheck ? "TRUE" : "false"}</p>

    </div>

    // set config for config context
    const config = {
        appTitle: appTitle,
        environmentKey: env?.key,
        versionDisplay: versionInfo,
        siteDisplay: siteInfo,
        iariSource: IariSources[myIariSourceId]?.endpoint,
        iariSourceDisplay: IariSources[myIariSourceId]?.caption,
        urlStatusMethod: checkMethod,
        isDebug: !!isDebug,
        buttonShowDebug: buttonShowDebug,
        isShowShortcuts: isShowShortcuts,
        isShowExpertMode: isShowExpertMode,
        isShowNewFeatures: isShowNewFeatures,
        debugContents: debugContents
    }

    // in the following render, we wrap in ConfigContext so all components in the sub-tree
    // can access this, and provide DataContext to provide access to data that is retained
    // across routing changes (within AppRouter).
    // If we did not pass dataContext from this level, data for the Grid component would be
    // reset every time we changed the route. I suppose there are other ways to persist state
    // or data (like a db)

    // console.log("environmentKey: " + env?.key)
    return (
        <ConfigContext.Provider value={config}>
            <DataContext.Provider value={{gridItems, setGridItems, gridData, setGridData}}>
                <div className="iaridash">
                    <AppRouter />
                </div>
            </DataContext.Provider>
        </ConfigContext.Provider>
    )

}
