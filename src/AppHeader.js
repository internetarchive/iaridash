import React from "react";
import {Link, useLocation} from "react-router-dom";
import {ConfigContext} from "./contexts/ConfigContext";
import {IareEnvironments} from "./constants/environments";

export default function AppHeader({
                                      appTitle,
                                      versionInfo,
                                      siteInfo,
                                      buttonShowDebug,
                                      debugContents,
                                  }) {

    const location = useLocation();

    let myConfig = React.useContext(ConfigContext)
    myConfig = myConfig ? myConfig : {} // prevents undefined myConfig.[param_name] errors

    const publicRoutes = [
        ["/",'Home'],
        ["/tarb",'TARB Insights'],
        ["/webrx",'Web Rx'],
        ["/grid",'Data Grid'],
    ].map( rp => {
        return <li key={rp[0]}>
            <Link to={rp[0]} className={location.pathname === rp[0] ? "active-link" : ""}>{rp[1]}</Link>
        </li>
    })

    const localRoutes = [
        ["/command", 'Command Tester'],
        ["/links", 'Link Tester'],
    ].map(rp => {
        return <li key={rp[0]}>
            <Link to={rp[0]} className={location.pathname === rp[0] ? "active-link" : ""}>{rp[1]}</Link>
        </li>
    })

    return <div className={"header"}>

        <div className={"header-contents"}>
            <h1>{appTitle}</h1>
            <div className={"header-aux1"}>{versionInfo}{siteInfo}{buttonShowDebug}</div>
            {debugContents}
        </div>

        <nav className={"main-page-nav"}>
            <ul>
                {publicRoutes}
                {myConfig.environmentKey === IareEnvironments.LOCAL.key
                    ? localRoutes
                    : null}
            </ul>
        </nav>

        <hr/>

    </div>

}

