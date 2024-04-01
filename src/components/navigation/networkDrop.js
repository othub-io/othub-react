import React, { useState, useEffect } from "react";
import axios from "axios";

const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};

const NetworkDrop = ({ network, blockchain }) => {
  const [blockchains, setBlockchains] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        localStorage.removeItem("blockchain", "");

        const data = {
          network: "DKG Mainnet",
        };

        const response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/othub/blockchains`,
          data,
          config
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
    const data = {
      network: "DKG Mainnet",
    };

    const response = await axios.post(
      `${process.env.REACT_APP_API_HOST}/othub/blockchains`,
      data,
      config
    );

    blockchain("");
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
              All Blockchains
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
