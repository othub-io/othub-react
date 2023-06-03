import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { AccountProvider } from './AccountContext'
import NavBar from './navigation/NavBar'
import SideBar from './navigation/SideBar'
import Footer from './navigation/Footer'
import Home from './pages/home'
import NodeSettings from './pages/settings.js'
import NotFound from './pages/notFound'

function App () {
  return (
    <Router>
      <AccountProvider>
        <NavBar />
        <SideBar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/settings' element={<NodeSettings />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
        <Footer />
      </AccountProvider>
    </Router>
  )
}

export default App
