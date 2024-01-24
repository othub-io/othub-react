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
  const [network, setNetwork] = useState("DKG Mainnet");

  useEffect(() => {
    async function fetchData() {
      try {
          const settings = {
            network: network,
            blockchain: blockchain,
            order_by: "nodeId"
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

  return (
    <div className="main">
      <div className="header">
        <NetworkDrop network={setNetwork} blockchain={setBlockchain} />
      </div>
      {data ? (
        <div className="node-list-container">
          {data.map((blockchain) => (
            <div className={`node-list-id${blockchain.blockchain_id}`}>
              <div className={`node-list-header-${blockchain.blockchain_id}`}>
              <img
                src={`${ext}://${process.env.REACT_APP_RUNTIME_HOST}/images?src=id${blockchain.blockchain_id}-logo.png`}
                alt={blockchain.chain_name}
                width="150"
                height={blockchain.blockchain_id === 100 ? ("15") : blockchain.blockchain_id === 2043 ? ("30") : ("50")}
                ></img>{blockchain.blockchain_id === 2043 ? (<span><b>euroWeb Mainnet</b></span>) : blockchain.blockchain_id === 20430 ? (<span><b>euroWeb Testnet</b></span>) : blockchain.blockchain_id === 10200 ? (<span><b>Chiado Testnet</b></span>) : ("")}<br></br>
                <div className="node-id-header">ID</div>
                <div className="network-header">Network Id</div>
                <div className="token-name-header">Name</div>
                <div className="token-sym-header">Sym</div>
                <div className="stake-header">Stake</div>
              </div>
              <div className="node-list">
                {blockchain.nodes.map((node) => (
                  <div key={node.nodeId}>
                    <div className={`node-id-record`}>{node.nodeId}</div>
                    <div className={`network-record`}>{node.networkId.substring(0,14)+'...'}</div>
                    <div className={`token-name-record`}>{node.tokenName.substring(0,7)}</div>
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
