import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../css/home.css";
import "../../../css/main.css";
import "../../../css/nodeDashboard.css";
import ActivityFeed from "./activityFeed";
import Stats from "./stats";
import NetworkDrop from "../../navigation/networkDrop";
import NodeSettings from "./NodeSettings";
import CumRewards from "./charts/cumRewards";
import PubsCommited from "./charts/pubsCommited";
import Rewards from "./charts/rewards";
import CumPubsCommited from "./charts/cumPubsCommited";
import EstimatedEarnings from "./charts/estimatedEarnings";
import NodeStake from "./charts/nodeStake";

const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};

const NodeDashboard = () => {
  const [blockchain, setBlockchain] = useState("");
  const [network, setNetwork] = useState("");
  const [isNodeSettingsOpen, setIsNodeSettingsOpen] = useState(false);
  const account = localStorage.getItem("account");
  const [nodeList, setNodeList] = useState("");
  const [nodeStats, setNodeStats] = useState("");
  const [nodeStats24h, setNodeStats24h] = useState("");
  const [nodeStatsLatest, setNodeStatsLatest] = useState("");
  const [nodeFilter, setNodeFilter] = useState("");
  const [nodeSelected, setNodeSelected] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        if (account && network) {
          setNodeFilter("");
          let data = {
            owner: account,
            network: network,
            blockchain: blockchain,
          };

          let response = await axios.post(
            `${process.env.REACT_APP_API_HOST}/nodes/info`,
            data,
            config
          );

          setNodeFilter(response.data.result);
          setNodeList(response.data.result);

          let node_stats = [];
          let node_stats_24h = [];
          let node_stats_latest = [];
          for (const node of response.data.result) {
            data = {
              frequency: "monthly",
              nodeId: node.nodeId,
              blockchain: node.chainName,
            };
            response = await axios.post(
              `${process.env.REACT_APP_API_HOST}/nodes/stats`,
              data,
              config
            );
            node_stats.push(response.data.result[0]);

            data = {
              frequency: "last24h",
              nodeId: node.nodeId,
              blockchain: node.chainName,
            };
            response = await axios.post(
              `${process.env.REACT_APP_API_HOST}/nodes/stats`,
              data,
              config
            );
            node_stats_24h.push(response.data.result[0]);

            data = {
              frequency: "latest",
              nodeId: node.nodeId,
              blockchain: node.chainName,
            };
            response = await axios.post(
              `${process.env.REACT_APP_API_HOST}/nodes/stats`,
              data,
              config
            );
            node_stats_latest.push(response.data.result[0]);
          }

          setNodeStats(node_stats);
          setNodeStats24h(node_stats_24h);
          setNodeStatsLatest(node_stats_latest);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [account, blockchain, network, nodeSelected]);

  const openNodeSettings = () => {
    setIsNodeSettingsOpen(true);
  };

  const closeNodeSettings = () => {
    setIsNodeSettingsOpen(false);
  };

  const ndfltr = async (node_selection) => {
    if (node_selection === "a") {
      setNodeFilter(nodeList);
      node_selection = nodeList;
      setNodeSelected(false);
    } else {
      setNodeFilter(node_selection);
      setNodeSelected(true);
    }

    let data = {
      owner: account,
      network: network,
      blockchain: blockchain,
      nodeId: node_selection.nodeId,
    };

    let response = await axios.post(
      `${process.env.REACT_APP_API_HOST}/nodes/info`,
      data,
      config
    );

    setNodeFilter(response.data.result);
    setNodeList(response.data.result);

    let node_stats = [];
    let node_stats_24h = [];
    let node_stats_latest = [];
    for (const node of response.data.result) {
      data = {
        frequency: "monthly",
        nodeId: node.nodeId,
        blockchain: node.chainName,
      };
      response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/nodes/stats`,
        data,
        config
      );
      node_stats.push(response.data.result[0]);

      data = {
        frequency: "last24h",
        nodeId: node.nodeId,
        blockchain: node.chainName,
      };
      response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/nodes/stats`,
        data,
        config
      );
      node_stats_24h.push(response.data.result[0]);

      data = {
        frequency: "latest",
        nodeId: node.nodeId,
        blockchain: node.chainName,
      };
      response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/nodes/stats`,
        data,
        config
      );
      node_stats_latest.push(response.data.result[0]);
    }

    setNodeStats(node_stats);
    setNodeStats24h(node_stats_24h);
    setNodeStatsLatest(node_stats_latest);
  };

  if (isNodeSettingsOpen) {
    return (
      <div className="popup-overlay">
        <div className="node-settings-popup-content">
          <button
            className="app-settings-close-button"
            onClick={closeNodeSettings}
          >
            X
          </button>
          <NodeSettings data={nodeFilter} />
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="keys">
        <header className="keys-header">
          Please connect your management wallet to view your nodes.
        </header>
      </div>
    );
  }

  return (
    <div className="main">
      <div className="header">
        <NetworkDrop network={setNetwork} blockchain={setBlockchain} />
        <div className="header-seg2">
          <div className="home-network-drop-down">
            {nodeList.length !== 0 && (
              <select onChange={(e) => ndfltr(JSON.parse(e.target.value))}>
                <option key={"none"} value={JSON.stringify("a")}>
                  Node Selection
                </option>
                {nodeList.map((node) => (
                  <option key={node.nodeId} value={JSON.stringify([node])}>
                    {node.tokenName}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="notification-button">
            <button type="submit" onClick={openNodeSettings}>
              <strong>Notifications</strong>
            </button>
          </div>
        </div>
      </div>
      {network && nodeFilter ? (
        <div>
          <ActivityFeed
            data={[
              {
                network: network,
                blockchain: blockchain,
                nodes: nodeFilter,
              },
            ]}
          />

          <Stats
            data={[
              {
                network: network,
                blockchain: blockchain,
                nodes: nodeFilter,
                nodeSelected: nodeSelected,
                nodeStats: nodeStats,
                nodeStats24h: nodeStats24h,
                nodeStatsLatest: nodeStatsLatest,
              },
            ]}
          />
          <div className="node-dashboard-charts-body">
            <div className="chart-container">
              <Rewards
                data={[
                  {
                    network: network,
                    blockchain: blockchain,
                    nodes: nodeFilter,
                    nodeSelected: nodeSelected,
                    account: account,
                    nodeStats: nodeStats,
                  },
                ]}
              />
            </div>
            <div className="chart-container">
              <PubsCommited
                data={[
                  {
                    network: network,
                    blockchain: blockchain,
                    nodes: nodeFilter,
                    nodeSelected: nodeSelected,
                    account: account,
                    nodeStats: nodeStats,
                  },
                ]}
              />
            </div>
            <div className="chart-container">
              <CumRewards
                data={[
                  {
                    network: network,
                    blockchain: blockchain,
                    nodes: nodeFilter,
                    nodeSelected: nodeSelected,
                    account: account,
                    nodeStats: nodeStats,
                  },
                ]}
              />
            </div>
            <div className="chart-container">
              <CumPubsCommited
                data={[
                  {
                    network: network,
                    blockchain: blockchain,
                    nodes: nodeFilter,
                    nodeSelected: nodeSelected,
                    account: account,
                    nodeStats: nodeStats,
                  },
                ]}
              />
            </div>
            <div className="chart-container">
              <EstimatedEarnings
                data={[
                  {
                    network: network,
                    blockchain: blockchain,
                    nodes: nodeFilter,
                    nodeSelected: nodeSelected,
                    account: account,
                    nodeStats: nodeStats,
                  },
                ]}
              />
            </div>
            <div className="chart-container">
              <NodeStake
                data={[
                  {
                    network: network,
                    blockchain: blockchain,
                    nodes: nodeFilter,
                    nodeSelected: nodeSelected,
                    account: account,
                    nodeStats: nodeStats,
                  },
                ]}
              />
            </div>
            <div className="spacer"></div>
          </div>
        </div>
      ) : (
        <div className="main">
          <div className="header">
            <NetworkDrop network={setNetwork} blockchain={setBlockchain} />
          </div>
        </div>
      )}
    </div>
  );
};

export default NodeDashboard;
