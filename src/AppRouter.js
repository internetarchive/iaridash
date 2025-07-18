// src/AppRouter.js
import React from 'react';
// import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import Home from './pages/Home';
import DataGrid from './pages/DataGrid/DataGrid';
import CommandTest from './pages/CommandTest/CommandTest';
import Layout from "./Layout";
import LinkTester from "./pages/LinkTester/LinkTester";
import TarbInsights from "./pages/Tarb/TarbInsights";
import WebRx from "./pages/WebRx/WebRx";
import TestArchives from "./pages/TestArchives/TestArchives";
import CitationsData from "./pages/CitationsDatabase/CitationsData";

const  AppRouter = () => {

    console.log("rendering AppRouter.js")

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />} />
                    <Route path="/cd" element={<CitationsData />} />
                    <Route path="/webrx" element={<WebRx />} />
                    <Route path="/tarb" element={<TarbInsights />} />
                    <Route path="/archives" element={<TestArchives />} />
                    <Route path="/grid" element={<DataGrid />} />
                    <Route path="/command" element={<CommandTest/>}/>
                    <Route path="/links" element={<LinkTester/>}/>
                </Route>
            </Routes>
        </Router>
    );
};

export default AppRouter;