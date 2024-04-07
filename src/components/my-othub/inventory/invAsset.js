import React, { useState, useEffect, useContext } from "react";
import { AccountContext } from "../../../AccountContext";
import "../../../css/invAsset.css";
import Loading from "../../effects/Loading";
import moment from "moment";
import axios from "axios";
import DKG from "dkg.js";
import InvAction from "./invAction";

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

const config = {
  headers: {
    Authorization: localStorage.getItem("token"),
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};

let asset_data;
let sub_scan_link;
let link_type;

const InvAsset = (txn) => {
  const {
    isResultOpen,
    setIsResultOpen,
    resultValue,
    isActionOpen,
    isLoading,
    setIsLoading,
    setIsActionOpen,
  } = useContext(AccountContext);
  const account = localStorage.getItem("account");
  const connected_blockchain = localStorage.getItem("connected_blockchain");
  const [inputValue, setInputValue] = useState("");
  const [assetHistory, setAssetHistory] = useState("");
  const isMobile = window.matchMedia("(max-width: 480px)").matches;
  let winners;
  let network;
  let keywords;
  asset_data = txn.data;
  winners = JSON.parse(asset_data.winners);

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

  sub_scan_link = 'https://'
  link_type = 'origintrail'
  explorer_url = 'https://dkg.origintrail.io'

  if(localStorage.getItem('network') === 'DKG Testnet'){
    link_type =  'origintrail-testnet'
    explorer_url = 'https://dkg-testnet.origintrail.io'
  }
  sub_scan_link = sub_scan_link + link_type + '.subscan.io'

  const DkgClient = new DKG(node_options);

  const days_to_expire =
    Number(asset_data.epochs_number) *
    Number(asset_data.epoch_length_days) *
    24 *
    60 *
    60 *
    1000;

  const date = new Date(asset_data.block_ts_hour);
  const mint_date = date.getTime();
  const mint_date_fancy = new Date(mint_date).toISOString();
  const formatted_mint_date_fancy = moment
    .utc(mint_date_fancy)
    .format("MM/DD/YYYY");

  const expire_date = mint_date + days_to_expire;
  const expire_date_fancy = new Date(expire_date).toISOString();
  const formatted_expire_date_fancy = moment
    .utc(expire_date_fancy)
    .format("MM/DD/YYYY");

  useEffect(() => {
    async function fetchData() {
      try {
        let data = {
          ual: asset_data.UAL,
          blockchain: asset_data.chain_name
        }
        let response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/assets/history`,
          data,
          config
        )
        await setAssetHistory(response.data.result)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setAssetHistory("");
    fetchData();
  }, [asset_data.UAL]);

  const openActionPopup = async (asset_data, request) => {
    setIsLoading(true);
    const txn = {
      blockchain: blockchain,
      epochs: 1,
      keyworks: keywords,
      request: request,
      txn_data: "",
      ual: asset_data.UAL,
      approver: account,
      receiver: "",
    };

    if(request === 'Update'){
      let dkg_get_result = await DkgClient.asset
      .get(txn.ual, {
        environment: env,
        validate: true,
        maxNumberOfRetries: 30,
        frequency: 1,
        state: "LATEST_FINALIZED",
        blockchain: {
          name: blockchain,
          publicKey: process.env.PUBLIC_KEY,
          privateKey: process.env.PRIVATE_KEY,
        },
      })
      .then((result) => {
        return result;
      });

    txn.txn_data = dkg_get_result.assertion;
    }

    setInputValue(txn);
    setIsLoading(false)
    setIsActionOpen(true);
  };

  const closeActionPopup = () => {
    setIsActionOpen(false);
    setInputValue("");
  };

  const closeResultPopup = () => {
    setIsResultOpen(false);
    setInputValue("");
  };

  const handleCopyLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link); // Replace with your desired link
      console.log("Link copied to clipboard!");
    } catch (error) {
      console.log("Failed to copy link to clipboard:", error);
    }
  };

  const historyTxn = async (url) => {
    try {
      await window.open(url, "_blank");
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading && !isActionOpen) {
    return <Loading data={'Getting asset data...'} />;
  }

  return (
    <div>
      {isActionOpen && (
        <div className="popup-overlay">
          <div className="inv-action-popup-content">
            <button
              className="inv-action-close-button"
              onClick={closeActionPopup}
            >
              X
            </button>
            <InvAction data={JSON.stringify(inputValue)} />
          </div>
        </div>
      )}
      {isResultOpen && (
        <div className="popup-overlay">
          <div className="result-popup-content">
            <button className="keys-close-button" onClick={closeResultPopup}>
              X
            </button>
            <br></br>
            <div>
              <div className="result-header">{resultValue.msg}</div>
              <br></br>
              {resultValue.url ? (
                <div className="result-text">
                  Visit <br></br>
                  <br></br>
                  <a
                    href={resultValue.url}
                    target="blank"
                    style={{ color: "#6344df" }}
                  >
                    {resultValue.url}
                  </a>
                  <br></br>
                  <br></br> to view your asset!
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      )}
      <div className="inv-asset-data">
        <div className="created">
          <span>Created on {formatted_mint_date_fancy}</span>
        </div>
        <div className="token">
          <span>
            Asset {asset_data.token_id}
            <button
              onClick={() =>
                handleCopyLink(
                  `https://www.othub.io/portal/asset?ual=${asset_data.UAL}`
                )
              }
            >
              <img
                className="copy-icon"
                src={"https://img.icons8.com/ios/50/000000/copy.png"}
                alt="Copy Link"
              />
            </button>
          </span>
        </div>
        <div className="size">
          <div className="size-header">Size</div>
          <div className="size-value">{asset_data.size}bytes</div>
        </div>
        <div className="epochs">
          <div className="epochs-header">Epochs</div>
          <div className="epochs-value">{asset_data.epochs_number}</div>
        </div>
        <div className="triples">
          <div className="triples-header">Triples</div>
          <div className="triples-value">{asset_data.triples_number}</div>
        </div>
        <div className="payment">
          <div className="triples-header">Payment</div>
          <div className="triples-value">
            {asset_data.token_amount.toFixed(4)}
          </div>
        </div>
        <div className="bid">
          <div className="bid-header">Bid</div>
          <div className="bid-value">{asset_data.bid.toFixed(4)}</div>
        </div>
        <div className="expires">
          <div className="expires-header">Expires</div>
          <div className="expires-value">{formatted_expire_date_fancy}</div>
        </div>
        <div className="meta-data">
          <div className="ual">
            <div className="ual-header">UAL</div>
            <div className="ual-value">
              <a
                href={`${explorer_url}/explore?ual=${asset_data.UAL}`}
                target="_blank"
                rel="noreferrer"
              >
                {asset_data.UAL}
              </a>
            </div>
          </div>
          <div className="state">
            <div className="state-header">State</div>
            <div className="state-value">{asset_data.state}</div>
          </div>
          <div className="txn-hash">
            <div className="txn-hash-header">Txn Hash</div>
            <div className="txn-hash-value">
              <a
                href={sub_scan_link + "/tx/" + asset_data.transaction_hash}
                target="_blank"
                rel="noreferrer"
              >
                {asset_data.transaction_hash}
              </a>
            </div>
          </div>
          <div className="keywords">
            <div className="keywords-header">Keywords</div>
            <div className="keywords-value">{asset_data.keyword}</div>
          </div>
          <div className="publisher">
            <div className="publisher-header">Publisher</div>
            <div className="publisher-value">
              <a
                href={`${explorer_url}/profile?wallet=${asset_data.publisher}`}
                target="_blank"
                rel="noreferrer"
              >
                {asset_data.publisher}
              </a>
            </div>
          </div>
        </div>
        <div className="winning-nodes">
          <span>Winning Nodes</span>
        </div>
        {winners ? (
          <div>
            {winners.map((group, index) => (
              <div className="winners" key={index}>
                <div className="winners-header">Epoch {index}</div>
                <div className="winners-value">{group.winners}</div>
              </div>
            ))}
          </div>
        ) : (
          <div></div>
        )}
        <div className="inv-asset-buttons">
          <button
            onClick={() => openActionPopup(asset_data, "Transfer")}
            type="submit"
            className="asset-transfer-button"
          >
            <strong>Transfer Asset</strong>
          </button>
          <button
            onClick={() => openActionPopup(asset_data, "Update")}
            type="submit"
            className="asset-create-button"
          >
            <strong>Update Asset</strong>
          </button>
        </div>
      </div>
      <div
        className="asset-history"
        style={{ display: isMobile ? "none" : "block" }}
      >
        {assetHistory && !isMobile ? (
          <div>
            {assetHistory.map((event, index) => (
              <div
                className="event-list-item"
                key={index}
                onClick={() =>
                  historyTxn(sub_scan_link + "/tx/" + event.transaction_hash)
                }
              >
                <div className="event-timestamp">{event.updated_at}</div>
                <div className="event-name">
                  {event.event} for {event.minted_epochs_number} epoch(s)
                </div>
                <div className="event-cost">
                  Costing {event.minted_token_amount / 1000000000000000000} TRAC
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

export default InvAsset;
