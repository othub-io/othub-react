import React, { useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider";
import "../../css/navigation/metamaskButton.css";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import Web3 from "web3";
let readable_chain_id;

const config = {
  headers: {
    Authorization: localStorage.getItem("token"),
  },
};

const handleSignMessage = async (publicAddress, nonce) => {
  try {
    var web3 = new Web3(window.ethereum);
    return new Promise((resolve, reject) => {
      const signature = web3.eth.personal.sign(
        web3.utils.fromUtf8(
          `Please sign nonce ${nonce} to authenticate account ownership.`
        ),
        publicAddress,
        ""
      );
      resolve(signature);
      return signature;
    });
  } catch (e) {
    console.error(e);
  }
};

const changeAccounts = async (account) => {
  try {
    const user_record = await axios.post(
      `${process.env.REACT_APP_API_HOST}/auth/register`,
      { account: account },
      config
    );

    // Sign message
    const signedMessage = await handleSignMessage(
      account,
      user_record.data.user_record[0].nonce
    );
    // Send signature to backend
    const responseSign = await axios.post(
      `${process.env.REACT_APP_API_HOST}/auth/sign`,
      { account: account, signature: signedMessage },
      config
    );

    //set token in localstorage
    localStorage.setItem("token", responseSign.data.token);
    localStorage.setItem("account", account); // Update account state in the parent component

    window.location.reload();
  } catch (error) {
    // Handle the error when signing is rejected or encounters other issues
    console.error("Error signing the message:", error);
    // Respond to the rejection or error appropriately
  }
};

const changeChain = async (newChain) => {
  try {
    if (newChain === "0x4fce") {
      readable_chain_id = `NeuroWeb Testnet`;
    } else if (newChain === "0x7fb") {
      readable_chain_id = "NeuroWeb Mainnet";
    } else if (newChain === "0x64") {
      readable_chain_id = "Gnosis Mainnet";
    } else if (newChain === "0x27d8") {
      readable_chain_id = "Chiado Testnet";
    } else {
      readable_chain_id = "Unsupported Chain";
    }

    localStorage.setItem("connected_blockchain", readable_chain_id);
    window.location.reload();
  } catch (error) {
    // Handle the error when signing is rejected or encounters other issues
    console.error("Error signing the message:", error);
    // Respond to the rejection or error appropriately
  }
};

const checkConnection = async () => {
  try {
    const provider = await detectEthereumProvider();
    // Metamask is connected.
    if (provider) {
      // Subscribe to account change events
      provider.on("accountsChanged", async (newAccounts) => {
        if (newAccounts.length > 0) {
          await changeAccounts(newAccounts[0]);
        }
      });

      // Subscribe to chain change events
      provider.on("chainChanged", async (newChain) => {
        await changeChain(newChain);
      });
    }
  } catch (error) {
    console.error(error);
  }
};

const handleConnect = async () => {
  try {
    const provider = await detectEthereumProvider();
    if (provider && provider.request) {
      const accounts = await provider.request({
        method: "eth_requestAccounts",
      });

      const activeChainId = await provider.request({
        method: "eth_chainId",
      });

      if (accounts.length > 0) {
        await changeAccounts(accounts[0]);
        await changeChain(activeChainId);
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const handleDisconnect = () => {
  // Add code to handle disconnection or reset any necessary state
  localStorage.removeItem("token", "");
  localStorage.removeItem("connected_blockchain", "");
  localStorage.removeItem("account", "");
  window.location.reload();
};

const MetamaskButton = () => {
  useEffect(() => {
    if (localStorage.getItem("token")) {
      const decodedToken = jwtDecode(localStorage.getItem("token"));
      const currentTime = Date.now() / 1000; // Convert milliseconds to seconds

      if (decodedToken.exp < currentTime) {
        localStorage.removeItem("token", "");
        localStorage.removeItem("connected_blockchain", "");
        localStorage.removeItem("account", "");
        return;
      }
    }

    checkConnection();
  }, []);

  return (
    <div>
      {localStorage.getItem("account") ? (
        <button className="connectWalletButton" onClick={handleDisconnect}>
          Disconnect
        </button>
      ) : (
        <button className="connectWalletButton" onClick={handleConnect}>
          Connect
        </button>
      )}
    </div>
  );
};

export default MetamaskButton;
