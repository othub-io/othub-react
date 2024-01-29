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
  const [sortedData, setSortedData] = useState("");
  const [sortOrder, setSortOrder] = useState('asc');
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
        setSortedData(response.data.nodes)
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

  const setSort = (sortBy) => {
    const newData = [...data];

    newData.sort((a, b) => {
      let result = 0;

      // Implement your sorting logic based on the 'sortBy' parameter
      if (a[sortBy] < b[sortBy]) {
        result = -1;
      } else if (a[sortBy] > b[sortBy]) {
        result = 1;
      }

      // Toggle the result based on the sort order
      return sortOrder === 'asc' ? result : -result;
    });

    // Update the state variables with the sorted data and toggle the sort order
    setSortedData([...newData]);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
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
      {sortedData ? (
        <div className="node-list-container">
          <button className="node-id-header" onClick={() => setSort("nodeId")}>ID<img src="https://img.icons8.com/ios/50/000000/sort.png" alt="id" height="15px"></img></button>
          <button className="token-name-header" onClick={() => setSort("tokenName")}>Name<img src="https://img.icons8.com/ios/50/000000/sort.png" alt="id" height="15px"></img></button>
          <button className="token-sym-header" onClick={() => setSort("tokenSymbol")}>Symbol<img src="https://img.icons8.com/ios/50/000000/sort.png" alt="id" height="15px"></img></button>
          <button className="stake-header" onClick={() => setSort("nodeStake")}>Stake<img src="https://img.icons8.com/ios/50/000000/sort.png" alt="id" height="15px"></img></button>
          <button className="age-header" onClick={() => setSort("nodeAgeDays")}>Age<img src="https://img.icons8.com/ios/50/000000/sort.png" alt="id" height="15px"></img></button>
          <button className="ask-header" onClick={() => setSort("nodeAsk")}>Ask<img src="https://img.icons8.com/ios/50/000000/sort.png" alt="id" height="15px"></img></button>
          {/* <button className="fee-header" onClick={() => setSort("nodeFee")}>Fee<img src="https://img.icons8.com/ios/50/000000/sort.png" alt="id" height="15px"></img></button> */}
          <div className="node-list">
            {sortedData.map((node) => (
              <button className={`node-list-id${node.chainId}`} onClick={() => setSelectedNode({nodeId: node.nodeId, blockchain_name: node.chainName, blockchain_id: node.chainId, node_name: node.tokenName})}>
                <img
                src={`${ext}://${process.env.REACT_APP_RUNTIME_HOST}/images?src=id${node.chainId}-logo.png`}
                alt={node.chainName}
                ></img>
                <div className={`node-id-record`}>{node.nodeId}</div>
                <div className={`token-name-record`}>
                  {node.tokenName.substring(0, 30)}
                </div>
                <div className={`token-sym-record`}>
                  {node.tokenSymbol.substring(0, 10)}
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
                {/* <div className={`fee-record`}>
                   {Number(node.nodeFee)} 
                </div> */}
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
