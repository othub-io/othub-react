import React, {useState} from "react";
import "../css/charts.css";
import AssetsMinted from "../charts/assetsMinted";
import TracSpent from "../charts/tracSpent";
import Earnings from "../charts/earnings";
import NodeStake from "../charts/nodeStake";
import Epochs from "../charts/epochs";
import AssetSize from "../charts/assetSize";
import AssetCost from "../charts/assetCost";
import Payouts from "../charts/payouts";
const networks = JSON.parse(process.env.REACT_APP_SUPPORTED_NETWORKS)
let ext;

ext = "http";
if (process.env.REACT_APP_RUNTIME_HTTPS === "true") {
  ext = "https";
}

//REACT_APP_SUPPORTED_NETWORKS
const Charts = () => {
  const isMobile = window.matchMedia("(max-width: 480px)").matches;
  const [network, setNetwork] = useState("Origintrail Parachain Mainnet");

  return (network &&
    <div className="charts">
      <header className="charts-header">
        <div className="network-drop-down">
          <select>
            {networks.map((network) => (
              <option key={network.name} onClick={()=> setNetwork(network.name)}>{network.name}</option>
            ))}
          </select>
        </div>
        <div className="chart-container">
          <AssetsMinted data={network}/>
        </div>
        <div className="chart-container">
          <TracSpent data={network}/>
        </div>
        <div className="chart-container">
          <Earnings data={network}/>
        </div>
        <div className="chart-container">
          <Payouts data={network}/>
        </div>
        <div className="chart-container">
          <AssetSize data={network}/>
        </div>
        <div className="chart-container">
          <AssetCost data={network}/>
        </div>
        <div className="chart-container">
          <Epochs data={network}/>
        </div>
        <div className="chart-container">
          <NodeStake data={network}/>
        </div>
      </header>
    </div>
  );
};

export default Charts;
