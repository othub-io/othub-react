import React, { useState, useEffect } from "react";
import "../../css/nodes.css";
import Loading from "../effects/Loading";
import axios from "axios";
import NetworkDrop from "../navigation/networkDrop";
let ext;

ext = "http";
if (process.env.REACT_APP_RUNTIME_HTTPS === "true") {
  ext = "https";
}

const Nodes = () => {
  const [data, setData] = useState("");
  const isMobile = window.matchMedia("(max-width: 480px)").matches;
  const [blockchain, setBlockchain] = useState("");
  const [network, setNetwork] = useState("");
  const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const dater = {
          network: network,
          blockchain: blockchain,
          order_by: "nodeId"
        };
        const response = await axios.post(
          `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/nodes`,
          dater
        );
        console.log(response.data.nodes);
        setData(response.data.nodes);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setData("");
    fetchData();
  }, [network, blockchain, inputValue]);

  return (
    <div className="main">
      <div className="header">
        <NetworkDrop network={setNetwork} blockchain={setBlockchain} />
      </div>
      {data ? (
        <div className="allnodes">
          {data.map((blockchain) => (
            <div className={`node-list-id${blockchain.blockchain_id}`}>
              <div className="node-list-header">
              <img
                src={`${ext}://${process.env.REACT_APP_RUNTIME_HOST}/images?src=id${blockchain.blockchain_id}-logo.png`}
                alt={blockchain.chain_name}
                width="150"
                height={blockchain.blockchain_id === 100 ? ("15") : blockchain.blockchain_id === 2043 ? ("30") : ("50")}
                ></img><br></br>
                <div className="node-id-header">Node Id</div>
                <div className="network-header">Network Id</div>
                <div className="token-name-header">Name</div>
                <div className="token-sym-header">Symbol</div>
                <div className="stake-header">Stake</div>
              </div>
              <div className="node-list">
                {blockchain.nodes.map((node) => (
                  <div key={node.nodeId}>
                    <div className={`node-id-record`}>{node.nodeId}</div>
                    <div className={`network-record`}>{node.networkId.substring(0,19)+'...'}</div>
                    <div className={`token-name-record`}>{node.tokenName.substring(0,9)}</div>
                    <div className={`token-sym-record`}>{node.tokenSymbol.substring(0,5)}</div>
                    <div className={`stake-record`}>
                      {Number(node.nodeStake).toFixed(0)}
                    </div>
                    <br />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="main">
          <div className="header">
            <NetworkDrop network={setNetwork} blockchain={setBlockchain} />
          </div>
          <Loading />
        </div>
      )}
    </div>
  );
};

export default Nodes;
