import React, { useContext, useState, useEffect } from "react";
import { AccountContext } from "../../AccountContext";
import Loading from "../../Loading";
import DKG from "dkg.js";
import axios from "axios";
let ext;

ext = "http";
if (process.env.REACT_APP_RUNTIME_HTTPS === "true") {
  ext = "https";
}

const config = {
  headers: {
    Authorization: localStorage.getItem("token"),
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};

const testnet_node_options = {
  endpoint: process.env.REACT_APP_OTNODE_HOST,
  port: process.env.REACT_APP_OTNODE_TESTNET_PORT,
  useSSL: true,
  maxNumberOfRetries: 100,
};

const mainnet_node_options = {
  endpoint: process.env.REACT_APP_OTNODE_HOST,
  port: process.env.REACT_APP_OTNODE_MAINNET_PORT,
  useSSL: true,
  maxNumberOfRetries: 100,
};

const formatBytes = (bytes, decimals = 2) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};

const AssetPublish = (selectedFile) => {
  const { setIsLoading, isLoading } = useContext(AccountContext);
  const account = localStorage.getItem("account");
  const chain_id = localStorage.getItem("chain_id");
  const [inputValue, setInputValue] = useState("1");
  const [assetData, setAssetData] = useState("");
  const [cost, setCost] = useState(0);
  const [price, setPrice] = useState(0);
  const [result, setResult] = useState("");

  let node_options;
  let network;
  let explorer_url = "https://dkg.origintrail.io";

  if (chain_id === "Origintrail Parachain Testnet") {
    network = "otp::testnet";
    node_options = testnet_node_options;
    explorer_url = "https://dkg-testnet.origintrail.io";
  }

  if (chain_id === "Origintrail Parachain Mainnet") {
    network = "otp::mainnet";
    node_options = mainnet_node_options;
  }

  const dkgOptions = {
    epochsNum: inputValue,
    maxNumberOfRetries: 30,
    frequency: 2,
    contentType: "all",
    blockchain: {
      name: network,
      publicKey: account,
    },
  };

  useEffect(() => {
    async function readFile() {
      try {
        if (selectedFile.data) {
          setAssetData(selectedFile.data);

          const data = {
            asset: assetData,
            network: network,
            epochs: inputValue,
          };
          const dkg_bid_result = await axios
            .post(`https://api.othub.io/dkg/getBidSuggestion`, data, config)
            .then((response) => {
              // Handle the successful response here
              return response;
            })
            .catch((error) => {
              // Handle errors here
              console.error(error);
            });

          setCost(Number(dkg_bid_result.data) / 1e18);
        } 
        
        if(selectedFile && !selectedFile.data) {
          const reader = new FileReader();
          reader.onload = async (event) => {
            const content = event.target.result;
            setAssetData(content);

            const data = {
              asset: content,
              network: network,
              epochs: inputValue,
            };
            const dkg_bid_result = await axios
              .post(`https://api.othub.io/dkg/getBidSuggestion`, data, config)
              .then((response) => {
                // Handle the successful response here
                return response;
              })
              .catch((error) => {
                // Handle errors here
                console.error(error);
              });

            setCost(Number(dkg_bid_result.data) / 1e18);
          };
          reader.readAsText(selectedFile);
        }

        if(cost === 0){
          const rsp = await axios.get(
            "https://api.coingecko.com/api/v3/coins/origintrail"
          );
  
          setPrice(rsp.data.market_data.current_price.usd);
        }
      } catch (error) {
        console.error("Error preparing publish:", error);
      }
    }

    setCost(0);
    readFile();
  }, [inputValue]);

  const handlePublish = async (assetData) => {
    try {
      setIsLoading(true);

      const DkgClient = new DKG(node_options);
      let dkg_result;

      console.log(assetData);
      let dkg_txn_data = JSON.parse(assetData);

      dkg_result = await DkgClient.asset
        .create(
          {
            public: dkg_txn_data,
          },
          dkgOptions
        )
        .then((result) => {
          return result;
        });

      let pub_result = {
        status: true,
        result: dkg_result,
        msg: `Asset Published Successfully!`,
      };
      setResult(pub_result);
      setIsLoading(false);
    } catch (error) {
      let pub_result = {
        status: false,
        result: error,
        msg: `Asset Publish Failed!`,
      };
      setResult(pub_result);
      setIsLoading(false);
    }
  };

  const handleEpochChange = async (epochs) => {
    setInputValue(epochs);
  };

  if (isLoading) {
    return <Loading data={"Please sign awaiting transaction(s)..."} />;
  }

  if (result) {
    return (
      <div className="publish-asset">
        <div className="publish-asset-title">{result.msg}</div>
        {result.status ? (
          <div>
            <div className="publish-asset-div">
              <div className="publish-asset-ual">
                <strong>UAL:</strong>
                <br></br>
                {result.result.UAL}
              </div>
              <div className="publish-asset-assertion">
                <strong>Assertion ID:</strong>
                <br></br>
                {result.result.publicAssertionId}
              </div>
            </div>

            <div className="publish-asset-link">
              <a
                href={`${explorer_url}/explore?ual=${result.result.UAL}`}
                target="_blank"
                className="publish-asset-link"
              >
                Explore
              </a>
              :<br></br>
              <span style={{ paddingLeft: "10px", fontSize: "14px" }}>
                Explore your asset's data on the official DKG Explorer!
              </span>
            </div>
            <br></br>
            <div className="publish-asset-link">
              <a
                href={`https://othub.io/my-othub/inventory?ual=${result.result.UAL}`}
                target="_blank"
                className="publish-asset-link"
              >
                Inventory
              </a>
              :<br></br>
              <span style={{ paddingLeft: "10px", fontSize: "14px" }}>
                Open your inventory to view your asset's details!
              </span>
            </div>
          </div>
        ) : (
          <div className="publish-asset-error">{result.result}</div>
        )}
      </div>
    );
  }

  return (
    !result && (
      <div className="publish-asset">
        <div className="publish-asset-title">
          Are you sure you want to publish {selectedFile.data.name} to{" "}
          {chain_id}?
        </div>
        <div className="epoch-buttons">
          Epochs:
          <br></br>
          <button
            className="epoch-button"
            onClick={() => handleEpochChange("1")}
            name="timeframe"
            style={
              inputValue === "1"
                ? { color: "#FFFFFF", backgroundColor: "#6344df" }
                : {}
            }
          >
            1
          </button>
          <button
            className="epoch-button"
            onClick={() => handleEpochChange("2")}
            name="timeframe"
            style={
              inputValue === "2"
                ? { color: "#FFFFFF", backgroundColor: "#6344df" }
                : {}
            }
          >
            2
          </button>
          <button
            className="epoch-button"
            onClick={() => handleEpochChange("3")}
            name="timeframe"
            style={
              inputValue === "3"
                ? { color: "#FFFFFF", backgroundColor: "#6344df" }
                : {}
            }
          >
            3
          </button>
          <button
            className="epoch-button"
            onClick={() => handleEpochChange("4")}
            name="timeframe"
            style={
              inputValue === "4"
                ? { color: "#FFFFFF", backgroundColor: "#6344df" }
                : {}
            }
          >
            4
          </button>
          <button
            className="epoch-button"
            onClick={() => handleEpochChange("5")}
            name="timeframe"
            style={
              inputValue === "5"
                ? { color: "#FFFFFF", backgroundColor: "#6344df" }
                : {}
            }
          >
            5
          </button>
        </div>
        <div className="publish-asset-estimated-cost">
          <span style={{ fontSize: "16px" }}>
            {formatBytes(selectedFile.data.size)}
            <br></br>x{inputValue} Epochs ({inputValue * 90} Days)<br></br>
            x3 Nodes<br></br>
            {cost !== 0
              ? `${cost} TRAC ($${(cost * price).toFixed(3)})`
              : "Estimating cost..."}
          </span>
        </div>
        <div className="publish-asset-button">
          <button
            onClick={() => handlePublish(assetData)}
            type="submit"
            className="publish-button"
          >
            <strong>Publish</strong>
          </button>
        </div>
      </div>
    )
  );
};

export default AssetPublish;
