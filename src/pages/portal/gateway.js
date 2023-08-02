import React, { useState, useEffect, useContext } from "react";
import "../../css/portal/gateway.css";
import { AccountContext } from "../../AccountContext";
import Loading from "../../Loading";
import Request from "./Request";
import AppSettings from "./AppSettings";
import BarChart from "../../charts/gatewayBarChart";
import BarChartTXNS from "../../charts/gatewayBarChartTXNS";
import axios from "axios";
let ext;

ext = "http";
if (process.env.REACT_APP_RUNTIME_HTTPS === "true") {
  ext = "https";
}

const Gateway = () => {
  const [data, setData] = useState("");
  const { chain_id, account } = useContext(AccountContext);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isAppSettingsOpen, setIsAppSettingsOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [filterInput, setFilterInput] = useState({
    ual: "",
    txn_id: "",
    app_name: "",
    progress: "",
    txn_type: "",
    limit: "100",
  });

  const queryParameters = new URLSearchParams(window.location.search);
  const provided_txn_id = queryParameters.get("txn_id");

  useEffect(() => {
    async function fetchData() {
      try {
        if (account && (chain_id ==='Origintrail Parachain Testnet' || chain_id ==='Origintrail Parachain Mainnet')) {
          const response = await axios.get(
            `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/portal/gateway?public_address=${account}&network=${chain_id}`
          );
          console.log(response.data);
          await setData(response.data);

          if (provided_txn_id) {
            console.log(provided_txn_id);
            const txn_id_response = await axios.get(
              `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/portal/gateway?txn_id=${provided_txn_id}&network=${chain_id}`
            );

            await setInputValue(txn_id_response.data.txn_header[0]);
            await setIsRequestOpen(true);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setData("");
    fetchData();
  }, [account]);

  if (!account) {
    return (
      <div className="gateway">
        <header className="gateway-header">
          Please connect your wallet to unlock your portal.
        </header>
      </div>
    );
  }

  if(chain_id !=='Origintrail Parachain Testnet' && chain_id !=='Origintrail Parachain Mainnet'){
    return (
    <div className="gateway">
        <header className="gateway-header">
          Connected with an unsupported chain. Please switch to Origintrail Parachain Testnet or Mainnet.
        </header>
      </div>
    )
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
    setIsAppSettingsOpen(true)
  };

  const closeSettingsPopup = () => {
    setIsAppSettingsOpen(false);
  };

  const handleFilterInput = (e) => {
    const { name, value } = e.target;
    setFilterInput((filterInput) => ({
      ...filterInput,
      [name]: value,
    }));
  };

  const handleFilterSubmit = async (e) => {
    e.preventDefault();
    // Perform the POST request using the entered value
    try {
      const fetchFilteredData = async () => {
        try {
          console.log(filterInput);

          await axios.get(
            `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/portal/gateway?public_address=${account}&network=${chain_id}&enable_apps=${filterInput.apps}`
          );
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchFilteredData();
    } catch (error) {
      console.error(error); // Handle the error case
    }
    //setData('')
  };

  const openInventory = () => {
    // Replace 'https://www.example.com' with the URL of the web page you want to open
    //window.open(`${process.env.WEB_HOST}/portal/gateway/inventory`, '_blank');
  };

  console.log(data)
  return (
    <div className="gateway">
      {isRequestOpen && (
        <div className="popup-overlay">
          <div className="request-popup-content">
            <button
              className="gateway-close-button"
              onClick={closeRequestPopup}
            >
              X
            </button>
            <Request data={JSON.stringify(inputValue)} />
          </div>
        </div>
      )}
      {isAppSettingsOpen && (
        <div className="popup-overlay">
          <div className="request-popup-content-app-settings">
            <button
              className="gateway-close-button"
              onClick={closeSettingsPopup}
            >
              X
            </button>
            <AppSettings data={data} />
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
                  value={filterInput.publisher}
                  onChange={handleFilterInput}
                  maxLength="100"
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
                  value="Mint"
                  onChange={handleFilterInput}
                  maxLength="100"
                />
                Mints<br></br>
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
              </div>
              <button type="submit">Apply</button>
            </form>
          </div>
          <div className="gateway-nav">
            <button type="submit" onClick={openInventory()}>
              <strong>Asset Inventory</strong>
            </button>
            <br></br>
            <button type="submit" onClick={openAppSettings}>
              <strong>App Settings</strong>
            </button>
          </div>
          <div className="recent-activity"></div>
          <div className="gateway-txn-container">
            {data.txn_header.map((txn) => (
              <button
                onClick={() => openRequestPopup(txn)}
                className="gateway-txn-record"
                key={txn.txn_id}
              >
                <div className="txn-created-at">{txn.created_at}</div>
                <div className="request">
                  {txn.request}
                </div>
                <div className={`${txn.progress}-progress`}>
                  {txn.progress}
                </div>
                <div className="txn-summary">
                {`${txn.app_name}(${txn.txn_id})`}
                </div>
                <div className="txn-ual">
                  {txn.ual}
                </div>
                <div className={`txn-${txn.request}-receiver`}>
                  Receiver:<span>{JSON.parse(txn.txn_data).receiver}</span>
                </div>
                <div className={`txn-${txn.request}-epochs`}>
                  Epochs: {txn.epochs}
                </div>
                <div className="txn-cost">
                  Estimated Cost: {txn.trac_fee}
                </div>
                <div className="txn-description">
                  <span>{txn.txn_description}</span>
                </div>
              </button>
            ))}
          </div>
          <div className="gateway-activity">
            Activity
            <BarChart data={data.raw_txn_header} />
            <br></br>
            <BarChartTXNS data={data.raw_txn_header} />
          </div>
        </header>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default Gateway;
