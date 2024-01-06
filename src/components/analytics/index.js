import React, { useState } from "react";
import "../../css/charts.css";
import AssetsMinted from "./charts/assetsMinted";
import TracSpent from "./charts/tracSpent";
import Earnings from "./charts/earnings";
import NodeStake from "./charts/nodeStake";
import Epochs from "./charts/epochs";
import AssetSize from "./charts/assetSize";
import AssetCost from "./charts/assetCost";
import Payouts from "./charts/payouts";
import NetworkDrop from "../navigation/networkDrop";
let ext;

ext = "http";
if (process.env.REACT_APP_RUNTIME_HTTPS === "true") {
  ext = "https";
}

//REACT_APP_SUPPORTED_NETWORKS
const Charts = () => {
  const isMobile = window.matchMedia("(max-width: 480px)").matches;
  const [blockchain, setBlockchain] = useState("");
  const [network, setNetwork] = useState("DKG Mainnet");

  return (
    network && (
      <div className="main">
        <div className="header">
            <NetworkDrop
              network={setNetwork}
              blockchain={setBlockchain}
            />
        </div>
        <div className="charts-body">
          <div className="chart-container">
            <AssetsMinted data={[{network: network, blockchain: blockchain}]} />
          </div>
          <div className="chart-container">
            <TracSpent data={[{network: network, blockchain: blockchain}]} />
          </div>
          <div className="chart-container">
            <Earnings data={[{network: network, blockchain: blockchain}]} />
          </div>
          <div className="chart-container">
            <Payouts data={[{network: network, blockchain: blockchain}]} />
          </div>
          <div className="chart-container">
            <AssetSize data={[{network: network, blockchain: blockchain}]} />
          </div>
          <div className="chart-container">
            <AssetCost data={[{network: network, blockchain: blockchain}]} />
          </div>
          <div className="chart-container">
            <Epochs data={[{network: network, blockchain: blockchain}]} />
          </div>
          {/* <div className="chart-container">
            <NodeStake data={[{network: network, blockchain: blockchain}]} />
          </div> */}
        </div>
      </div>
    )
  );
};

export default Charts;
