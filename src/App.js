import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AccountProvider } from './AccountContext'
import NavBar from './navigation/NavBar'
import SideBar from './navigation/SideBar'
import Footer from './navigation/Footer'
import Home from './pages/home'
import Portal from './pages/portal/gateway'
import Assets from './pages/portal/assets'
import Nodes from './pages/nodes'
import NodeSettings from './pages/staking/settings.js'
import StakingDashboard from './pages/staking/dashboard.js'
import Vote from './pages/vote.js'
import Charts from './pages/staking/charts'
import DKGGet from './pages/dkgtools/get.js'
import DKGPublish from './pages/dkgtools/publish.js'
import DKGUpdate from './pages/dkgtools/update.js'
import BuildSettings from './pages/build/settings.js'
import NotFound from './pages/notFound'

function App () {
  return (
    <Router>
      <AccountProvider>
        <NavBar />
        <SideBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/portal/gateway' element={<Portal />}/>
          <Route path='/portal/assets' element={<Assets />}/>
          <Route path='/nodes' element={<Nodes />} />
          <Route path='/staking/settings' element={<NodeSettings />} />
          <Route path='/staking/dashboard-dev' element={<StakingDashboard />} />
          <Route path='/vote-dev' element={<Vote />} />
          <Route path='/charts-dev' element={<Charts />} />
          <Route path='/dkgtools/get-dev' element={<DKGGet />} />
          <Route path='/dkgtools/publish-dev' element={<DKGPublish />} />
          <Route path='/dkgtools/update-dev' element={<DKGUpdate />} />
          <Route path='/build/settings' element={<BuildSettings />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
        <Footer />
      </AccountProvider>
    </Router>
  )
}

export default App
