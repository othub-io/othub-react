import React, { useState, useEffect } from "react";
import "../../css/assets.css";
import Loading from "../effects/Loading";
import Asset from "./Asset";
import axios from "axios";
import NetworkDrop from "../navigation/networkDrop";

const config = {
  headers: {
    Authorization: localStorage.getItem("token"),
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};

const Assets = () => {
  const [pubData, setPubData] = useState("");
  const [isAssetOpen, setIsAssetOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [filterInput, setFilterInput] = useState({
    ual: "",
    publisher: "",
    node_id: "",
    order_by: "",
    limit: "100",
  });
  let data

  const [blockchain, setBlockchain] = useState("");
  const [network, setNetwork] = useState("DKG Mainnet");

  const queryParameters = new URLSearchParams(window.location.search);
  const provided_ual = queryParameters.get("ual");

  useEffect(() => {
    async function fetchData() {
      try {
        let data = {
          network: network,
          blockchain: blockchain,
        };
        const response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/pubs/info`,
          data,
          config
        );
        await setPubData(response.data.result);

        if (provided_ual) {
          const segments = provided_ual.split(":");
          const argsString =
            segments.length === 3 ? segments[2] : segments[2] + segments[3];
          const args = argsString.split("/");

          if (args.length !== 3) {
            console.log(`UAL doesn't have correct format: ${provided_ual}`);
          } else {
            const pubs_response = await axios.post(
              `${process.env.REACT_APP_API_HOST}/pubs/info`,
              { network: network, ual: provided_ual, blockchain: blockchain },
              config
            );

            if (pubs_response.data.result[0] !== "") {
              await setInputValue(pubs_response.data.result[0]);
              await setIsAssetOpen(true);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setPubData("");
    fetchData();
  }, [network, blockchain]);

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
          data = {
            ual: filterInput.ual,
            publisher: filterInput.creator,
            nodeId: filterInput.node_id,
            order_by: filterInput.order_by,
            limit: filterInput.limit,
            network: network,
            blockchain: blockchain,
          };
          const response = await axios.post(
            `${process.env.REACT_APP_API_HOST}/pubs/info`,
            data,
            config
          );
          setPubData(response.data.result);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      fetchFilteredData();
    } catch (error) {
      console.error(error); // Handle the error case
    }
    setPubData("");
  };

  if (isAssetOpen && inputValue) {
    return (
      <div className="popup-overlay">
        <div className="assets-popup-content">
          <button className="assets-close-button" onClick={closeAssetPopup}>
            X
          </button>
          <Asset data={inputValue} />
        </div>
      </div>
    );
  }
  
  return (
    <div className="main">
      <div className="header">
        <NetworkDrop network={setNetwork} blockchain={setBlockchain} />
      </div>
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
          <div>
            Creator<br></br>
            <input
              type="text"
              name="creator"
              value={filterInput.creator}
              onChange={handleFilterInput}
              maxLength="100"
            />
          </div>
          <br></br>
          <div>
            Node ID<br></br>
            <input
              type="text"
              name="node_id"
              value={filterInput.node_id}
              onChange={handleFilterInput}
              maxLength="100"
            />
          </div>
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
              name="order_by"
              value="block_ts_hour"
              onChange={handleFilterInput}
              maxLength="100"
            />
            Mint Date<br></br>
            <input
              type="radio"
              name="order_by"
              value="epochs_number"
              onChange={handleFilterInput}
              maxLength="100"
            />
            Expire Date<br></br>
            <input
              type="radio"
              name="order_by"
              value="size"
              onChange={handleFilterInput}
              maxLength="100"
            />
            Size<br></br>
            <input
              type="radio"
              name="order_by"
              value="token_amount"
              onChange={handleFilterInput}
              maxLength="100"
            />
            Cost
          </div>
          <button type="submit">Apply</button>
        </form>
      </div>
      {pubData ? (
        <div className="asset-card-container">
          {pubData.map((pub) => (
            <button
              onClick={() => openAssetPopup(pub)}
              className={`asset-card-id${pub.chain_id}`}
              key={pub.UAL}
            >
              <div className={`card-token-id${pub.chain_id}`}>
                {pub.token_id}
              </div>
              <div className={`card-image-id${pub.chain_id}`}>
                <img
                  className="card-img"
                  src={`${process.env.REACT_APP_API_HOST}/images?src=Knowledge-Asset.jpg`}
                  alt="KA"
                ></img>
              </div>
              <div className={`card-size-id${pub.chain_id}`}>
                {pub.size}bytes
              </div>
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

export default Assets;
