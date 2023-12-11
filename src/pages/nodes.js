import React, { useState, useEffect } from "react";
import "../css/nodes.css";
import Loading from "../Loading";
import axios from "axios";
const networks = JSON.parse(process.env.REACT_APP_SUPPORTED_NETWORKS);
let ext;

ext = "http";
if (process.env.REACT_APP_RUNTIME_HTTPS === "true") {
  ext = "https";
}

const Nodes = () => {
  const [data, setData] = useState("");
  const isMobile = window.matchMedia("(max-width: 480px)").matches;
  const [network, setNetwork] = useState("Origintrail Parachain Mainnet");

  useEffect(() => {
    async function fetchData() {
      try {
        const dater = {
          network: network,
        };
        const response = await axios.post(
          `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/nodes`,
          dater
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setData("");
    fetchData();
  }, [network]);

  return (
    <div className="allnodes">
      <div className="nodes-network-drop-down">
        <select onChange={(e) => setNetwork(e.target.value)}>
          {networks.map((network) => (
            <option key={network.name} value={network.name}>
              {network.name}
            </option>
          ))}
        </select>
      </div>
      {data ? (
        <header className="allnodes-header">
          {isMobile ? (
            <div className="allnodes-table-container">
              <table className="allnodesTable">
                <thead>
                  <tr>
                    <th>Node ID</th>
                    <th>Name</th>
                    <th>Stake</th>
                  </tr>
                </thead>
                <tbody>
                  {data.v_nodes.map((node) => (
                    <tr key={node.nodeId}>
                      <td width="10">{node.nodeId}</td>
                      <td>{node.tokenName}</td>
                      <td>{Number(node.nodeStake).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="allnodes-table-container">
              <table className="allnodesTable">
                <thead>
                  <tr>
                    <th>Node ID</th>
                    <th>Network ID</th>
                    <th>Token Name</th>
                    <th>Token Symbol</th>
                    <th>Stake</th>
                  </tr>
                </thead>
                <tbody>
                  {data.v_nodes.map((node) => (
                    <tr key={node.nodeId}>
                      <td>{node.nodeId}</td>
                      <td>{node.networkId}</td>
                      <td>{node.tokenName}</td>
                      <td>{node.tokenSymbol}</td>
                      <td>{Number(node.nodeStake).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </header>
      ) : (
        <div className="assets">
          <div className="assets-header">
            <Loading />
          </div>
        </div>
      )}
    </div>
  );
};

export default Nodes;
