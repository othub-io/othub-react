import React, { useState, useEffect } from "react";
import "../../../css/inventory.css";
import Loading from "../../effects/Loading";
import axios from "axios";
import InvAsset from "./invAsset";

const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};

const Inventory = () => {
  const [assetData, setAssetData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const account = localStorage.getItem("account");
  const connected_blockchain = localStorage.getItem("connected_blockchain");
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
          (connected_blockchain === "NeuroWeb Testnet" ||
            connected_blockchain === "NeuroWeb Mainnet" ||
            connected_blockchain === "Chiado Testnet" ||
            connected_blockchain === "Gnosis Mainnet")
        ) {
          let data = {
            blockchain: connected_blockchain,
            owner: account
          };

          let response = await axios.post(
            `${process.env.REACT_APP_API_HOST}/assets/info`,
            data,
            config
          );

          await setAssetData(response.data.result);

          if (provided_ual) {
            const segments = provided_ual.split(":");
            const argsString =
              segments.length === 3 ? segments[2] : segments[2] + segments[3];
            const args = argsString.split("/");

            if (args.length !== 3) {
              console.log(`UAL doesn't have correct format: ${provided_ual}`);
            } else {
              data = {
                blockchain: connected_blockchain,
                ual: provided_ual,
                owner: account
              };

              response = await axios
                .post(
                  `${process.env.REACT_APP_API_HOST}/assets/info`,
                  data,
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

              if (response.data.result[0]) {
                await setInputValue(response.data.result[0]);
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
    setAssetData("");
    fetchData();
    setIsLoading(false);
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
          let data = {
            ual: filterInput.ual,
            order_by: filterInput.order,
            limit: filterInput.limit,
            blockchain: connected_blockchain,
            owner: account
          };

          let response = await axios
            .post(
              `${process.env.REACT_APP_API_HOST}/assets/info`,
              data,
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
            setAssetData(response.data.result);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchFilteredData();
    } catch (error) {
      console.error(error); // Handle the error case
    }
    setAssetData("");
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

  if (isAssetOpen) {
    return (
      <div className="popup-overlay">
        <div className="inv-assets-popup-content">
          <button className="inv-assets-close-button" onClick={closeAssetPopup}>
            X
          </button>
          <InvAsset data={inputValue} />
        </div>
      </div>
    );
  }

  return (
    <div className="main">
      <div className="header">
      </div>
      <br></br>
        <br></br>
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
          <div className="asset-limit">
            Limit: {filterInput.limit}
            <br></br>
            <input
              name="limit"
              type="range"
              min="0"
              max="1000"
              value={filterInput.limit}
              onChange={handleFilterInput}
              style={{ cursor: "pointer", width: "75%" }}
            />
          </div>
          <div className="radios">
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
      {assetData ? (
        <div className="asset-card-container">
          {assetData.map((pub) => (
            <button
              onClick={() => openAssetPopup(pub)}
              className={`asset-card-id${pub.chain_id}`}
              key={pub.UAL}
            >
              <div className={`card-token-id${pub.chain_id}`}>{pub.token_id}</div>
              <div className={`card-image-id${pub.chain_id}`}>
                <img
                  className="card-img"
                  src={`${process.env.REACT_APP_API_HOST}/images?src=Knowledge-Asset.jpg`}
                  alt="KA"
                ></img>
              </div>
              <div className={`card-size-id${pub.chain_id}`}>{pub.size}bytes</div>
              <div className={`card-cost-id${pub.chain_id}`}>
                {pub.token_amount.toFixed(2)} Trac
              </div>
              <div className={`card-expires-id${pub.chain_id}`}>
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
      ) : (
        <div className="asset-card-container">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default Inventory;
