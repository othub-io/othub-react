import React, { useState, useEffect  } from "react";
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
import axios from "axios";

const config = {
  headers: {
    Authorization: localStorage.getItem("token"),
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};

//REACT_APP_SUPPORTED_NETWORKS
const Charts = () => {
  const [blockchain, setBlockchain] = useState("");
  const [network, setNetwork] = useState("DKG Mainnet");
  const [assetData, setAssetData] = useState("");
  const [earningData, setEarningData] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        let data = {
          timeframe: "1000",
          frequency: "monthly",
          network: network,
          blockchain: blockchain,
          grouped: "yes"
        };

        let asset_response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/pubs/stats`,
          data, 
          config
        );

        let earn_response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/nodes/stats`,
          data, 
          config
        );

        setAssetData(asset_response.data.result);
        setEarningData(earn_response.data.result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setAssetData("");
    setEarningData("")
    fetchData();
  }, [blockchain, network]);

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
            <AssetsMinted data={[{network: network, blockchain: blockchain, assetData: assetData}]} />
          </div>
          <div className="chart-container">
            <TracSpent data={[{network: network, blockchain: blockchain, assetData: assetData}]} />
          </div>
          <div className="chart-container">
            <Earnings data={[{network: network, blockchain: blockchain, earningData: earningData}]} />
          </div>
          <div className="chart-container">
            <Payouts data={[{network: network, blockchain: blockchain, earningData: earningData}]} />
          </div>
          <div className="chart-container">
            <AssetSize data={[{network: network, blockchain: blockchain, assetData: assetData}]} />
          </div>
          <div className="chart-container">
            <AssetCost data={[{network: network, blockchain: blockchain, assetData: assetData}]} />
          </div>
          <div className="chart-container">
            <Epochs data={[{network: network, blockchain: blockchain, assetData: assetData}]} />
          </div>
          <div className="chart-container">
            <NodeStake data={[{network: network, blockchain: blockchain, earningData: earningData}]} />
          </div>
          <div className="spacer">
            
          </div>
        </div>
      </div>
    )
  );
};

export default Charts;
