// src/AppRouter.js
import React from 'react';
// import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Home from '../pages/Home';
import DataGrid from '../pages/DataGrid/DataGrid';
import CommandTest from '../pages/CommandTest/CommandTest';
import Layout from "../layouts/Layout";
import TestLinks from "../pages/TestLinks/TestLinks";
import TarbInsights from "../pages/Tarb/TarbInsights";
import WebRx from "../pages/WebRx/WebRx";
import Wiki from "../pages/Wiki/Wiki";
import TestArchives from "../pages/TestArchives/TestArchives";
import CitationData from "../pages/CitationsData/CitationData";

const  AppRouter = () => {

    console.log("rendering AppRouter.js")

    // TODO use onAction/handleAction here, and send to components???
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="/cd" element={<CitationData />} />
                    <Route path="/webrx" element={<WebRx />} />
                    <Route path="/wiki" element={<Wiki />} />
                    <Route path="/tarb" element={<TarbInsights />} />
                    <Route path="/archives" element={<TestArchives />} />
                    <Route path="/grid" element={<DataGrid />} />
                    <Route path="/command" element={<CommandTest/>}/>
                    <Route path="/links" element={<TestLinks/>}/>
                </Route>
            </Routes>
        </Router>
    );
};

export default AppRouter;