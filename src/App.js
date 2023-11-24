import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AccountProvider } from "./AccountContext";
import NavBar from "./navigation/NavBar";
import SideBar from "./navigation/SideBar";
import Home from "./pages/home";
import Assets from "./pages/assets";
import Publish from "./pages/publish.js";
//import Staking from "./pages/my-othub/staking.js";
import Analytics from "./pages/analytics.js";
import NodeDashboard from "./pages/my-othub/node-dashboard.js";
import Build from "./pages/my-othub/build.js";
import Portal from "./pages/my-othub/portal";
import Inventory from "./pages/my-othub/inventory";
import Nodes from "./pages/nodes";
import Footer from "./navigation/Footer";

import NotFound from "./pages/notFound";

function App() {
  return (
    <Router>
      <AccountProvider>
        <NavBar />
        <SideBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/publish-dev" element={<Publish />} />
          <Route path="/my-othub/node-dashboard" element={<NodeDashboard />} />
          <Route path="/my-othub/build" element={<Build />} />
          <Route path="/my-othub/portal" element={<Portal />} />
          <Route path="/my-othub/inventory" element={<Inventory />} />
          {/* <Route path="/staking-dev" element={<Staking />} /> */}
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
