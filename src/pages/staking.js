import React, { useState, useEffect } from "react";
import axios from "axios";
import "../css/staking.css";
import Loading from "../Loading";
import CumPubsCommited from ".//dashboard/cumPubsCommited";
import CumRewards from ".//dashboard/cumRewards";
import EstimatedEarnings from ".//dashboard/estimatedEarnings";
import PubsCommited from ".//dashboard/pubsCommited";
import Rewards from ".//dashboard/rewards";
import TotalEarnings from ".//dashboard/totalEarnings";
import TotalPubsCommited from ".//dashboard/totalPubsCommited";
import TotalRewards from ".//dashboard/totalRewards";
import TotalStake from ".//dashboard/totalStake";
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
const Staking = () => {
  const [isLoading, setIsLoading] = useState(false);
  const account = localStorage.getItem("account");
  const chain_id = localStorage.getItem("chain_id");
  const [nodeFilter, setNodeFilter] = useState("All");
  let [nodes, setNodes] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        if (account) {
          const request_data = {
            network: chain_id,
          };

          const response = await axios
            .post(
              `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/staking/nodes`,
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
            nodes.unshift({ NodeId: "0", tokenName: "All" });
            setNodes(nodes);
          }
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [account,chain_id]);

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
    nodes && account && (
      <div className="staking-dashboard">
        <div className="staking-dashboard-header">
          <div className="nodes-drop-down">
            <select>
              {nodes.map((node) => (
                <option
                  key={node.nodeId}
                  onClick={() => setNodeFilter(node.nodeId)}
                >
                  {node.tokenName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="window">
          <div className="staking-dashboard-small-container-top"><TotalRewards data={[{nodeId : nodeFilter,network: chain_id,public_address : account}]} /></div>
          <div className="staking-dashboard-small-container-top"><TotalStake data={[{nodeId : nodeFilter,network: chain_id,public_address : account}]}/></div>
          <div className="staking-dashboard-medium-container-top"><PubsCommited data={[{nodeId : nodeFilter,network: chain_id,public_address : account}]}/></div>
          <div className="staking-dashboard-medium-container-top"><CumPubsCommited data={[{nodeId : nodeFilter,network: chain_id,public_address : account}]}/></div>
          <div className="staking-dashboard-small-container-top"><TotalPubsCommited data={[{nodeId : nodeFilter,network: chain_id,public_address : account}]}/></div>
          <div className="staking-dashboard-small-container-top"><TotalEarnings data={[{nodeId : nodeFilter,network: chain_id,public_address : account}]}/></div>
          <div className="staking-dashboard-large-container-tall"><EstimatedEarnings data={[{nodeId : nodeFilter,network: chain_id,public_address : account}]}/></div>
          <div className="staking-dashboard-large-container-top"><Rewards data={[{nodeId : nodeFilter,network: chain_id,public_address : account}]}/></div>
          <div className="staking-dashboard-large-container-top"><CumRewards data={[{nodeId : nodeFilter,network: chain_id,public_address : account}]}/></div>
        </div>
          {/* <div className="chart-container">
            <NodePubs data={[nodeFilter, chain_id, account]} />
          </div>
          <div className="chart-container">
            <NodeEarnings data={[nodeFilter, chain_id, account]} />
          </div> */}
          {/* <div className="chart-container">
            <NodeRewards data={[{nodeId : nodeFilter,network: chain_id,public_address : account}]} />
          </div> */}
      </div>
    )
  );
};

export default Staking;
