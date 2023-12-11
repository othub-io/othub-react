import React, { useEffect, useContext } from "react";
import { AccountContext } from "../AccountContext";
import detectEthereumProvider from "@metamask/detect-provider";
import "../css/navigation/metamaskButton.css";
import axios from "axios";
import Web3 from "web3";
let readable_chain_id;
let ext;

ext = "http";
if (process.env.REACT_APP_RUNTIME_HTTPS === "true") {
  ext = "https";
}

const handleSignMessage = async (publicAddress, nonce) => {
  try {
    var web3 = new Web3(window.ethereum);
    return new Promise((resolve, reject) => {
      const signature = web3.eth.personal.sign(
        web3.utils.fromUtf8(`Please sign nonce ${nonce} to authenticate account ownership.`),
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

const MetamaskButton = (token) => {
  const { setIsLoading } = useContext(AccountContext);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const provider = await detectEthereumProvider();
        // Metamask is connected.
        if (provider) {
          // Subscribe to account change events
          provider.on("accountsChanged", async (newAccounts) => {
            setIsLoading(true);
            if (newAccounts.length > 0) {
              //get user record
              const user_record = await axios.post(
                `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/auth/register`,
                {public_address: newAccounts[0]}
              );

              // Sign message
              const signedMessage = await handleSignMessage(
                newAccounts[0],
                user_record.data.user_record[0].nonce
              );

              // Send signature to backend
              const responseSign = await axios.post(
                `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/auth/sign`,
                {public_address: newAccounts[0], signature: signedMessage}
              );

              //set token in localstorage
              localStorage.setItem("token", responseSign.data.token);
              localStorage.setItem("account", newAccounts[0]); // Update account state in the parent component

              window.location.reload();
            }
          });

          // Subscribe to chain change events
          provider.on("chainChanged", async (newChain) => {
            if (newChain === "0x4fce") {
              readable_chain_id = `Origintrail Parachain Testnet`;
            } else if (newChain === "0x7fb") {
              readable_chain_id = "Origintrail Parachain Mainnet";
            } else {
              readable_chain_id = "Unsupported Chain";
            }

            localStorage.setItem("chain_id", readable_chain_id);
            window.location.reload();
          });
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkConnection();
  }, []);

  const handleConnect = async () => {
    try {
      setIsLoading(true);
      const provider = await detectEthereumProvider();
      if (provider && provider.request) {
        const accounts = await provider.request({
          method: "eth_requestAccounts",
        });
        const activeChainId = await provider.request({
          method: "eth_chainId",
        });

        if (accounts.length > 0) {
          const user_record = await axios.post(
            `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/auth/register`,
            {public_address: accounts[0]}
          );

          // Sign message
          const signedMessage = await handleSignMessage(
            accounts[0],
            user_record.data.user_record[0].nonce
          );

          // Send signature to backend
          const responseSign = await axios.post(
            `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/auth/sign`,
            {public_address: accounts[0], signature: signedMessage}
          );

          //set token in localstorage
          localStorage.setItem("token", responseSign.data.token);

          if (activeChainId === "0x4fce") {
            readable_chain_id = `Origintrail Parachain Testnet`;
          } else if (activeChainId === "0x7fb") {
            readable_chain_id = "Origintrail Parachain Mainnet";
          } else {
            readable_chain_id = "Unsupported Chain";
          }

          localStorage.setItem("chain_id", readable_chain_id);
          localStorage.setItem("account", accounts[0]);
          window.location.reload();
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDisconnect = () => {
    // Add code to handle disconnection or reset any necessary state
    setIsLoading(true)
    localStorage.removeItem("token", "");
    localStorage.removeItem("chain_id", "");
    localStorage.removeItem("account", "");
    window.location.reload();
  };

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
