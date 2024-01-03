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

  useEffect(() => {
    async function fetchData() {
      try {
        const dater = {
          network: network,
          blockchain: blockchain,
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
  }, [network]);

  return (
    <div className="main">
      <div className="header">
        <NetworkDrop network={setNetwork} blockchain={setBlockchain} />
      </div>
      {data ? (
        <div>
          {data.map((blockchain) => (
            <div className={`node-list-id${blockchain.blockchain_id}`}>
              {blockchain.nodes.map((node) => (
                <div key={node.nodeId}>
                  <div className={``}>
                    {node.nodeId}
                  </div>
                  <div className={``}>
                    {node.networkId}
                  </div>
                  <div className={``}>
                    {node.tokenName}
                  </div>
                  <div className={``}>
                    {node.tokenSymbol}
                  </div>
                  <div className={``}>
                    {Number(node.nodeStake).toFixed(2)}
                  </div>
                  <br />
                </div>
              ))}
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
