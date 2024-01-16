import React, { useContext, useState } from "react";
import "../../../css/Request.css"; // Import the CSS file for styling (see Step 3)
import { AccountContext } from "../../../AccountContext";
import Loading from "../../effects/Loading";
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

const InvAction = (txn_info) => {
  const {
    setIsLoading,
    setData,
    setIsResultOpen,
    setResultValue,
    isLoading,
    setIsActionOpen,
  } = useContext(AccountContext);
  const account = localStorage.getItem("account");
  const connected_blockchain = localStorage.getItem("connected_blockchain");
  const [inputValue, setInputValue] = useState("");
  const [keywordValue, setKeywordValue] = useState("");
  const [epochValue, setEpochValue] = useState("");
  const [receiverValue, setReceiverValue] = useState("");
  const txn = JSON.parse(txn_info.data);

  let node_options = mainnet_node_options;
  let blockchain;
  let explorer_url = "https://dkg.origintrail.io";
  let env = "mainnet";

  if (connected_blockchain === "Origintrail Parachain Testnet") {
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

  if (connected_blockchain === "Origintrail Parachain Mainnet") {
    blockchain = "otp:2043";
  }

  if (connected_blockchain === "Gnosis Mainnet") {
    blockchain = "gnosis:100";
  }

  const handleTxn = async (txn) => {
    try {
      setIsLoading(true);

      txn.receiver = receiverValue;
      let new_data = inputValue ? inputValue : txn.txn_data;
      let keywords = keywordValue ? keywordValue : txn.keywords;
      let epochs = epochValue ? epochValue : txn.epochs;

      let dkgOptions = {
        environment: env,
        epochsNum: epochs,
        maxNumberOfRetries: 30,
        frequency: 2,
        contentType: "all",
        keywords: keywords,
        blockchain: {
          name: txn.network,
          publicKey: account,
        },
      };

      const DkgClient = new DKG(node_options);
      let dkg_result;
      let loc = "inventory";

      if (txn.request === "Update") {
        let dkg_txn_data = new_data;
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
        completeTxn: txn.txn_id,
        blockchain: connected_blockchain,
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
      setInputValue(result);
      setIsActionOpen(false);
      setIsResultOpen(true);
    } catch (error) {
      console.log(error);
      let result = {
        msg: `Asset ${txn.request} failed!`,
      };
      setResultValue(result);
      setIsLoading(false);
      setIsResultOpen(true);
    }
  };

  function isJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      console.log(e);
      return "false";
    }
    return "true";
  }

  const handleDataChange = async (e) => {
    let valid_json = await isJsonString(JSON.stringify(e.target.value));
    if(valid_json){
      setInputValue(e.target.value);
    }else{

    }
  };

  const handleEpochChange = (e) => {
    setEpochValue(e.target.value);
  };

  const handleKeywordChange = (e) => {
    setKeywordValue(e.target.value);
  };

  const handleReceiverChange = (e) => {
    setReceiverValue(e.target.value);
  };

  if (isLoading) {
    let text = "Awaiting approval of transaction... ";
    return <Loading data={text} />;
  }

  if (txn.request === "Transfer") {
    return (
      <div className="action-data">
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
            <input
              className="inv-transfer-input"
              type="text"
              value={receiverValue ? receiverValue : ""}
              onChange={handleReceiverChange}
              Required
            />
          </div>
          <br></br>
          {window.matchMedia("(max-width: 1200px)").matches && <button
            onClick={() => handleTxn(txn)}
            type="submit"
            className="inv-transfer-button"
          >
            <strong>Approve</strong>
          </button>}
        </div>
      </div>
    );
  }

  if (txn.request === "Update") {
    return (
      <div className="action-data">
        <div className="data">
          <div className="data-header"></div>
          <div className="data-value-transfer">
            <br></br>
            <span>Update </span>
            <br></br>
            <br></br>
            {txn.ual}
            <br></br>
            <br></br>
            <div className="inv-update-epochs-input">
              Epochs:
              <input
                type="text"
                value={epochValue ? epochValue : txn.epochs}
                onChange={handleEpochChange}
                Required
              />
            </div>
            <div className="inv-update-keywords-input">
            Keywords:
            <input
              type="text"
              value={keywordValue ? keywordValue : txn.keywords}
              onChange={handleKeywordChange}
              Required
            />
            </div>
            <div className="inv-update-data-input">
              Data:
            <textarea
              value={
                inputValue ? inputValue : JSON.stringify(txn.txn_data, null, 2)
              }
              onChange={handleDataChange}
              Required
            />
            </div>
          </div>
          <br></br>
          {window.matchMedia("(max-width: 1200px)").matches && <button
            onClick={() => handleTxn(txn)}
            className="inv-transfer-button"
          >
            <strong>Approve</strong>
          </button>}
        </div>
      </div>
    );
  }
};

export default InvAction;
