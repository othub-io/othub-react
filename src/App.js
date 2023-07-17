import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AccountProvider } from './AccountContext'
import NavBar from './navigation/NavBar'
import SideBar from './navigation/SideBar'
import Footer from './navigation/Footer'
import Home from './pages/home'
import Assets from './pages/assets'
import Nodes from './pages/nodes'
import Settings from './pages/mynodes/settings.js'
import NodeDashboard from './pages/mynodes/dashboard.js'
import AllianceMembers from './pages/alliance/members.js'
import AllianceVote from './pages/alliance/vote.js'
import Charts from './pages/charts'
import DKGGet from './pages/dkgtools/get.js'
import DKGPublish from './pages/dkgtools/publish.js'
import DKGUpdate from './pages/dkgtools/update.js'
import Keys from './pages/api/keys.js'
import NotFound from './pages/notFound'

function App () {
  return (
    <Router>
      <AccountProvider>
        <NavBar />
        <SideBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/assets/' element={<Assets />}/>
          <Route path='/nodes' element={<Nodes />} />
          <Route path='/mynodes/settings' element={<Settings />} />
          <Route path='/mynodes/dashboard-dev' element={<NodeDashboard />} />
          <Route path='/alliance/members-dev' element={<AllianceMembers />} />
          <Route path='/alliance/vote-dev' element={<AllianceVote />} />
          <Route path='/charts-dev' element={<Charts />} />
          <Route path='/dkgtools/get-dev' element={<DKGGet />} />
          <Route path='/dkgtools/publish-dev' element={<DKGPublish />} />
          <Route path='/dkgtools/update-dev' element={<DKGUpdate />} />
          <Route path='/api/keys' element={<Keys />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
        <Footer />
      </AccountProvider>
    </Router>
  )
}

export default App
