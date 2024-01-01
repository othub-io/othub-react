import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AccountProvider } from "./AccountContext";
import NavBar from "./components/navigation/NavBar";
import SideBar from "./components/navigation/SideBar";
import Home from "./components/home/index.js";
import Assets from "./components/assets/index.js";
import Publish from "./components/publish/index.js";
import Analytics from "./components/analytics/index.js";
import NodeDashboard from "./components/my-othub/node-dashboard/index.js";
import Build from "./components/my-othub/build/index.js";
import Portal from "./components/my-othub/portal/index.js";
import Inventory from "./components/my-othub/inventory/index.js";
import Nodes from "./components/nodes/index.js";
import Footer from "./components/navigation/Footer";

import NotFound from "./components/effects/notFound.js";

function App() {
  return (
    <Router>
      <AccountProvider>
        <NavBar />
        <SideBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/publish" element={<Publish />} />
          <Route path="/my-othub/node-dashboard" element={<NodeDashboard />} />
          <Route path="/my-othub/build" element={<Build />} />
          <Route path="/my-othub/portal" element={<Portal />} />
          <Route path="/my-othub/inventory" element={<Inventory />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/nodes" element={<Nodes />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </AccountProvider>
    </Router>
  );
}

export default App;
