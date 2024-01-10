import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
let ext;

ext = "http";
if (process.env.REACT_APP_RUNTIME_HTTPS === "true") {
  ext = "https";
}

const NetworkDrop = ({ network, blockchain }) => {
  const [blockchains, setBlockchains] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        localStorage.removeItem("blockchain", "");

        const request_data = {
          network: "DKG Mainnet",
        };

        const response = await axios.post(
          `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/blockchains`,
          request_data
        );

        setBlockchains(response.data.blockchains);
        network("DKG Mainnet");
        localStorage.setItem("network", "DKG Mainnet");
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  const handleNetworkChange = async (input) => {
    network(input);
    localStorage.setItem("network", input);
    const request_data = {
      network: input,
    };

    const response = await axios.post(
      `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/blockchains`,
      request_data
    );

    setBlockchains(response.data.blockchains);
  };

  const handleBlockchainChange = async (input) => {
    localStorage.setItem("blockchain", input);
    blockchain(input);
  };

  return (
    <div className="header-seg1">
      <div className="home-network-drop-down">
        <select onChange={(e) => handleNetworkChange(e.target.value)}>
          <option key={"DKG Mainnet"} value={"DKG Mainnet"}>
            DKG Mainnet
          </option>
          <option key={"DKG Testnet"} value={"DKG Testnet"}>
            DKG Testnet
          </option>
        </select>
      </div>
      {blockchains && (
        <div className="home-network-drop-down">
          <select
            onChange={(e) => handleBlockchainChange(e.target.value)}
            value={localStorage.getItem("blockchain")}
          >
            <option key={"none"} value={""}>
              Blockchain Selection
            </option>
            {blockchains.map((blockchain) => (
              <option key={blockchain.chain_id} value={blockchain.chain_name}>
                {blockchain.chain_name}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
};

export default NetworkDrop;
