import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../css/nodeDashboard.css";
import Loading from "../../Loading";
import EstimatedEarnings from "../dashboard/estimatedEarnings";
import PubsCommited from "../dashboard/pubsCommited";
import Rewards from "../dashboard/rewards";
import CumPubsCommited from "../dashboard/cumPubsCommited";
import CumRewards from "../dashboard/cumRewards";
import TotalEarnings from "../dashboard/totalEarnings";
import TotalPubsCommited from "../dashboard/totalPubsCommited";
import TotalRewards from "../dashboard/totalRewards";
import TotalStake from "../dashboard/totalStake";
import TotalDelegations from "../dashboard/totalDelegations";
import Delegations from "../dashboard/delegations";
import NodeCommits from "../dashboard/nodeCommits";
import NodeSettings from "./NodeSettings";
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

//REACT_APP_SUPPORTED_NETWORKS
const NodeDashboard = () => {
  const [isLoading, setIsLoading] = useState(false);
  const account = localStorage.getItem("account");
  const chain_id = localStorage.getItem("chain_id");
  const [nodeFilter, setNodeFilter] = useState("");
  const [isNodeSettingsOpen, setIsNodeSettingsOpen] = useState(false);
  let [nodes, setNodes] = useState("");
  let [data, setData] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        if (account && chain_id) {
          const request_data = {
            network: chain_id,
          };

          const response = await axios
            .post(
              `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/node-dashboard/nodes`,
              request_data,
              config
            )
            .then((response) => {
              // Handle the successful response here
              return response.data;
            })
            .catch((error) => {
              // Handle errors here
              console.error(error);
            });

          if (Number(response.nodes.length) !== 0) {
            nodes = response.nodes;
            let nodeIds = []
            for(let node of nodes){
              nodeIds.push(node.nodeId)
            }

            setNodeFilter(nodeIds)
            nodes.unshift({ NodeId: nodeIds, tokenName: "All" });
            setNodes(nodes);

            const time_data = {
              timeframe: "All",
              network: chain_id,
              nodeId: nodeIds,
              public_address: account,
            };
            const response1 = await axios.post(
              `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/node-dashboard/nodeStats`,
              time_data
            );
            setData(response1.data);
          }

          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [account, chain_id]);

  const openNodeSettings = () => {
    setIsNodeSettingsOpen(true);
  };

  const closeNodeSettings = () => {
    setIsNodeSettingsOpen(false);
  };

  if (!account) {
    return (
      <div className="keys">
        <header className="keys-header">
          Please connect your admin wallet to view your nodes.
        </header>
      </div>
    );
  }

  if (
    chain_id !== "Origintrail Parachain Testnet" &&
    chain_id !== "Origintrail Parachain Mainnet"
  ) {
    return (
      <div className="keys">
        <header className="keys-header">
          Connected with an unsupported chain. Please switch to Origintrail
          Parachain Testnet or Mainnet.
        </header>
      </div>
    );
  }

  if (Number(nodes.length) === 0 && !isLoading) {
    return (
      <div className="keys">
        <header className="keys-header">
          You do not have any nodes on this network.
        </header>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="assets">
        <div className="assets-header">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    data &&
    nodes &&
    account && (
      <div className="node-dashboard">
        <div className="node-dashboard-header">
          <div className="nodes-drop-down">
            <select>
              {nodes.map((node) => (
                <option
                  key={node.nodeId}
                  onClick={() => setNodeFilter([node.nodeId])}
                >
                  {node.tokenName}
                </option>
              ))}
            </select>
          </div>
          <div className="notification-button">
            <button type="submit" onClick={openNodeSettings}>
              <strong>Notifications</strong>
            </button>
          </div>
          {isNodeSettingsOpen && (<div className="popup-overlay">
        <div className="node-settings-popup-content">
          <button
            className="app-settings-close-button"
            onClick={closeNodeSettings}
          >
            X
          </button>
           <NodeSettings />
        </div>
      </div>)}
        </div>
        <div className="window">
          <div className="node-dashboard-small-container-top">
            <TotalStake
              data={[
                {
                  nodeId: nodeFilter,
                  network: chain_id,
                  public_address: account,
                  data: data
                },
              ]}
            />
          </div>
          <div className="node-dashboard-small-container-top">
            <TotalRewards
              data={[
                {
                  nodeId: nodeFilter,
                  network: chain_id,
                  public_address: account,
                  data: data
                },
              ]}
            />
          </div>
          <div className="node-dashboard-small-container-top">
            <TotalEarnings
              data={[
                {
                  nodeId: nodeFilter,
                  network: chain_id,
                  public_address: account,
                  data: data
                },
              ]}
            />
          </div>
          <div className="node-dashboard-small-container-top">
            <TotalPubsCommited
              data={[
                {
                  nodeId: nodeFilter,
                  network: chain_id,
                  public_address: account,
                  data: data
                },
              ]}
            />
          </div>
          <div className="node-dashboard-small-container-top">
            <TotalDelegations
              data={[
                {
                  nodeId: nodeFilter,
                  network: chain_id,
                  public_address: account,
                },
              ]}
            />
          </div>
          <div className="ee-chart-container">
            <EstimatedEarnings
              data={[
                {
                  nodeId: nodeFilter,
                  network: chain_id,
                  public_address: account,
                  data: data
                },
              ]}
            />
          </div>
          <div className="ee-chart-container">
            <Rewards
              data={[
                {
                  nodeId: nodeFilter,
                  network: chain_id,
                  public_address: account,
                  data: data
                },
              ]}
            />
          </div>
          <div className="ee-chart-container">
            <PubsCommited
              data={[
                {
                  nodeId: nodeFilter,
                  network: chain_id,
                  public_address: account,
                  data: data
                },
              ]}
            />
          </div>
          <div className="ee-chart-container">
            <CumRewards
              data={[
                {
                  nodeId: nodeFilter,
                  network: chain_id,
                  public_address: account,
                  data: data
                },
              ]}
            />
          </div>
          <div className="ee-chart-container">
            <CumPubsCommited
              data={[
                {
                  nodeId: nodeFilter,
                  network: chain_id,
                  public_address: account,
                  data: data
                },
              ]}
            />
          </div>
          <div className="ee-chart-container">
            <Delegations
              data={[
                {
                  nodeId: nodeFilter,
                  network: chain_id,
                  public_address: account,
                },
              ]}
            />
          </div>
          <div className="node-dashboard-large-container-long">
            <NodeCommits
              data={[
                {
                  nodeId: nodeFilter,
                  network: chain_id,
                  public_address: account,
                },
              ]}
            />
          </div>
        </div>
      </div>
    )
  );
};

export default NodeDashboard;
