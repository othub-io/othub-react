import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AccountProvider } from "./AccountContext";
import NavBar from "./navigation/NavBar";
import SideBar from "./navigation/SideBar";
import Footer from "./navigation/Footer";
import Home from "./pages/home";
import Portal from "./pages/portal";
import Inventory from "./pages/inventory";
import Assets from "./pages/assets";
import Nodes from "./pages/nodes";
import Staking from "./pages/staking.js";
import Charts from "./pages/charts.js";
import Mint from "./pages/mint.js";
import Build from "./pages/build.js";
import NotFound from "./pages/notFound";

function App() {
  return (
    <Router>
      <AccountProvider>
        <NavBar />
        <SideBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/portal" element={<Portal />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/build" element={<Build />} />
          <Route path="/nodes" element={<Nodes />} />
          <Route path="/staking" element={<Staking />} />
          <Route path="/charts" element={<Charts />} />
          <Route path="/mint" element={<Mint />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </AccountProvider>
    </Router>
  );
}

export default App;
