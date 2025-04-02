// src/AppRouter.js
import React from 'react';
// import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Home from './components/pages/Home';
import Grid from './components/pages/Grid';
import Command from './components/pages/Command';
import Layout from "./Layout";
import TestLinks from "./components/pages/TestLinks";
import TarbInsights from "./components/pages/TarbInsights";
import WebRx from "./components/pages/WebRx";
import Archives from "./components/pages/Archives";

const  AppRouter = () => {

    console.log("rendering AppRouter.js")

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="/webrx" element={<WebRx />} />
                    <Route path="/tarb" element={<TarbInsights />} />
                    <Route path="/archives" element={<Archives />} />
                    <Route path="/grid" element={<Grid />} />
                    <Route path="/command" element={<Command/>}/>
                    <Route path="/links" element={<TestLinks/>}/>
                </Route>
            </Routes>
        </Router>
    );
};

export default AppRouter;