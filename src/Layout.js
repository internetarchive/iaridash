// src/Layout.js
import React from 'react';
import AppHeader from './AppHeader';
import {Outlet} from "react-router-dom";
import {ConfigContext} from "./contexts/ConfigContext";

const Layout = ({ options={}, children }) => {
    console.log("rendering Layout.js")

    let myConfig = React.useContext(ConfigContext)
    myConfig = myConfig ? myConfig : {} // prevents "myConfig.[param_name]" "undefined" errors

    return (
        <div className="wrapper">
            <AppHeader
                debug={options.debug}
                appTitle={myConfig.appTitle}
                versionDisplay={myConfig.versionDisplay}
                siteDisplay={myConfig.siteDisplay}
                showHideDebugButton={myConfig.showHideDebugButton}
            />
            <hr/>

            <Outlet />

        </div>
    );
};

export default Layout;