// src/AppRouter.js
import React from 'react';
// import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Home from './components/pages/Home';
import Grid from './components/pages/Grid';
import CommandTest from './components/pages/CommandTest';
import Layout from "./Layout";
import LinkTester from "./components/pages/LinkTester";
import TarbInsights from "./components/pages/TarbInsights";
import WebRx from "./components/pages/WebRx";
import Archives from "./components/pages/Archives";
import CitationsDatabase from "./components/pages/CitationsDatabase";

const  AppRouter = () => {

    console.log("rendering AppRouter.js")

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="/cd" element={<CitationsDatabase />} />
                    <Route path="/webrx" element={<WebRx />} />
                    <Route path="/tarb" element={<TarbInsights />} />
                    <Route path="/archives" element={<Archives />} />
                    <Route path="/grid" element={<Grid />} />
                    <Route path="/command" element={<CommandTest/>}/>
                    <Route path="/links" element={<LinkTester/>}/>
                </Route>
            </Routes>
        </Router>
    );
};

export default AppRouter;