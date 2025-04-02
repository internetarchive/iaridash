import React from 'react';
import AppHeader from './AppHeader';
import {Outlet} from "react-router-dom";
import {ConfigContext} from "./contexts/ConfigContext";

const Layout = ({ options={}, children }) => {
    console.log("rendering Layout.js, options:", options)

    let myConfig = React.useContext(ConfigContext)
    myConfig = myConfig ? myConfig : {} // prevents "myConfig.[param_name]" "undefined" errors

    return (
        <>
            <AppHeader
                appTitle={myConfig.appTitle}
                versionInfo={myConfig.versionDisplay}
                siteInfo={myConfig.siteDisplay}
                iariInfo={myConfig.iariSourceDisplay}

                buttonShowDebug={myConfig.buttonShowDebug}
                debugContents={myConfig.debugContents}
            />

            <Outlet />

        </>
    );
};

export default Layout;