import React, { useState } from 'react'
import { BrowserRouter as Link } from 'react-router-dom'
import '../css/SideBar.css'

function SideBar () {
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      title: 'Assets',
      icon: 'https://img.icons8.com/ios/50/000000/safe.png',
      isOpen: true
    },
    {
      id: 2,
      title: 'Nodes',
      icon: 'https://img.icons8.com/ios/50/000000/server.png',
      isOpen: true
    },
    {
      id: 3,
      title: 'My Nodes',
      icon: 'https://img.icons8.com/ios/50/000000/star.png',
      isOpen: true,
      submenu: [
        { id: 4, title: '/myNodes/nodeDashboard', header: 'Dashboard' },
        { id: 5, title: '/myNodes/settings', header: 'Settings' }
      ]
    },
    {
      id: 6,
      title: 'Alliance',
      icon: 'https://img.icons8.com/ios/50/000000/handshake.png',
      isOpen: true,
      submenu: [
        { id: 7, title: '/alliance/members', header: 'Members' },
        { id: 8, title: '/alliance/statistics', header: 'Statistics' },
        { id: 9, title: '/alliance/vote', header: 'Vote' }
      ]
    },
    {
      id: 10,
      title: 'Reports',
      icon: 'https://img.icons8.com/ios/50/000000/line-chart.png',
      isOpen: true
    },
    {
      id: 14,
      title: 'DKG Tools',
      icon: 'https://img.icons8.com/ios/50/000000/settings.png',
      isOpen: true,
      submenu: [
        { id: 15, title: '/dkgTools/get', header: 'Get' },
        { id: 16, title: '/dkgTools/publish', header: 'Publish' },
        { id: 17, title: '/dkgTools/update', header: 'Update' }
      ]
    },
    {
      id: 18,
      title: 'Guides',
      icon: 'https://img.icons8.com/ios/50/000000/map.png',
      isOpen: true,
      submenu: [
        { id: 19, title: '/guides/walletMapping', header: 'Wallet Mapping' },
        { id: 20, title: '/guides/nodeInstall', header: 'Node Install' }
      ]
    },
    {
      id: 21,
      title: 'otnode API',
      icon: 'https://img.icons8.com/ios/50/000000/api.png',
      isOpen: true,
      submenu: [
        { id: 19, title: '/api/generateKeys', header: 'API Keys' },
        { id: 20, title: '/api/docs', header: 'Docs' }
      ]
    }
    // Rest of the menu items
  ])

  const handleNodeClick = nodeId => {
    setMenuItems(prevItems =>
      prevItems.map(item =>
        item.id === nodeId ? { ...item, isOpen: !item.isOpen } : item
      )
    )
  }

  return (
    <div className='sidebar'>
      <ul>
        {menuItems.map(item => (
          <li key={item.id} onClick={() => handleNodeClick(item.id)}>
            <img className='icon' src={item.icon} alt={item.title} />
            <span className='title'>{item.title}</span>
            {item.isOpen && item.submenu && (
              <ul className='sub-menu'>
                {item.submenu.map(subitem => (
                  <li key={subitem.id}>
                    <a href={subitem.title} className='sub-title'>
                      {subitem.header}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SideBar
