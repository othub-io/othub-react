import React, { useState } from 'react'
import '../css/SideBar.css'

function SideBar () {
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      title: 'Assets',
      path: '/assets',
      icon: 'https://img.icons8.com/ios/50/000000/safe.png',
      isOpen: true
    },
    {
      id: 2,
      title: 'Nodes',
      path: '/nodes',
      icon: 'https://img.icons8.com/ios/50/000000/server.png',
      isOpen: true
    },
    {
      id: 3,
      title: 'My Nodes',
      icon: 'https://img.icons8.com/ios/50/000000/star.png',
      isOpen: true,
      submenu: [
        { id: 4, path: '/mynodes/dashboard', title: 'Dashboard' },
        { id: 5, path: '/mynodes/settings', title: 'Settings' }
      ]
    },
    {
      id: 10,
      title: 'Charts',
      path: '/charts',
      icon: 'https://img.icons8.com/ios/50/000000/line-chart.png',
      isOpen: true
    },
    {
      id: 14,
      title: 'DKG Tools',
      icon: 'https://img.icons8.com/ios/50/000000/settings.png',
      isOpen: true,
      submenu: [
        { id: 15, path: '/dkgtools/get', title: 'Get' },
        { id: 16, path: '/dkgtools/publish', title: 'Publish' },
        { id: 17, path: '/dkgtools/update', title: 'Update' }
      ]
    },
    {
      id: 6,
      title: 'Vote',
      icon: 'https://img.icons8.com/ios/50/000000/ballot.png',
      isOpen: true,
      submenu: [
        { id: 9, path: '/vote', title: 'Vote' }
      ]
    },
    {
      id: 18,
      title: 'Guides',
      icon: 'https://img.icons8.com/ios/50/000000/map.png',
      isOpen: true,
      submenu: [
        { id: 19, path: '/guides/walletMapping', title: 'Wallet Mapping' },
        { id: 20, path: '/guides/nodeInstall', title: 'Node Install' }
      ]
    },
    {
      id: 21,
      title: 'othub API',
      icon: 'https://img.icons8.com/ios/50/000000/api.png',
      isOpen: true,
      submenu: [
        { id: 19, path: '/api/keys', title: 'API Keys' },
        {
          id: 20,
          path: 'https://www.postman.com/crimson-crescent-721757/workspace/othub-api',
          title: 'Docs'
        }
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
            <a href={item.path} className='icon' src={item.icon} alt={item.title}>
              <img className='icon' src={item.icon} alt={item.title} />
            </a>
            <div className='title'>
            <a href={item.path} className='title'>{item.title}</a>
            </div>
            {item.isOpen && item.submenu && (
              <ul className='sub-menu'>
                {item.submenu.map(subitem => (
                  <li key={subitem.id}>
                    <a href={subitem.path} className='sub-title'>
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
