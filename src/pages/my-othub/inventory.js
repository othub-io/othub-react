import React, { useState, useEffect } from "react";
import "../../css/inventory.css";
import Loading from "../../Loading";
import axios from "axios";
import InvAsset from "../invAsset";
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

const Inventory = () => {

  const [data, setData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const account = localStorage.getItem("account");
  const chain_id = localStorage.getItem("chain_id");
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
        if (
          account &&
          (chain_id === "Origintrail Parachain Testnet" ||
            chain_id === "Origintrail Parachain Mainnet")
        ) {
          const request_data = {
            network: chain_id,
          };

          const response = await axios
            .post(
              `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/inventory`,
              request_data,
              config
            )
            .then((response) => {
              // Handle the successful response here
              return response;
            })
            .catch((error) => {
              // Handle errors here
              console.error(error);
            });

          await setData(response.data);

          if (provided_ual) {
            const segments = provided_ual.split(":");
            const argsString =
              segments.length === 3 ? segments[2] : segments[2] + segments[3];
            const args = argsString.split("/");

            if (args.length !== 3) {
              console.log(`UAL doesn't have correct format: ${provided_ual}`);
            } else {
              const request_data = {
                network: chain_id,
                ual: provided_ual,
              };

              const ual_response = await axios
                .post(
                  `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/inventory`,
                  request_data,
                  config
                )
                .then((response) => {
                  // Handle the successful response here
                  return response;
                })
                .catch((error) => {
                  // Handle errors here
                  console.error(error);
                });

              if (ual_response.data.v_pubs[0]) {
                await setInputValue(ual_response.data.v_pubs[0]);
                await setIsAssetOpen(true);
              }
            }
          }
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setIsLoading(true);
    setData("");
    fetchData();
    setIsLoading(false)
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
          const request_data = {
            ual: filterInput.ual,
            order: filterInput.order,
            limit: filterInput.limit,
            network: chain_id,
          };

          const response = await axios
            .post(
              `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/inventory`,
              request_data,
              config
            )
            .then((response) => {
              // Handle the successful response here
              return response;
            })
            .catch((error) => {
              // Handle errors here
              console.error(error);
            });
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

  if (data === "" && !isLoading) {
    return (
      <div className="keys">
        <header className="keys-header">No assets found.</header>
      </div>
    );
  }
  
  if(data === ''){
    return(<div className="assets">
    <div className="assets-header">
      <Loading />
    </div>
  </div>)
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
                <div className="card-image">
                  <img
                    className="card-img"
                    src={`${ext}://${process.env.REACT_APP_RUNTIME_HOST}/images?src=Knowledge-Asset.jpg`}
                    alt="KA"
                  ></img>
                </div>
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
        <div className="assets">
          <div className="assets-header">
            <Loading />
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;
