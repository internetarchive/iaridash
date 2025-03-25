import React from "react";
import {Link, useLocation} from "react-router-dom";
import {ConfigContext} from "./contexts/ConfigContext";

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

    const localRoutes = (myConfig.environment === "env-local")
        ? <>
            <li>
                <Link to="/command" className={location.pathname === "/command" ? "active-link" : ""}>Command Tester</Link>
            </li>
            <li>
                <Link to="/links" className={location.pathname === "/links" ? "active-link" : ""}>Test Links</Link>
            </li>
        </>
        : null


    return <div className={"header"}>

        <div className={"header-contents"}>
            <h1>{appTitle}</h1>
            <div className={"header-aux1"}>{versionInfo}{siteInfo}{buttonShowDebug}</div>
            {debugContents}
        </div>

        <nav className={"main-page-nav"}>
            <ul>
                <li>
                    <Link to="/" className={location.pathname === "/" ? "active-link" : ""}>Home</Link>
                </li>
                <li>
                    <Link to="/tarb" className={location.pathname === "/tarb" ? "active-link" : ""}>TARB Insights</Link>
                </li>
                <li>
                    <Link to="/grid" className={location.pathname === "/grid" ? "active-link" : ""}>Data Grid</Link>
                </li>

                {localRoutes}

            </ul>
        </nav>

        <hr/>

    </div>

}

