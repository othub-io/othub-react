import React, { useState, useEffect } from "react";
import "../../css/nodes.css";
import Loading from "../effects/Loading";
import axios from "axios";
import NetworkDrop from "../navigation/networkDrop";
import SelectedNode from "./SelectedNode";
let ext;

ext = "http";
if (process.env.REACT_APP_RUNTIME_HTTPS === "true") {
  ext = "https";
}

const Nodes = () => {
  const [data, setData] = useState("");
  const isMobile = window.matchMedia("(max-width: 480px)").matches;
  const [blockchain, setBlockchain] = useState("");
  const [network, setNetwork] = useState("DKG Mainnet");
  const [selectedNode, setSelectedNode] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const settings = {
          network: network,
          blockchain: blockchain,
          order_by: "nodeId",
        };
        const response = await axios.post(
          `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/nodes`,
          settings
        );

        setData(response.data.nodes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setData("");
    fetchData();
  }, [network, blockchain]);

  const closeNode = () => {
    setSelectedNode(null);
  };

  if (selectedNode) {
    return (
      <div className="popup-overlay">
        <div className="node-page-popup-content">
          <button
            className="app-settings-close-button"
            onClick={closeNode}
          >
            X
          </button>
          <SelectedNode data={[{nodeId: selectedNode.nodeId, blockchain_name: selectedNode.blockchain_name, blockchain_id: selectedNode.blockchain_id, node_name: selectedNode.node_name}]}  />
        </div>
      </div>
    );
  }

  return (
    <div className="main">
      <div className="header">
        <NetworkDrop network={setNetwork} blockchain={setBlockchain} />
      </div>
      {data ? (
        <div className="node-list-container">
          <button className="node-id-header">ID</button>
          <button className="network-header">Network Id</button>
          <button className="token-name-header">Name</button>
          <button className="token-sym-header">Symbol</button>
          <button className="stake-header">Stake</button>
          <button className="age-header">Age</button>
          <button className="ask-header">Ask</button>
          <button className="fee-header">Fee</button>
          <div className="node-list">
            {data.map((node) => (
              <button className={`node-list-id${node.chainId}`} onClick={() => setSelectedNode({nodeId: node.nodeId, blockchain_name: node.chainName, blockchain_id: node.chainId, node_name: node.tokenName})}>
                <img
                src={`${ext}://${process.env.REACT_APP_RUNTIME_HOST}/images?src=id${node.chainId}-logo.png`}
                alt={node.chainName}
                ></img>
                <div className={`node-id-record`}>{node.nodeId}</div>
                <div className={`network-record`}>
                  {node.networkId.substring(0, 30) + "..."}
                </div>
                <div className={`token-name-record`}>
                  {node.tokenName.substring(0, 25)}
                </div>
                <div className={`token-sym-record`}>
                  {node.tokenSymbol.substring(0, 25)}
                </div>
                <div className={`stake-record`}>
                  {Number(node.nodeStake).toFixed(0)}
                </div>
                <div className={`age-record`}>
                  {`${Number(node.nodeAgeDays)} days`}
                </div>
                <div className={`ask-record`}>
                  {Number(node.nodeAsk).toFixed(5)}
                </div>
                <div className={`fee-record`}>
                  {/* {Number(node.nodeFee)} */}
                </div>
              </button>
            ))}
          </div>
          {isMobile && <div className="spacer"></div>}
        </div>
      ) : (
        <div className="main">
          {/* <div className="header">
            <NetworkDrop network={setNetwork} blockchain={setBlockchain} />
          </div> */}
          <Loading />
        </div>
      )}
    </div>
  );
};

export default Nodes;
