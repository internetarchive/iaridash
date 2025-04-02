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
import {IariSources} from "./constants/iariEndpoints";
import {IareEnvironments} from "./constants/environments";

const REGEX_PRODUCTION_ENV = new RegExp(/^(?:(?:[\w-]+\.)+)?(?:[\w-]+\.)?archive\.org$/);
// checks if "(\.?)archive.org" at end of string


const getIariSource = (qParams, targetEnvironment) => {
    // TODO: will change default to "iari" eventually, when that endpoint is stable

    // ALWAYS hard-wire IARI source to iari_prod when IARE in Production environment
    if (targetEnvironment === IareEnvironments.PROD.key) {
        return IariSources.iari_prod.key
    }

    // else default to Staging if not specified
    const sourceKey = queryParameters.has("iari-source")
        ? queryParameters.get("iari-source")
        : IariSources.iari_stage.key

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

    const host = window.location.host
    if (REGEX_PRODUCTION_ENV.test(host)) return IareEnvironments.PROD
    if (host === "internetarchive.github.io") return  IareEnvironments.STAGE
    if (host === "localhost:3300") return  IareEnvironments.LOCAL
    return IareEnvironments.OTHER
    // const host = window.location.host
    // if (REGEX_PRODUCTION_ENV.test(host)) return 'env-production'
    // if (host === "internetarchive.github.io") return 'env-staging'
    // if (host === "localhost:3300") return 'env-local'
    // return "env-other"
}

const getMethod = (qParams, targetEnvironment) => {
    const keyDefaultMethod = UrlStatusCheckMethods.WAYBACK.key

    if (targetEnvironment === IareEnvironments.PROD) return keyDefaultMethod
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

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
const queryParameters = new URLSearchParams(window.location.search)
const env = getEnvironment();  // return an Environment structure
const myDebug = queryParameters.has("debug") ? queryParameters.get("debug").toLowerCase() === 'true' : false;
const myPath = queryParameters.has("url") ? queryParameters.get("url") : '';
const myRefresh = queryParameters.has("refresh") ? queryParameters.get("refresh").toLowerCase() === 'true' : false;
const myIariSourceId = getIariSource(queryParameters, env);
const myMethod = getMethod(queryParameters, env);

root.render(<App env={env}
                 myPath={myPath}
                 myRefresh={myRefresh}
                 myMethod={myMethod}
                 myIariSourceId={myIariSourceId}
                 myDebug={myDebug}
/>);

