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
        { id: 4, title: 'nodeDashboard' },
        { id: 5, title: 'settings' }
      ]
    },
    {
      id: 6,
      title: 'Alliance',
      icon: 'https://img.icons8.com/ios/50/000000/handshake.png',
      isOpen: true,
      submenu: [
        { id: 7, title: 'allianceDashboard' },
        { id: 8, title: 'Members' },
        { id: 9, title: 'Vote' }
      ]
    },
    {
      id: 10,
      title: 'Reports',
      icon: 'https://img.icons8.com/ios/50/000000/line-chart.png',
      isOpen: true,
      submenu: [
        { id: 11, title: 'Assets' },
        { id: 12, title: 'Nodes' }
      ]
    },
    {
      id: 14,
      title: 'DKG Tools',
      icon: 'https://img.icons8.com/ios/50/000000/settings.png',
      isOpen: true,
      submenu: [
        { id: 15, title: 'Get' },
        { id: 16, title: 'Publish' },
        { id: 17, title: 'Update' }
      ]
    },
    {
      id: 18,
      title: 'Guides',
      icon: 'https://img.icons8.com/ios/50/000000/map.png',
      isOpen: true,
      submenu: [
        { id: 19, title: 'walletMapping' },
        { id: 20, title: 'nodeInstall' }
      ]
    },
    {
      id: 21,
      title: 'otnode API',
      icon: 'https://img.icons8.com/ios/50/000000/api.png',
      isOpen: true,
      submenu: [
        { id: 19, title: 'generateKeys' },
        { id: 20, title: 'Docs' }
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
                      {subitem.title}
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
