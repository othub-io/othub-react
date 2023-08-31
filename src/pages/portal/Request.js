import React, { useContext, useState } from "react";
import "../../css/portal/Request.css"; // Import the CSS file for styling (see Step 3)
import { AccountContext } from "../../AccountContext";
import Loading from "../../Loading";
import DKG from "dkg.js";
import axios from "axios";
let ext;

ext = "http";
if (process.env.REACT_APP_RUNTIME_HTTPS === "true") {
  ext = "https";
}

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
    const { setData, setIsRequestOpen, isRequestOpen, chain_id, account } = useContext(AccountContext);
  const [isLoading, setIsLoading] = useState(false);
  const [isRejectTxnOpen, setIsRejectTxnOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  txn = JSON.parse(txn.data);

  const handleSubmit = async (txn) => {
    try {
      if (account.toUpperCase() !== txn.public_address.toUpperCase()) {
        console.log(
          `${account} attempted to sign a txn meant for ${txn.public_address}`
        );
        return;
      }

      setIsLoading(true);
      let options;
      if (
        txn.network === "otp::testnet" &&
        chain_id === "Origintrail Parachain Testnet"
      ) {
        options = testnet_node_options;
      }

      if (
        txn.network === "otp::mainnet" &&
        chain_id === "Origintrail Parachain Mainnet"
      ) {
        options = mainnet_node_options;
      }

      if (!options) {
        return;
      }

      let epochs = txn.epochs;
      if (Number(inputValue)) {
        epochs = inputValue;
      }

      let publishOptions;
      if (!txn.trac_fee) {
        publishOptions = {
          epochsNum: epochs,
          maxNumberOfRetries: 30,
          frequency: 2,
          contentType: "all",
          keywords: txn.keywords,
          blockchain: {
              name: txn.network,
              publicKey: account
          },
        };
      } else {
        publishOptions = {
          epochsNum: epochs,
          maxNumberOfRetries: 30,
          frequency: 2,
          contentType: "all",
          //tokenAmount: ethers.utils.parseEther(txn.trac_fee),
          keywords: txn.keywords,
          blockchain: {
              name: txn.network,
              publicKey: account
          },
        };
      }

      let dkg_txn_data = JSON.parse(txn.txn_data);

      if (!dkg_txn_data["@context"]) {
        dkg_txn_data["@context"] = "https://schema.org";
      }

      const DkgClient = new DKG(options);
        await DkgClient.asset
        .create(
          {
            public: dkg_txn_data,
          },
          publishOptions
        )
        .then((result) => {
          console.log({ assertionId: result.assertionId, UAL: result.UAL });
          return result;
        });

        const response = await axios.get(
            `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/portal/gateway?completeTxn=${txn.txn_id}&account=${account}&network=${chain_id}`
        );
        
        setData(response.data);
        setIsLoading(false);
        setIsRequestOpen(false);
    } catch (error) {
        console.log(error);
        setIsLoading(false);
        setIsRequestOpen(false);
    }
    };

    const handleTransfer = async (txn) => {
        try {
            if (account.toUpperCase() !== txn.public_address.toUpperCase()) {
                console.log(
                    `${account} attempted to sign a txn meant for ${txn.public_address}`
                );
                return;
            }

            setIsLoading(true);
            let options;
            if (
                txn.network === "otp::testnet" &&
                chain_id === "Origintrail Parachain Testnet"
            ) {
                options = testnet_node_options;
            }

            if (
                txn.network === "otp::mainnet" &&
                chain_id === "Origintrail Parachain Mainnet"
            ) {
                options = mainnet_node_options;
            }

            if (!options) {
                return;
            }

            let epochs = txn.epochs;
            if (Number(inputValue)) {
                epochs = inputValue;
            }

            let transferOptions;
            console.log(txn.trac_fee);
            if (!txn.trac_fee) {
                transferOptions = {
                    epochsNum: epochs,
                    maxNumberOfRetries: 30,
                    frequency: 2,
                    contentType: "all",
                    keywords: txn.keywords,
                    blockchain: {
                        name: txn.network,
                        publicKey: account
                    },
                };
            } else {
                transferOptions = {
                    epochsNum: epochs,
                    maxNumberOfRetries: 30,
                    frequency: 2,
                    contentType: "all",
                    //tokenAmount: ethers.utils.parseEther(txn.trac_fee),
                    keywords: txn.keywords,
                    blockchain: {
                        name: txn.network,
                        publicKey: account
                    },
                };
            }

            let dkg_txn_data = JSON.parse(txn.txn_data);

            if (!dkg_txn_data["@context"]) {
                dkg_txn_data["@context"] = "https://schema.org";
            }

            const DkgClient = new DKG(options);

            await DkgClient.asset
                .transfer(
                    txn.ual,
                    JSON.parse(txn.txn_data).receiver,
                    transferOptions
                )
                .then((result) => {
                    console.log(result);
                    return result;
                });

            await axios.get(
                `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/portal/gateway?completeTxn=${txn.txn_id}&account=${account}&network=${chain_id}`
            );
            setIsLoading(false);
            setIsRequestOpen(false);
        } catch (error) {
            console.log(error);
            setIsLoading(false);
            setIsRequestOpen(false);
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
          await axios.get(
            `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/portal/gateway?rejectTxn=${inputValue.txn_id}`
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

  if (isLoading) {
    return <Loading />;
    }

    if (isLoading && isRequestOpen) {
        let text = 'Awaiting approval of transaction 1 of 2... '
        return <Loading data={text} />;
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
        <span className={`request-${txn.progress}-progress`}>{txn.progress}</span> <strong>{txn.request}</strong> queued at {txn.created_at}
        
      </div>
      <div className="txn">
        <span>{txn.app_name} {'('+txn.txn_id+')'}</span>
      </div>
      {(txn.request === "Create" || txn.request === "Update") && (
        
        <div className="data">
          <div className="request-ual">
            <strong>UAL: </strong>{txn.ual}
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
          <span>Send </span><br></br>
            <br></br>
            {txn.ual}<br></br>
            <br></br>
            <span>to </span><br></br>
            <br></br>
            {JSON.parse(txn.txn_data).receiver}
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
                  value={inputValue ? (inputValue) : (txn.epochs)}
                  onChange={handleEpochChange}
                />
              </label>
            </form>
          </div>
        </div>
      )}
        <div>
          <div className="estimated-cost-pub">
            Estimated Cost:
              </div>
          {txn.progress === "PENDING" && txn.request === "Create" && (
              <button
                onClick={() => handleSubmit(txn)}
                type="submit"
                className="create-button"
              >
                <strong>Create Asset</strong>
              </button>
              )}
              {txn.progress === "PENDING" && txn.request === "Update" && (
                  <button
                      onClick={() => handleSubmit(txn)}
                      type="submit"
                      className="create-button"
                  >
                      <strong>Update Asset</strong>
                  </button>
              )}
              {txn.progress === "PENDING" && txn.request === "Transfer" && (
                  <button
                      onClick={() => handleSubmit(txn)}
                      type="submit"
                      className="create-button"
                  >
                      <strong>Transfer Asset</strong>
                  </button>
              )}
          <button
            onClick={() => openPopupRejectTxn(txn)}
            type="submit"
            className="cancel-button"
          >
            <strong>Reject</strong>
          </button>
        </div>
      {(txn.progress === "PENDING" && txn.request === "Transfer") && (
        <div>
          <div className="estimated-cost-transfer">
            Estimated Cost:
          </div>
          <button
            onClick={() => handleTransfer(txn)}
            type="submit"
            className="transfer-button"
          >
            <strong>Transfer Asset</strong>
          </button>
          <button
            onClick={() => openPopupRejectTxn(txn)}
            type="submit"
            className="cancel-button"
          >
            <strong>Reject</strong>
          </button>
        </div>
      )}
    </div>
  );
};

export default Request;
