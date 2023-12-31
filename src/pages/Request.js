import React, { useContext, useState } from "react";
import "../css/Request.css"; // Import the CSS file for styling (see Step 3)
import { AccountContext } from "../AccountContext";
import Loading from "../Loading";
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

const Request = (txn) => {
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
  const chain_id = localStorage.getItem("chain_id");
  const [inputValue, setInputValue] = useState("");
  const [isRejectTxnOpen, setIsRejectTxnOpen] = useState(false);
  txn = JSON.parse(txn.data);

  const handleTxn = async (txn) => {
    try {
      setIsLoading(true);
      let node_options;
      if (
        txn.network === "otp::testnet" &&
        chain_id === "Origintrail Parachain Testnet"
      ) {
        node_options = testnet_node_options;
      }

      if (
        txn.network === "otp::mainnet" &&
        chain_id === "Origintrail Parachain Mainnet"
      ) {
        node_options = mainnet_node_options;
      }

      if (!node_options) {
        return;
      }

      let epochs = txn.epochs;
      if (Number(inputValue)) {
        epochs = inputValue;
      }

      let dkgOptions = {
        epochsNum: epochs,
        maxNumberOfRetries: 30,
        frequency: 2,
        contentType: "all",
        keywords: txn.keywords,
        blockchain: {
          name: txn.network,
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
          .transfer(
            txn.ual, 
            txn.receiver,
            dkgOptions
          )
          .then((result) => {
            return result;
          });
      }

      const request_data = {
        completeTxn: txn.txn_id,
        network: chain_id,
        ual: dkg_result.UAL,
        epochs: epochs,
      };

      const response = await axios.post(
        `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/portal`,
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

  const handleEpochChange = (e) => {
    setInputValue(e.target.value);
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
            rejectTxn: inputValue.txn_id
          }
          await axios.post(
            `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/portal`,
            request_data,
            config
          );
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
    console.log(
      `${account} attempted to sign a txn meant for ${txn.approver}`
    );
    return <div className="invalid">Invalid account.</div>;
  }

  if (
    (chain_id === "Origintrail Parachain Testnet" &&
      txn.network !== "otp::testnet") ||
    (chain_id === "Origintrail Parachain Mainnet" &&
      txn.network !== "otp::mainnet")
  ) {
    return <div className="invalid">Invalid network.</div>;
  }

  return (
    <div className="request-data">
      {isRejectTxnOpen && (
        <div className="popup-overlay">
          <div className="reject-popup-content">
            <button
              className="reject-close-button"
              onClick={closePopupRejectTxn}
            >
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
      )}
      <div className="requested">
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
            <strong>UAL: {txn.ual}</strong>
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
            <form className="request-epochs-header">
              <label>
                Epochs:
                <input
                  type="text"
                  value={inputValue ? inputValue : JSON.stringify(txn.epochs)}
                  onChange={handleEpochChange}
                />
              </label>
            </form>
          </div>
        </div>
      )}
      <br></br>
      <br></br>
      <div className="estimated-cost-pub">Estimated Cost:</div>
      <div className="request-buttons">
        {txn.progress === "PENDING" && txn.request === "Create" && (
          <button
            onClick={() => handleTxn(txn)}
            type="submit"
            className="create-button"
          >
            <strong>Create Asset</strong>
          </button>
        )}

        {txn.progress === "PENDING" && txn.request === "Update" && (
          <button
            onClick={() => handleTxn(txn)}
            type="submit"
            className="create-button"
          >
            <strong>Update Asset</strong>
          </button>
        )}

        {txn.progress === "PENDING" && txn.request === "Transfer" && (
          <button
            onClick={() => handleTxn(txn)}
            type="submit"
            className="transfer-button"
          >
            <strong>Transfer Asset</strong>
          </button>
        )}

        {txn.progress !== "COMPLETE" && txn.progress !== "REJECTED" && (
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
