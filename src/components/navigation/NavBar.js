import React, { useState, useContext, useEffect } from "react";
import "../../css/navigation/NavBar.css";
import { AccountContext } from "../../AccountContext";
import MetamaskButton from "./MetamaskButton";
import axios from "axios";

let front_admin_key;
let back_admin_key;
let addr;
let chain;
let url;
let aurl;
let burl;

const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};

function NavBar() {
  const { balance, setBalance } = useContext(AccountContext);
  const [syncData, setSyncData] = useState(null);
  const [syncStatus, setSyncStatus] = useState(true);
  const account = localStorage.getItem("account");
  const connected_blockchain = localStorage.getItem("connected_blockchain");
  const isMobile = window.matchMedia("(max-width: 480px)").matches;

  useEffect(() => {
    async function fetchData() {
      try {
        if (account) {
          if (connected_blockchain === "NeuroWeb Testnet") {
            url =
              "https://neuroweb-testnet.api.subscan.io/api/scan/account/tokens";
          }

          if (connected_blockchain === "NeuroWeb Mainnet") {
            url = "https://neuroweb.api.subscan.io/api/scan/account/tokens";
          }

          if (connected_blockchain === "Gnosis Mainnet") {
            aurl =
              `https://gnosis.blockscout.com/api/v2/addresses/${account}/token-balances`;
            burl =
              `https://gnosis.blockscout.com/api/v2/addresses/${account}`;
          }

          if (connected_blockchain === "Chiado Testnet") {
            aurl =
              `https://gnosis-chiado.blockscout.com/api/v2/addresses/${account}/token-balances`;
            burl =
              `https://gnosis-chiado.blockscout.com/api/v2/addresses/${account}`;
          }
        }

        if (
          connected_blockchain === "NeuroWeb Testnet" ||
          connected_blockchain === "NeuroWeb Mainnet"
        ) {
          const data = {
            address: account,
          };

          let account_balance = await axios
            .post(url, data, {
              headers: {
                "Content-Type": "application/json",
                "X-API-Key": process.env.REACT_APP_SUBSCAN_KEY,
              },
            })
            .then(function (response) {
              // Handle the successful response here
              return response.data;
            })
            .catch(function (error) {
              // Handle errors here
              console.error(error);
            });

          setBalance(account_balance.data);
        }

        if (
          connected_blockchain === "Chiado Testnet" ||
          connected_blockchain === "Gnosis Mainnet"
        ) {
          let xdai_balance = await axios
            .get(burl)
            .then(function (response) {
              // Handle the successful response here
              return response.data;
            })
            .catch(function (error) {
              // Handle errors here
              console.error(error);
            });

          let token_balance = await axios
            .get(aurl)
            .then(function (response) {
              // Handle the successful response here
              return response.data;
            })
            .catch(function (error) {
              // Handle errors here
              console.error(error);
            });

          let trac_balance;
          for (const token of token_balance) {
            if (token.token.symbol === "TRAC" || token.token.symbol === "tgcTRAC") {
              trac_balance = token.value;
            }
          }

          let account_balance = {
            xdai: xdai_balance.coin_balance,
            trac: trac_balance,
          };
          setBalance(account_balance);
        }

        let response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/misc/sync_status`,
          {},
          config
        );

        setSyncData(response.data.sync);

        for (const record of response.data.sync) {
          if (record.status === false) {
            setSyncStatus(false);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [account]);

  if (account) {
    front_admin_key = account.substring(0, 6);
    back_admin_key = account.substring(account.length - 6);
    addr = `[ ${front_admin_key}...${back_admin_key} ]`;
    chain = `[ ${connected_blockchain} ]`;
  }

  const connectionStyle = {
    color: connected_blockchain === "Unsupported Chain" ? "red" : "#13B785",
    fontSize: "20px",

    ...(isMobile && {
      fontSize: "12px",
    }),
  };

  return (
    <nav>
      <div className="navbar">
        <a href="/">
          <img
            src={`${process.env.REACT_APP_API_HOST}/images?src=OTHub-Logo.png`}
            alt="othub-logo"
            className="othub-logo"
          ></img>
        </a>
        <a href="/" className="logo-text">
          <span style={{ fontSize: "24px" }}>othub.io </span>
        </a>
        <br></br>
        {syncStatus === false && (
          <div className="sync-icon">
            <div className="circle">
              <span className="exclamation">!</span>
            </div>
            <div className="tooltip">
              {syncData.map((record) => (
                <div>
                  {record.status === false && (
                    <span>{`${record.blockchain} last sync'd: ${record.last_sync}`}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        <br></br>
        <div className="connection-info">
          {account && (
            <div className="addr-chain">
              <span style={connectionStyle}>{addr}</span>
              <span style={connectionStyle}>{chain}</span>
            </div>
          )}
          {account &&
          balance &&
          (connected_blockchain === "NeuroWeb Mainnet" ||
            connected_blockchain === "NeuroWeb Testnet") ? (
            <div className="balance">
              {balance.native ? (
                <span>
                  {(balance.native[0].balance / 1000000000000).toFixed(4)} NEURO
                </span>
              ) : (
                <span>0 NEURO</span>
              )}
              <br></br>
              {balance.ERC20 ? (
                <span>
                  {(balance.ERC20[0].balance / 1000000000000000000).toFixed(4)}{" "}
                  TRAC
                </span>
              ) : (
                <span>0 TRAC</span>
              )}
            </div>
          ) : (
            ""
          )}

          {account &&
          balance &&
          (connected_blockchain === "Gnosis Mainnet" ||
            connected_blockchain === "Chiado Testnet") ? (
            <div className="balance">
              <span>
                {balance.xdai
                  ? (balance.xdai / 1000000000000000000).toFixed(4)
                  : 0}{" "}
                xDai
              </span>
              <br />
              <span>
                {balance.trac
                  ? (balance.trac / 1000000000000000000).toFixed(4)
                  : 0}{" "}
                TRAC
              </span>
            </div>
          ) : (
            ""
          )}
        </div>

        <MetamaskButton />
      </div>
    </nav>
  );
}

export default NavBar;
