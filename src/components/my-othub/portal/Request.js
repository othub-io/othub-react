import React, { useContext, useState, useEffect } from "react";
import "../../../css/Request.css"; // Import the CSS file for styling (see Step 3)
import { AccountContext } from "../../../AccountContext";
import Loading from "../../effects/Loading";
import DKG from "dkg.js";
import axios from "axios";

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

const Request = (txn_info) => {
  const {
    setIsLoading,
    setData,
    setIsRequestOpen,
    setIsResultOpen,
    setResultValue,
    isRequestOpen,
    isLoading,
  } = useContext(AccountContext);
  const account = localStorage.getItem("account");
  const connected_blockchain = localStorage.getItem("connected_blockchain");
  const [isRejectTxnOpen, setIsRejectTxnOpen] = useState(false);
  const [cost, setCost] = useState(0);
  const [price, setPrice] = useState(0);
  const txn = JSON.parse(txn_info.data);
  const [inputValue, setInputValue] = useState(txn.epochs);

  let node_options = mainnet_node_options;
  let blockchain;
  let explorer_url = "https://dkg.origintrail.io";
  let env = "mainnet";

  if (connected_blockchain === "NeuroWeb Testnet") {
    blockchain = "otp:20430";
    node_options = testnet_node_options;
    explorer_url = "https://dkg-testnet.origintrail.io";
    env = "testnet";
  }

  if (connected_blockchain === "Chiado Testnet") {
    blockchain = "gnosis:10200";
    node_options = testnet_node_options;
    explorer_url = "https://dkg-testnet.origintrail.io";
    env = "testnet";
  }

  if (connected_blockchain === "NeuroWeb Mainnet") {
    blockchain = "otp:2043";
  }

  if (connected_blockchain === "Gnosis Mainnet") {
    blockchain = "gnosis:100";
  }

  useEffect(() => {
    async function fetchData() {
      try {
        let dkg_txn_data = JSON.parse(txn.txn_data);
        if (!dkg_txn_data["@context"]) {
          dkg_txn_data["@context"] = "https://schema.org";
        }

        const data = {
          asset: JSON.stringify(dkg_txn_data),
          blockchain: blockchain,
          epochs: inputValue,
        };

        const dkg_bid_result = await axios
          .post(`${process.env.REACT_APP_API_HOST}/dkg/getBidSuggestion`, data, config)
          .then((response) => {
            // Handle the successful response here
            return response;
          })
          .catch((error) => {
            // Handle errors here
            console.error(error);
          });

        setCost(Number(dkg_bid_result.data) / 1e18);

        const rsp = await axios.get(
          "https://api.coingecko.com/api/v3/coins/origintrail"
        );

        setPrice(rsp.data.market_data.current_price.usd);
      } catch (error) {
        console.error("Error preparing publish:", error);
      }
    }

    setCost(0);
    fetchData();
  }, [inputValue]);

  const handleTxn = async (txn) => {
    try {
      setIsLoading(true);

      let dkgOptions = {
        environment: env,
        epochsNum: inputValue,
        maxNumberOfRetries: 30,
        frequency: 2,
        contentType: "all",
        keywords: txn.keywords,
        blockchain: {
          name: txn.blockchain,
          publicKey: account,
        },
      };

      const DkgClient = new DKG(node_options);
      let dkg_result;
      let loc = "inventory";

      if (txn.request === "Create") {
        let dkg_txn_data = JSON.parse(txn.txn_data);
        if (!dkg_txn_data["@context"]) {
          dkg_txn_data["@context"] = "https://schema.org";
        }

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
      }

      if (txn.request === "Update") {
        let dkg_txn_data = JSON.parse(txn.txn_data);
        if (!dkg_txn_data["@context"]) {
          dkg_txn_data["@context"] = "https://schema.org";
        }

        dkg_result = await DkgClient.asset
          .update(
            txn.ual,
            {
              public: dkg_txn_data,
            },
            dkgOptions
          )
          .then((result) => {
            return result;
          });
      }

      if (txn.request === "Transfer") {
        loc = "assets";
        dkg_result = await DkgClient.asset
          .transfer(txn.ual, txn.receiver, dkgOptions)
          .then((result) => {
            return result;
          });
      }

      const request_data = {
        txn_id: txn.txn_id,
        blockchain: blockchain,
        ual: dkg_result.UAL,
        epochs: inputValue,
      };

      const response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/txn/complete`,
        request_data,
        config
      );

      setData(response.data);
      let result = {
        status: "success",
        msg: `Asset ${txn.request} succeeded!`,
        url: `${process.env.REACT_APP_WEB_HOST}/${loc}?ual=${dkg_result.UAL}`,
      };

      setResultValue(result);
      setIsLoading(false);
      setIsRequestOpen(false);
      setInputValue(result);
      setIsResultOpen(true);
    } catch (error) {
      console.log(error);
      let result = {
        msg: `Asset ${txn.request} failed!`,
      };
      setResultValue(result);
      setIsLoading(false);
      setIsRequestOpen(false);
      setIsResultOpen(true);
    }
  };

  const handleEpochChange = (epochs) => {
    setInputValue(epochs);
  };

  const openPopupRejectTxn = (txn) => {
    setInputValue(txn);
    setIsRejectTxnOpen(true);
  };

  const closePopupRejectTxn = () => {
    setIsRejectTxnOpen(false);
  };

  const handleRejectTxn = async (e) => {
    e.preventDefault();
    // Perform the POST request using the entered value
    try {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const request_data = {
            txn_id: txn.txn_id,
          };
          await axios.post(
            `${process.env.REACT_APP_API_HOST}/txn/reject`,
            request_data,
            config
          );
          setIsLoading(false);
          window.location.reload();
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchData();
    } catch (error) {
      console.error(error); // Handle the error case
    }
  };

  if (isLoading && !isRequestOpen) {
    return <Loading />;
  }

  if (isLoading && isRejectTxnOpen) {
    let text = "Processing rejection... ";
    return <Loading data={text} />;
  }

  if (isLoading && isRequestOpen) {
    let text = "Awaiting approval of transaction... ";
    return <Loading data={text} />;
  }

  if (account.toUpperCase() !== txn.approver.toUpperCase()) {
    console.log(`${account} attempted to sign a txn meant for ${txn.approver}`);
    return <div className="invalid">Invalid account.</div>;
  }

  if (
    (connected_blockchain === "NeuroWeb Testnet" &&
      txn.blockchain !== "otp:20430") ||
    (connected_blockchain === "NeuroWeb Mainnet" &&
      txn.blockchain !== "otp:2043") ||
    (connected_blockchain === "Chiado Testnet" &&
      txn.blockchain !== "gnosis:10200") ||
    (connected_blockchain === "Gnosis Mainnet" && txn.blockchain !== "gnosis:100")
  ) {
    return (
      <div className="popup-overlay">
        <div className="reject-popup-content">
          <button className="reject-close-button" onClick={() => setIsRequestOpen(false)}>
            X
          </button>
          <div className="invalid">Connected with an invalid blockchain.</div>
        </div>
      </div>
    );
  }

  if (isRejectTxnOpen) {
    return (
      <div className="popup-overlay">
        <div className="reject-popup-content">
          <button className="reject-close-button" onClick={closePopupRejectTxn}>
            X
          </button>
          <form onSubmit={handleRejectTxn}>
            <label>
              Are you sure you want to permanently reject this asset creation?
            </label>
            <button type="submit">Yes</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="request-data">
      <div className="requested">
      <button className="app-settings-close-button" onClick={() => setIsRequestOpen(false)}>
        X
      </button>
        <span className={`request-${txn.progress}-progress`}>
          {txn.progress}
        </span>{" "}
        <strong>{txn.request}</strong> queued at {txn.created_at}
      </div>
      <div className="txn">
        <span>{"(" + txn.txn_id + ")"}</span>
      </div>
      {(txn.request === "Create" || txn.request === "Update") && (
        <div className="data">
          <div className="request-ual">
            <strong>UAL: {txn.ual ? (txn.ual ) : ("TBD")}</strong>
          </div>
          <div className="data-header">Data</div>
          <div className="data-value-pub">
            <pre>{JSON.stringify(JSON.parse(txn.txn_data), null, 2)}</pre>
          </div>
        </div>
      )}
      {txn.request === "Transfer" && (
        <div className="data">
          <div className="data-header"></div>
          <div className="data-value-transfer">
            <br></br>
            <span>Transfer </span>
            <br></br>
            <br></br>
            {txn.ual}
            <br></br>
            <br></br>
            <span>to </span>
            <br></br>
            <br></br>
            {txn.receiver}
          </div>
        </div>
      )}
      <div className="description">
        <div className="description-value">{txn.txn_description}</div>
      </div>
      {(txn.request === "Create" || txn.request === "Update") && (
        <div>
          <div className="request-keywords">
            <div className="request-keywords-header">Keywords:</div>
            <div className="request-keywords-value">{txn.keywords}</div>
          </div>
          <div className="request-epochs">
            <div className="epoch-buttons">
              <div className="request-keywords-header">Epochs:</div>
              <br></br>
              {/* <input
                  type="range"
                  min="0"
                  max="100"
                  value={inputValue}
                  onChange={handleEpochChange}
                  style={{ cursor: "pointer", width: "75%" }}
                /> */}
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
              <button
                className="epoch-button"
                onClick={() => handleEpochChange("6")}
                name="timeframe"
                style={
                  inputValue === "6"
                    ? { color: "#FFFFFF", backgroundColor: "#6344df" }
                    : {}
                }
              >
                6
              </button>
              <button
                className="epoch-button"
                onClick={() => handleEpochChange("7")}
                name="timeframe"
                style={
                  inputValue === "7"
                    ? { color: "#FFFFFF", backgroundColor: "#6344df" }
                    : {}
                }
              >
                7
              </button>
              <button
                className="epoch-button"
                onClick={() => handleEpochChange("8")}
                name="timeframe"
                style={
                  inputValue === "8"
                    ? { color: "#FFFFFF", backgroundColor: "#6344df" }
                    : {}
                }
              >
                8
              </button>
              <button
                className="epoch-button"
                onClick={() => handleEpochChange("9")}
                name="timeframe"
                style={
                  inputValue === "9"
                    ? { color: "#FFFFFF", backgroundColor: "#6344df" }
                    : {}
                }
              >
                9
              </button>
              <button
                className="epoch-button"
                onClick={() => handleEpochChange("10")}
                name="timeframe"
                style={
                  inputValue === "10"
                    ? { color: "#FFFFFF", backgroundColor: "#6344df" }
                    : {}
                }
              >
                10
              </button>
            </div>
          </div>
        </div>
      )}
      <br></br>
      <div className="estimated-cost-pub">
        Estimated Cost:{" "}
        {cost !== 0
          ? `${cost} TRAC ($${(cost * price).toFixed(3)})`
          : "Estimating cost..."}
      </div>
      <div className="request-buttons">
        {txn.progress === "PENDING" && txn.request === "Create" && cost !== 0 && (
          <button
            onClick={() => handleTxn(txn)}
            type="submit"
            className="create-button"
          >
            <strong>Create Asset</strong>
          </button>
        )}

        {txn.progress === "PENDING" && txn.request === "Update" && cost !== 0 && (
          <button
            onClick={() => handleTxn(txn)}
            type="submit"
            className="create-button"
          >
            <strong>Update Asset</strong>
          </button>
        )}

        {txn.progress === "PENDING" && txn.request === "Transfer" && cost !== 0 && (
          <button
            onClick={() => handleTxn(txn)}
            type="submit"
            className="transfer-button"
          >
            <strong>Transfer Asset</strong>
          </button>
        )}

        {txn.progress !== "COMPLETE" && txn.progress !== "REJECTED" && cost !== 0 &&  (
          <button
            onClick={() => openPopupRejectTxn(txn)}
            type="submit"
            className="reject-button"
          >
            <strong>Reject</strong>
          </button>
        )}
      </div>
    </div>
  );
};

export default Request;
