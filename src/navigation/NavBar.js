import React, { useContext, useEffect } from "react";
import "../css/navigation/NavBar.css";
import { AccountContext } from "../AccountContext";
import MetamaskButton from "./MetamaskButton";
import Loading from "../Loading";
import axios from "axios";

let front_admin_key;
let back_admin_key;
let addr;
let chain;
let url;
let ext;

ext = "http";
if (process.env.REACT_APP_RUNTIME_HTTPS === "true") {
  ext = "https";
}

function NavBar() {
  const { account, chain_id, isLoading, balance, setBalance } = useContext(AccountContext);
  const isMobile = window.matchMedia("(max-width: 480px)").matches;

  useEffect(() => {
    async function fetchData() {
      try {
        if (account) {
          if (chain_id === "Origintrail Parachain Testnet") {
            url = "https://origintrail-testnet.api.subscan.io/api/scan/account/tokens";
          }

          if (chain_id === "Origintrail Parachain Mainnet") {
            url = "https://origintrail.api.subscan.io/api/scan/account/tokens";
          }
        }

        const data = {
          address: account
        }

        const account_balance = await axios.post(url, data, {
          headers: {
            'Content-Type': 'application/json',
            'X-API-Key': process.env.REACT_APP_SUBSCAN_KEY
          },
        }).then(function (response) {
            // Handle the successful response here
            return response.data;
          })
          .catch(function (error) {
            // Handle errors here
            console.error(error);
          });

        setBalance(account_balance.data);
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
    chain = `[ ${chain_id} ]`;
  }

  const connectionStyle = {
    color: chain_id === "Unsupported Chain" ? "red" : "#13B785",
    fontSize: "20px",

    ...(isMobile && {
      fontSize: "12px",
    }),
  };

  if (isLoading) {
    <Loading />;
  }

  return (
    <nav>
      <div className="navbar">
        <h1>
        <a href="/"><img src={`${ext}://${process.env.REACT_APP_RUNTIME_HOST}/images?src=OTHub-Logo.png`} alt='othub-logo' className="othub-logo"></img></a>
          <a href="/" className="logo-text">
            othub.io <span style={{ fontSize: "14px" }}>beta</span>
          </a>
        </h1>
        <br></br>
        {account && balance ? (
          <div className="connection-info">
            <div className="addr-chain">
              <span style={connectionStyle}>{addr}</span><span style={connectionStyle}>{chain}</span>
            </div>

            <div className="balance">
              {balance.native ? (<span>{(balance.native[0].balance / 1000000000000).toFixed(4)} OTP</span>) : (<span></span>)}
              <br></br>
              {balance.ERC20 ? (<span>{(balance.ERC20[0].balance / 1000000000000000000).toFixed(4)} TRAC</span>) : (<span></span>)}
            </div>
          </div>
          
        ) : (
          <div></div>
        )}
        <MetamaskButton />
      </div>
    </nav>
  );
}

export default NavBar;
