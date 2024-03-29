import React, { useState } from "react";
import "../../css/navigation/SideBar.css";

function SideBar() {
  const [menuItems, setMenuItems] = useState([
    {
      id: 1,
      title: "Assets",
      path: "/assets",
      icon: "https://img.icons8.com/ios/50/000000/nft.png",
      isOpen: true,
    },
    {
      id: 2,
      title: "Publish",
      path: "/publish",
      icon: "https://img.icons8.com/ios/50/000000/certificate.png",
      isOpen: true,
    },
    {
      id: 3,
      title: "Analytics",
      path: "/analytics",
      icon: "https://img.icons8.com/ios/50/000000/line-chart.png",
      isOpen: true,
    },
    {
      id: 4,
      title: "My OTHub",
      icon: "https://img.icons8.com/ios/50/000000/star.png",
      isOpen: true,
      submenu: [
        {
          id: 41,
          path: "/my-othub/node-dashboard",
          title: "Node Dashboard",
          icon: "https://img.icons8.com/ios/50/000000/dashboard.png",
        },
        {
          id: 42,
          path: "/my-othub/build",
          title: "Build",
          icon: "https://img.icons8.com/ios/50/000000/block.png",
        },
        {
          id: 43,
          path: "/my-othub/portal",
          title: "Portal",
          icon: "https://img.icons8.com/ios/50/000000/portal.png",
        },
        {
          id: 44,
          path: "/my-othub/inventory",
          title: "Inventory",
          icon: "https://img.icons8.com/ios/50/000000/backpack.png",
        },
      ],
    },
    {
      id: 5,
      title: "Nodes",
      path: "/nodes",
      icon: "https://img.icons8.com/ios/50/000000/network.png",
      isOpen: true,
    },
    {
      id: 6,
      title: "Staking",
      icon: "https://img.icons8.com/ios/50/000000/steak.png",
      isOpen: true,
      submenu: [
        {
          id: 61,
          path: "/staking/dashboard",
          title: "Dashboard",
          icon: "https://img.icons8.com/ios/50/000000/dashboard.png",
          isOpen: true,
        },
        {
          id: 62,
          path: "/staking/official-nodes",
          title: "Official Nodes",
          icon: "https://img.icons8.com/ios/50/000000/trophy.png",
          isOpen: true,
        }
      ],
    },
    {
      id: 7,
      path: "https://deepdive.othub.io",
      title: "Deepdive",
      icon: "https://img.icons8.com/ios/50/000000/submarine.png",
      isOpen: true,
    },
    {
      id: 8,
      title: "API Docs",
      icon: "https://img.icons8.com/ios/50/000000/api.png",
      isOpen: true,
      submenu: [
        {
          id: 9,
          path: "https://www.postman.com/crimson-crescent-721757/workspace/othub-api",
          title: "Postman",
          icon: "https://img.icons8.com/ios/50/000000/astronaut.png",
          isOpen: true,
        },
        {
          id: 10,
          path: "https://app.swaggerhub.com/apis-docs/OTHUB/othub-api/1.0.0",
          title: "SwaggerHub",
          icon: "https://img.icons8.com/ios/50/000000/swag.png",
          isOpen: true,
        }
      ],
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
                {item.id === 7 ? (
                  <a href={item.path} className="title" target="_blank" rel="noreferrer">
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
                    <a
                      href={subitem.path}
                      className="icon"
                      src={subitem.icon}
                      alt={subitem.title}
                      style={subitem.id === 10 ? ({textDecoration: "none", marginLeft: "-10px",marginRight: "20px"}): ({})}
                    >
                      {subitem.id === 10 ? (<span style ={{textDecoration: 'none', fontWeight: 'bold', fontSize: '18px',marginLeft: "-10px",marginRight: "20px", color: "#000000"}}>{`{...}`}</span>) : (<img
                        className="icon"
                        src={subitem.icon}
                        alt={subitem.title}
                      />)}
                    </a>
                    <a href={subitem.path} className="sub-title">
                    {subitem.id === 9 || subitem.id === 10 ? (
                        <a href={subitem.path} className="sub-title" target="_blank" rel="noreferrer">
                          {subitem.title}
                        </a>
                      ) : (
                        <a href={subitem.path} className="sub-title">
                          {subitem.title}
                        </a>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
      <div className="social-icons">
        <a href={`https://twitter.com/OTHub_io`} className="icon" src={`https://img.icons8.com/ios/50/000000/twitter.png`} alt={`X`}>
          <img className="icon" src={`https://img.icons8.com/ios/50/000000/twitter.png`} alt={`X`} />
        </a>
        <a href={`https://t.me/othubio`} className="icon" src={`https://img.icons8.com/ios/50/000000/telegram.png`} alt={`Telegram`}>
          <img className="icon" src={`https://img.icons8.com/ios/50/000000/telegram.png`} alt={`Telegram`} />
        </a>
        <a href={`https://discord.gg/jJMRwFHZEX`} className="icon" src={`https://img.icons8.com/ios/50/000000/discord.png`} alt={`Discord`}>
          <img className="icon" src={`https://img.icons8.com/ios/50/000000/discord.png`} alt={`Discord`} />
        </a>
      </div>
    </div>
  );
}

export default SideBar;
