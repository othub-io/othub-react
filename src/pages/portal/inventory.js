import React, { useState, useEffect, useContext } from "react";
import { AccountContext } from "../../AccountContext";
import "../../css/portal/inventory.css";
import Loading from "../../Loading";
import axios from "axios";
import InvAsset from "./invAsset";
let ext;

ext = "http";
if (process.env.REACT_APP_RUNTIME_HTTPS === "true") {
  ext = "https";
}

const Inventory = () => {
  const [data, setData] = useState("");
  const { chain_id, account } = useContext(AccountContext);
  const [isAssetOpen, setIsAssetOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [filterInput, setFilterInput] = useState({
    ual: "",
    publisher: "",
    node_id: "",
    order: "",
    limit: "100",
  });

  const queryParameters = new URLSearchParams(window.location.search);
  const provided_ual = queryParameters.get("ual");

  useEffect(() => {
    async function fetchData() {
      try {
        if (account && (chain_id === 'Origintrail Parachain Testnet' || chain_id === 'Origintrail Parachain Mainnet')) {
          console.log(`${ext}://${process.env.REACT_APP_RUNTIME_HOST}/portal/inventory?network=${chain_id}&owner=${account}`)
          const pubs_response = await axios.get(
            `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/portal/inventory?network=${chain_id}&owner=${account}`
          );
          await setData(pubs_response.data);
  
          if (provided_ual) {
            const segments = provided_ual.split(":");
            const argsString =
              segments.length === 3 ? segments[2] : segments[2] + segments[3];
            const args = argsString.split("/");
  
            if (args.length !== 3) {
              console.log(`UAL doesn't have correct format: ${provided_ual}`);
            } else {
              console.log(provided_ual);
              const ual_response = await axios.get(
                `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/portal/inventory?ual=${provided_ual}&network=${chain_id}&owner=${account}`
              );
  
              console.log('iuwnfeiuefien: '+ual_response.data.v_pubs[0])
              if(ual_response.data.v_pubs[0]){
                await setInputValue(ual_response.data.v_pubs[0])
                await setIsAssetOpen(true)
              }
            }
          }
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setData("");
    fetchData();
  }, [account]);

  const openAssetPopup = (pub) => {
    setInputValue(pub);
    setIsAssetOpen(true);
  };

  const closeAssetPopup = () => {
    setIsAssetOpen(false);
    setInputValue("");
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

          const response = await axios.get(
            `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/portal/inventory?ual=${filterInput.ual}&order=${filterInput.order}&limit=${filterInput.limit}&network=${chain_id}&owner=${account}`
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
    setData("");
  };

  if (!account) {
    return (
      <div className="keys">
        <header className="keys-header">
          Please connect your wallet to unlock your inventory.
        </header>
      </div>
    );
  }

  if (data === "") {
    return (
      <div className="keys">
        <header className="keys-header">No assets found.</header>
      </div>
    );
  }

  return (
    <div className="assets">
      {isAssetOpen && (
        <div className="popup-overlay">
          <div className="inv-assets-popup-content">
            <button
              className="inv-assets-close-button"
              onClick={closeAssetPopup}
            >
              X
            </button>
            <InvAsset data={inputValue} />
          </div>
        </div>
      )}
      {data ? (
        <header className="assets-header">
          <div className="assets-form">
            <form onSubmit={handleFilterSubmit}>
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
              <div className="inv-asset-limit">
                Limit: {filterInput.limit}
                <br></br>
                <input
                  name="limit"
                  type="range"
                  min="0"
                  max="50000"
                  value={filterInput.limit}
                  onChange={handleFilterInput}
                  style={{ cursor: "pointer", width: "75%" }}
                />
              </div>
              <div className="inv-radios">
                Sort:<br></br>
                <input
                  type="radio"
                  name="order"
                  value="block_ts_hour"
                  onChange={handleFilterInput}
                  maxLength="100"
                />
                Mint Date<br></br>
                <input
                  type="radio"
                  name="order"
                  value="epochs_number"
                  onChange={handleFilterInput}
                  maxLength="100"
                />
                Expire Date<br></br>
                <input
                  type="radio"
                  name="order"
                  value="size"
                  onChange={handleFilterInput}
                  maxLength="100"
                />
                Size<br></br>
                <input
                  type="radio"
                  name="order"
                  value="token_amount"
                  onChange={handleFilterInput}
                  maxLength="100"
                />
                Cost
              </div>
              <button type="submit">Apply</button>
            </form>
          </div>
          <div className="assets-result-count">
            {data.v_pubs.length} results
          </div>
          <div className="asset-card-container">
            {data.v_pubs.map((pub) => (
              <button
                onClick={() => openAssetPopup(pub)}
                className="asset-card"
                key={pub.UAL}
              >
                <div className="card-token">{pub.token_id}</div>
                <div className="card-image">Images #Soon!</div>
                <div className="card-size">{pub.size}bytes</div>
                <div className="card-cost">
                  {pub.token_amount.toFixed(2)} Trac
                </div>
                <div className="card-expires">
                  Exp. in{" "}
                  {Math.ceil(
                    (new Date(pub.block_ts_hour).getTime() +
                      Number(pub.epochs_number) *
                        (Number(pub.epoch_length_days) * 24 * 60 * 60 * 1000) -
                      Math.abs(new Date())) /
                      (1000 * 60 * 60 * 24)
                  )}
                  d
                </div>
              </button>
            ))}
          </div>
        </header>
      ) : (
        <Loading />
      )}
    </div>
  );
};

export default Inventory;