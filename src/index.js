import React  from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.js';
import 'react-tooltip/dist/react-tooltip.css'

import "bootstrap/dist/js/bootstrap.bundle.min";
// import './custom.scss'; // includes bootstrap.scss
import 'bootstrap/scss/bootstrap.scss';

import './index.css';
import './custom_defs_v1.css';
// import './custom_defs_v2.css';
import './custom.css';

import {UrlStatusCheckMethods} from "./constants/checkMethods";
import {IariSources} from "./constants/iariSources";
import {IareEnvironments} from "./constants/environments";

const REGEX_ENV_PRODUCTION = new RegExp(/^(?:(?:[\w-]+\.)+)?(?:[\w-]+\.)?archive\.org$/);
const REGEX_ENV_STAGE = new RegExp(/^internetarchive.github.io/);
const REGEX_ENV_LOCAL = new RegExp(/^localhost:3300/);
// checks if "(\.?)archive.org" at end of string


const getIariSource = (qParams, targetEnvKey) => {
    // TODO: will change default to "iari" eventually, when that endpoint is stable

    // Production IARE environment ALWAYS gets iari_prod  source:
    if (targetEnvKey === IareEnvironments.PROD.key) {
        return IariSources.iari_prod.key
    }

    // set to specified source if specified, iari_stage if not Local and not specified
    const sourceKey = queryParameters.has("iari-source")
        ? queryParameters.get("iari-source")
        : (targetEnvKey === IareEnvironments.LOCAL.key
            ? IariSources.iari_local.key   // default to iari_local if IARE is local
            : IariSources.iari_stage.key)  // else default to iari_stage if not specified

    // if specified source not in our defined choices, default to staging, and log error
    if (!IariSources[sourceKey]) {
        console.error(`IARI Source ${sourceKey} not supported.`)
        return IariSources.iari_stage.key
    }
    return sourceKey
}


const getEnvironment = () => {
    // comment out when not debugging...
    // return IareEnvironments.PROD
    // return IareEnvironments.STAGE
    // return IareEnvironments.STAGE

    const host = window.location.host
    if (REGEX_ENV_PRODUCTION.test(host)) return IareEnvironments.PROD
    if (REGEX_ENV_STAGE.test(host)) return  IareEnvironments.STAGE
    if (REGEX_ENV_LOCAL.test(host)) return  IareEnvironments.LOCAL
    return IareEnvironments.OTHER
}

const getMethod = (qParams, targetEnvKey) => {
    const keyDefaultMethod = UrlStatusCheckMethods.WAYBACK.key

    if (targetEnvKey === IareEnvironments.PROD) return keyDefaultMethod
    // else
    const methodKey = queryParameters.has("method")
        ? queryParameters.get("method")
        : keyDefaultMethod

    // if specified method not in defined methods, default to keyDefaultMethod, and log error
    if (!UrlStatusCheckMethods[methodKey]) {
        console.error(`Method ${methodKey} not supported.`)
        return keyDefaultMethod
    }
    return methodKey
}

// must calc with extraction because hash stops query params from being parsed
const queryString = window.location.hash.split('?')[1]  // Extract the part after "?" from the hash

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
const queryParameters = new URLSearchParams(queryString)
const env = getEnvironment();  // return an Environment structure

const myDebug = queryParameters.has("debug") ? queryParameters.get("debug").toLowerCase() === 'true' : false;
const myRefresh = queryParameters.has("refresh") ? queryParameters.get("refresh").toLowerCase() === 'true' : false;
const myIariSourceId = getIariSource(queryParameters, env?.key);
const myMethod = getMethod(queryParameters, env?.key);

root.render(<App env={env}
                 myRefresh={myRefresh}
                 myMethod={myMethod}
                 myIariSourceId={myIariSourceId}
                 myDebug={myDebug}
/>);

