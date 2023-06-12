import React, { useState } from 'react'
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
        { id: 4, path: '/myNodes/nodeDashboard', title: 'Dashboard' },
        { id: 5, path: '/myNodes/settings', title: 'Settings' }
      ]
    },
    {
      id: 6,
      title: 'Alliance',
      icon: 'https://img.icons8.com/ios/50/000000/handshake.png',
      isOpen: true,
      submenu: [
        { id: 7, path: '/alliance/members', title: 'Members' },
        { id: 8, path: '/alliance/statistics', title: 'Statistics' },
        { id: 9, path: '/alliance/vote', title: 'Vote' }
      ]
    },
    {
      id: 10,
      title: 'Charts',
      icon: 'https://img.icons8.com/ios/50/000000/line-chart.png',
      isOpen: true
    },
    {
      id: 14,
      title: 'DKG Tools',
      icon: 'https://img.icons8.com/ios/50/000000/settings.png',
      isOpen: true,
      submenu: [
        { id: 15, path: '/dkgTools/get', title: 'Get' },
        { id: 16, path: '/dkgTools/publish', title: 'Publish' },
        { id: 17, path: '/dkgTools/update', title: 'Update' }
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
      title: 'otnode API',
      icon: 'https://img.icons8.com/ios/50/000000/api.png',
      isOpen: true,
      submenu: [
        { id: 19, path: '/api/keys', title: 'API Keys' },
        {
          id: 20,
          path: 'https://www.postman.com/crimson-crescent-721757/workspace/otnode-api/overview',
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
            <img className='icon' src={item.icon} alt={item.title} />
            <a href={item.path} className='title'>
              {item.title}
            </a>
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
