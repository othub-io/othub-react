import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../css/nodeDashboard.css";
import Loading from "../../effects/Loading";
import EstimatedEarnings from "./estimatedEarnings";
import PubsCommited from "./pubsCommited";
import Rewards from "./rewards";
import CumPubsCommited from "./cumPubsCommited";
import CumRewards from "./cumRewards";
import TotalEarnings from "./totalEarnings";
import TotalPubsCommited from "./totalPubsCommited";
import TotalRewards from "./totalRewards";
import TotalStake from "./totalStake";
import TotalDelegations from "./totalDelegations";
import Delegations from "./delegations";
import NodeCommits from "./nodeCommits";
import NodeSettings from "./NodeSettings";
import NetworkDrop from "../../navigation/networkDrop";
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
  const connected_blockchain = localStorage.getItem("connected_blockchain");
  const [nodeFilter, setNodeFilter] = useState("");
  const [isNodeSettingsOpen, setIsNodeSettingsOpen] = useState(false);
  let [nodes, setNodes] = useState("");
  let [data, setData] = useState("");

  const [network, setNetwork] = useState(localStorage.getItem("network") ? (localStorage.getItem("network") ) : ("DKG Mainnet"));
  const [blockchain, setBlockchain] = useState(localStorage.getItem("blockchain") ? (localStorage.getItem("blockchain") ) : (null));

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        if (account && network) {
          const request_data = {
            network: network,
            blockchain: blockchain
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
              blockchain: connected_blockchain,
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
  }, [account, connected_blockchain]);

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
    connected_blockchain !== "Origintrail Parachain Testnet" &&
    connected_blockchain !== "Origintrail Parachain Mainnet"
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
        <NetworkDrop
              network={setNetwork}
              blockchain={setBlockchain}
            />
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
                  blockchain: connected_blockchain,
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
                  blockchain: connected_blockchain,
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
                  blockchain: connected_blockchain,
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
                  blockchain: connected_blockchain,
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
                  blockchain: connected_blockchain,
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
                  blockchain: connected_blockchain,
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
                  blockchain: connected_blockchain,
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
                  blockchain: connected_blockchain,
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
                  blockchain: connected_blockchain,
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
                  blockchain: connected_blockchain,
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
                  blockchain: connected_blockchain,
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
                  blockchain: connected_blockchain,
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
