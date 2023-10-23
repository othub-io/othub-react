import React, { useState } from "react";
import "../css/navigation/SideBar.css";

function SideBar() {
  const [menuItems, setMenuItems] = useState([
    {
      id: 14,
      title: "Assets",
      path: "/assets",
      icon: "https://img.icons8.com/ios/50/000000/list.png",
      isOpen: true,
    },
    {
      id: 2,
      title: "Staking",
      path: "/staking",
      icon: "https://img.icons8.com/ios/50/000000/steak.png",
      isOpen: true,
    },
    {
      id: 3,
      title: "Build",
      path: "/build",
      icon: "https://img.icons8.com/ios/50/000000/block.png",
      isOpen: true,
    },
    {
      id: 14,
      title: "Mint",
      path: "/mint",
      icon: "https://img.icons8.com/ios/50/000000/nft.png",
      isOpen: true,
    },
    {
      id: 44,
      title: "Inventory",
      path: "/inventory",
      icon: "https://img.icons8.com/ios/50/000000/backpack.png",
      isOpen: true,
    },
    {
      id: 1,
      title: "Portal",
      path: "/portal",
      icon: "https://img.icons8.com/ios/50/000000/portal.png",
      isOpen: true
    },
    {
      id: 10,
      title: "Charts",
      path: "/charts",
      icon: "https://img.icons8.com/ios/50/000000/line-chart.png",
      isOpen: true,
    },
    {
      id: 4,
      title: "Nodes",
      path: "/nodes",
      icon: "https://img.icons8.com/ios/50/000000/server.png",
      isOpen: true,
    },
    // },
    // {
    //   id: 18,
    //   title: "Guides",
    //   icon: "https://img.icons8.com/ios/50/000000/map.png",
    //   isOpen: true,
    //   submenu: [
    //     { id: 19, path: "/guides/walletMapping", title: "Wallet Mapping" },
    //     { id: 20, path: "/guides/nodeInstall", title: "Node Install" },
    //   ],
    // },
    {
      id: 5,
      path: "https://www.postman.com/crimson-crescent-721757/workspace/othub-api",
      title: "API Docs",
      icon: "https://img.icons8.com/ios/50/000000/api.png",
      isOpen: true,
    }
    // Rest of the menu items
  ]);

  const handleNodeClick = (nodeId) => {
    setMenuItems((prevItems) =>
      prevItems.map((item) =>
        item.id === nodeId ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  };

  return (
    <div className="sidebar">
      <ul>
        {menuItems.map((item) => (
          <li key={item.id} onClick={() => handleNodeClick(item.id)}>
            <a
              href={item.path}
              className="icon"
              src={item.icon}
              alt={item.title}
            >
              <img className="icon" src={item.icon} alt={item.title} />
            </a>
            <div className="title">
              <a href={item.path} className="title">
                {item.id === 5 ? (
                      <a
                        href={item.path}
                        className="title"
                        target="_blank"
                      >
                        {item.title}
                      </a>
                    ) : (
                      <a href={item.path} className="title">
                        {item.title}
                      </a>
                    )}
              </a>
            </div>
            {item.isOpen && item.submenu && (
              <ul className="sub-menu">
                {item.submenu.map((subitem) => (
                  <li key={subitem.id}>
                    {subitem.id === 20 ? (
                      <a
                        href={subitem.path}
                        className="sub-title"
                        target="_blank"
                      >
                        {subitem.title}
                      </a>
                    ) : (
                      <a href={subitem.path} className="sub-title">
                        {subitem.title}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SideBar;
