import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../css/home.css";
import "../../../css/main.css";
import "../../../css/nodeDashboard.css";
import Loading from "../../effects/Loading";
import CumPubs from "../../home/cumPubs";
import ActivityFeed from "./activityFeed";
import Stats from "./stats";
import NetworkDrop from "../../navigation/networkDrop";
import NodeSettings from "./NodeSettings";
import CumRewards from "./charts/cumRewards";
import PubsCommited from "./charts/pubsCommited";
let ext;

ext = "http";
if (process.env.REACT_APP_RUNTIME_HTTPS === "true") {
  ext = "https";
}

const config = {
  headers: {
    Authorization: localStorage.getItem("token"),
  },
};

const NodeDashboard = () => {
  const [blockchain, setBlockchain] = useState("");
  const [network, setNetwork] = useState("");
  const [isNodeSettingsOpen, setIsNodeSettingsOpen] = useState(false);
  const account = localStorage.getItem("account");
  const [nodeList, setNodeList] = useState("");
  const [nodeFilter, setNodeFilter] = useState("");
  const [nodeStats, setNodeStats] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [nodeSelected, setNodeSelected] = useState(false);
  let [data, setData] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        if (account && network) {
          setNodeFilter("");
          const request_data = {
            network: network,
            blockchain: blockchain,
          };

          const response = await axios.post(
            `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/node-dashboard/nodes`,
            request_data,
            config
          );

          let nodes = [];
          let nodeIds = [];

          nodes.push({
            nodeId: 12,
            tokenName: "test2",
            blockchain_name: "Gnosis Mainnet",
            blockchain_id: "100",
          });

          for (const blockchain of response.data.nodes) {
            if (blockchain.nodes.length > 0) {
              for (let node of blockchain.nodes) {
                nodeIds.push(node.nodeId);
                node.blockchain_name = blockchain.blockchain_name;
                node.blockchain_id = blockchain.blockchain_id;
                nodes.push(node);

                nodes.push({
                  nodeId: 67,
                  tokenName: "test2",
                  blockchain_name: blockchain.blockchain_name,
                  blockchain_id: blockchain.blockchain_id,
                });
              }
            }
          }

          // Now set the state after processing the
          setNodeFilter(nodes);
          setNodeList(nodes);

          const time_data = {
            timeframe: "All",
            nodes: nodes,
          };
          const response1 = await axios.post(
            `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/node-dashboard/nodeData`,
            time_data,
            config
          );
          setData(response1.data.chart_data);

          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    }

    fetchData();
  }, [account, blockchain, network]);

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
      node_selection = node_selection;
      setNodeSelected(true);
    }

    const time_data = {
      timeframe: "All",
      nodes: node_selection,
    };
    const response1 = await axios.post(
      `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/node-dashboard/nodeData`,
      time_data,
      config
    );
    setData(response1.data);
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
          <NodeSettings />
        </div>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="keys">
        <header className="keys-header">
          Please connect your admin wallet to view your nodes.
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
              },
            ]}
          />
          <div className="home-chart">
            <CumRewards
              data={[
                {
                  network: network,
                  blockchain: blockchain,
                  nodes: nodeFilter,
                  nodeSelected: nodeSelected,
                  public_address: account,
                  node_data: data,
                },
              ]}
            />
          </div>
          <div className="home-chart">
            <PubsCommited
              data={[
                {
                  network: network,
                  blockchain: blockchain,
                  nodes: nodeFilter,
                  nodeSelected: nodeSelected,
                  public_address: account,
                  node_data: data,
                },
              ]}
            />
          </div>
          <div className="spacer">
            
          </div>
        </div>
      ) : (
        <div>
          <Loading />
        </div>
      )}
    </div>
  );
};

export default NodeDashboard;
