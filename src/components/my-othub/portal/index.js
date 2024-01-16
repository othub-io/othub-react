import React, { useState, useEffect, useContext } from "react";
import "../../../css/portal.css";
import { AccountContext } from "../../../AccountContext";
import Loading from "../../effects/Loading";
import Request from "./Request";
import AppSettings from "./AppSettings";
import BarChart from "./gatewayBarChart";
import BarChartTXNS from ".//gatewayBarChartTXNS";
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

const Portal = () => {
  const {
    isAppSettingsOpen,
    setIsAppSettingsOpen,
    setData,
    data,
    isRequestOpen,
    setIsRequestOpen,
    isResultOpen,
    setIsResultOpen,
    resultValue,
  } = useContext(AccountContext);
  const account = localStorage.getItem("account");
  const connected_blockchain = localStorage.getItem("connected_blockchain");
  const [inputValue, setInputValue] = useState("");
  const [filterInput, setFilterInput] = useState({
    ual: "",
    txn_id: "",
    app_name: "",
    progress: "",
    txn_type: "",
    limit: "100",
  });

  const [mobileFilterInput, setMobileFilterInput] = useState({
    progress: "PENDING",
    txn_type: "",
    limit: "100",
  });

  const queryParameters = new URLSearchParams(window.location.search);
  const provided_txn_id = queryParameters.get("txn_id");

  useEffect(() => {
    async function fetchData() {
      try {
        if (
          account &&
          (connected_blockchain === "Origintrail Parachain Testnet" ||
          connected_blockchain === "Origintrail Parachain Mainnet")
        ) {
          const request_data = {
            network: connected_blockchain,
            progress: "ALL",
          };
          const response = await axios.post(
            `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/portal`,
            request_data,
            config
          );
          await setData(response.data);

          if (provided_txn_id) {
            const txn_id_response = await axios.post(
              `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/portal`,
              { txn_id: provided_txn_id, blockchain: connected_blockchain },
              config
            );

            await setInputValue(txn_id_response.data.txn_header[0]);
            await setIsRequestOpen(true);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setInputValue("");
    setData("");
    fetchData();
  }, [account,connected_blockchain]);

  if (!account) {
    return (
      <div className="keys">
        <header className="keys-header">
          Please connect your wallet to unlock your portal.
        </header>
      </div>
    );
  }

  if (
    connected_blockchain !== "Origintrail Parachain Testnet" &&
    connected_blockchain !== "Origintrail Parachain Mainnet" &&
    connected_blockchain !== "Chiado Testnet" &&
    connected_blockchain !== "Gnosis Mainnet"
  ) {
    return (
      <div className="keys">
        <header className="keys-header">
          {<div>Connected with an unsupported blockchain. <br></br><br></br>Current supported blockchains:<br></br><br></br>
          Origintrail Parachain Testnet<br></br>
          Origintrail Parachain Mainnet<br></br>
          Chiado Testnet<br></br>
          Gnosis Mainnet</div>}
        </header>
      </div>
    );
  }

  const openRequestPopup = (txn) => {
    setInputValue(txn);
    setIsRequestOpen(true);
  };

  const closeRequestPopup = () => {
    setIsRequestOpen(false);
    setInputValue("");
  };

  const openAppSettings = () => {
    setIsAppSettingsOpen(true);
  };

  const closeSettingsPopup = () => {
    setIsAppSettingsOpen(false);
  };

  const closeResultPopup = () => {
    setIsResultOpen(false);
    setInputValue("");
  };

  const handleFilterInput = (e) => {
    const { name, value } = e.target;
    setFilterInput((filterInput) => ({
      ...filterInput,
      [name]: value,
    }));
  };

  const handleMobileFilterInput = async (filterInput) => {
    try {
      filterInput = JSON.parse(filterInput);

      // Create a Promise to ensure the state update is complete
      const updateFilterInputPromise = new Promise((resolve) => {
        setMobileFilterInput((prevMobileFilterInput) => {
          const updatedFilterInput = {
            ...prevMobileFilterInput,
            [Object.keys(filterInput)[0]]: Object.values(filterInput)[0],
          };
          resolve(updatedFilterInput); // Resolve the promise with the updated state
          return updatedFilterInput;
        });
      });

      // Wait for the state update to complete
      const updatedMobileFilterInput = await updateFilterInputPromise;
      const request_data = {
        blockchain: connected_blockchain,
        progress: updatedMobileFilterInput.progress,
        request: updatedMobileFilterInput.txn_type,
        limit: updatedMobileFilterInput.limit,
      };
      const response = await axios.post(
        `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/portal`,
        request_data,
        config
      );
      setData(response.data);
    } catch (e) {
      console.error(e);
    }
  };

  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    // Perform the POST request using the entered value
    try {
      const fetchFilteredData = async () => {
        try {
          const request_data = {
            network: connected_blockchain,
            ual: filterInput.ual,
            app_name: filterInput.app_name,
            txn_id: filterInput.txn_id,
            progress: filterInput.progress,
            request: filterInput.request,
            limit: filterInput.limit,
          };

          const response = await axios.post(
            `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/portal`,
            request_data,
            config
          );
          setData(response.data);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchFilteredData();
    } catch (error) {
      console.error(error); // Handle the error case
    }
  };

  return (
    <div className="gateway">
      {isRequestOpen && (
        <div className="popup-overlay">
          <div className="request-popup-content">
            <Request data={JSON.stringify(inputValue)} />
          </div>
        </div>
      )}
      {isAppSettingsOpen && (
        <div className="popup-overlay">
          <div className="app-settings-popup-content">
            <button
              className="app-settings-close-button"
              onClick={closeSettingsPopup}
            >
              X
            </button>
            <AppSettings data={data} />
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
      {data ? (
        <header className="gateway-header">
          <div className="gateway-form">
            <form onSubmit={handleFilterSubmit}>
              <div>
                Transaction ID<br></br>
                <input
                  type="text"
                  name="txn_id"
                  value={filterInput.txn_id}
                  onChange={handleFilterInput}
                  maxLength="100"
                />
              </div>
              <br></br>
              <div>
                UAL<br></br>
                <input
                  type="text"
                  name="ual"
                  value={filterInput.ual}
                  onChange={handleFilterInput}
                  maxLength="100"
                />
              </div>
              <br></br>
              <div>
                Application Name<br></br>
                <input
                  type="text"
                  name="app_name"
                  value={filterInput.app_name}
                  onChange={handleFilterInput}
                  maxLength="20"
                />
              </div>
              <br></br>
              <div className="portal-limit">
                Limit: {filterInput.limit}
                <br></br>
                <input
                  name="limit"
                  type="range"
                  min="0"
                  max="5000"
                  value={filterInput.limit}
                  onChange={handleFilterInput}
                  style={{ cursor: "pointer", width: "75%" }}
                />
              </div>
              <br></br>
              <div className="radios">
                Type:<br></br>
                <input
                  type="radio"
                  name="request"
                  value="All"
                  onChange={handleFilterInput}
                  maxLength="100"
                />
                All<br></br>
                <input
                  type="radio"
                  name="request"
                  value="Create"
                  onChange={handleFilterInput}
                  maxLength="100"
                />
                Creations<br></br>
                <input
                  type="radio"
                  name="request"
                  value="Update"
                  onChange={handleFilterInput}
                  maxLength="100"
                />
                Updates<br></br>
                <input
                  type="radio"
                  name="request"
                  value="Transfer"
                  onChange={handleFilterInput}
                  maxLength="100"
                />
                Transfers<br></br>
                <br></br>
                Status:<br></br>
                <input
                  type="radio"
                  name="progress"
                  value="ALL"
                  onChange={handleFilterInput}
                  maxLength="100"
                />
                All<br></br>
                <input
                  type="radio"
                  name="progress"
                  value="COMPLETE"
                  onChange={handleFilterInput}
                  maxLength="100"
                />
                Complete<br></br>
                <input
                  type="radio"
                  name="progress"
                  value="PENDING"
                  onChange={handleFilterInput}
                  maxLength="100"
                />
                Pending<br></br>
                <input
                  type="radio"
                  name="progress"
                  value="REJECTED"
                  onChange={handleFilterInput}
                  maxLength="100"
                />
                Rejected<br></br>
                <br></br>
              </div>
              <button type="submit">Apply</button>
              <br></br>
            </form>
          </div>
          <div className="mobile-buttonz">
            <form></form>
            <button
              className="mobile-button"
              onClick={() => handleMobileFilterInput('{"txn_type": "Create"}')}
              name="txn_type"
              style={
                mobileFilterInput.txn_type === "Create"
                  ? { color: "#FFFFFF", backgroundColor: "#6344df" }
                  : {}
              }
            >
              Creations
            </button>
            <button
              className="mobile-button"
              onClick={() => handleMobileFilterInput('{"progress": "PENDING"}')}
              name="progress"
              style={
                mobileFilterInput.progress === "PENDING"
                  ? { color: "#FFFFFF", backgroundColor: "#6344df" }
                  : {}
              }
            >
              Pending
            </button>
            <button
              className="mobile-button"
              onClick={() => handleMobileFilterInput('{"txn_type": "Update"}')}
              name="txn_type"
              style={
                mobileFilterInput.txn_type === "Update"
                  ? { color: "#FFFFFF", backgroundColor: "#6344df" }
                  : {}
              }
            >
              Updates
            </button>
            <button
              className="mobile-button"
              onClick={() =>
                handleMobileFilterInput('{"progress": "COMPLETE"}')
              }
              name="progress"
              style={
                mobileFilterInput.progress === "COMPLETE"
                  ? { color: "#FFFFFF", backgroundColor: "#6344df" }
                  : {}
              }
            >
              Complete
            </button>
            <button
              className="mobile-button"
              onClick={() =>
                handleMobileFilterInput('{"txn_type": "Transfer"}')
              }
              name="txn_type"
              style={
                mobileFilterInput.txn_type === "Transfer"
                  ? { color: "#FFFFFF", backgroundColor: "#6344df" }
                  : {}
              }
            >
              Transfers
            </button>
            <button
              className="mobile-button"
              onClick={() =>
                handleMobileFilterInput('{"progress": "REJECTED"}')
              }
              name="progress"
              style={
                mobileFilterInput.progress === "REJECTED"
                  ? { color: "#FFFFFF", backgroundColor: "#6344df" }
                  : {}
              }
            >
              Rejected
            </button>
          </div>
          <div className="gateway-nav">
            {/* <button type="submit" onClick={openInventory()}>
              <strong>Asset Inventory</strong>
            </button> */}
            <button type="submit" onClick={openAppSettings}>
              <strong>Whitelist</strong>
            </button>
          </div>
          <br></br>

          <div className="recent-activity"></div>
          <div className="gateway-txn-container">
            {data.txn_header.map((txn) => (
              <button
                onClick={() => openRequestPopup(txn)}
                className="gateway-txn-record"
                key={txn.txn_id}
              >
                <div className="txn-created-at">{txn.created_at}</div>
                <div className="request">{txn.request}</div>
                <div className={`${txn.progress}-progress`}>{txn.progress}</div>
                <div className="txn-summary">
                  {`${txn.app_name}(${txn.txn_id.substring(0, 15)})`}
                </div>
                <div className="txn-ual">{txn.ual ? (txn.ual) : ("UAL TBD")}</div>
                <div className={`txn-${txn.request}-receiver`}>
                  Receiver:<span>{txn.receiver}</span>
                </div>
                <div className={`txn-${txn.request}-epochs`}>
                  Epochs: {txn.epochs}
                </div>
                <div className="txn-cost">- {txn.trac_fee}</div>
                <div className="txn-description">
                  <span>{txn.txn_description}</span>
                </div>
              </button>
            ))}
          </div>
          <div className="gateway-activity">
            <strong>Activity</strong>
            <BarChart data={data.raw_txn_header} />
            <br></br>
            <BarChartTXNS data={data.raw_txn_header} />
          </div>
        </header>
      ) : (
        <div className="assets">
          <div className="assets-header">
            <Loading />
          </div>
        </div>
      )}
    </div>
  );
};

export default Portal;
