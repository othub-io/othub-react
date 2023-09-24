import React, { useState, useEffect, useContext } from 'react'
import { AccountContext } from '../AccountContext'
import detectEthereumProvider from '@metamask/detect-provider'
import '../css/navigation/metamaskButton.css'
import axios from 'axios'
let readable_chain_id
let url

const MetamaskButton = () => {
  const { setAccount, setChain, setIsLoading, setBalance,account} = useContext(AccountContext)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const checkConnection = async () => {
      try {
        const provider = await detectEthereumProvider()
        // Metamask is installed
        if (provider.request) {
          const accounts = await provider.request({ method: 'eth_accounts' })
          const activeChainId = await provider.request({
            method: 'eth_chainId'
          })

          if (accounts.length > 0) {
            setIsConnected(true)
            setAccount(accounts[0])

            if (activeChainId === '0x4fce') {
              readable_chain_id = `Origintrail Parachain Testnet`
            } else if (activeChainId === '0x7fb') {
              readable_chain_id = 'Origintrail Parachain Mainnet'
            } else {
              readable_chain_id = 'Unsupported Chain'
            }

            setChain(readable_chain_id)
          } else {
            setAccount('')
            setChain('')
          }

          // Subscribe to account change events
          provider.on('accountsChanged', async newAccounts => {
            if (newAccounts.length > 0) {
              setAccount(newAccounts[0]) // Update account state in the parent component
            } else {
              // No accounts available, handle the case if needed
            }
            setIsLoading(true)

            // if (readable_chain_id === "Origintrail Parachain Testnet") {
            //   url = "https://origintrail-testnet.subscan.io";
            // }
  
            // if (readable_chain_id === "Origintrail Parachain Mainnet") {
            //   url = "https://origintrail.api.subscan.io";
            // }
    
            // const config = {
            //   method: "post",
            //   url: url+'/api/scan/evm/account/tokens', 
            //   headers: {
            //     "Content-Type": "application/json",
            //     "X-API-Key": process.env.REACT_APP_SUBSCAN_KEY
            //   },
            //   data: {
            //     "address": newAccounts[0]
            //   }, 
            // };
    
            // const account_balance = axios(config)
            //   .then(function (response) {
            //     // Handle the successful response here
            //     return response.data;
            //   })
            //   .catch(function (error) {
            //     // Handle errors here
            //     console.error(error);
            //   });
    
            // setBalance(account_balance.data);

            await window.location.reload();
          })

          // Subscribe to chain change events
          provider.on('chainChanged', async newChain => {
            if (newChain === '0x4fce') {
              readable_chain_id = `Origintrail Parachain Testnet`
            } else if (newChain === '0x7fb') {
              readable_chain_id = 'Origintrail Parachain Mainnet'
            } else {
              readable_chain_id = 'Unsupported Chain'
            }

            setChain(readable_chain_id)
            setIsLoading(true)

            // if (readable_chain_id === "Origintrail Parachain Testnet") {
            //   url = "https://origintrail-testnet.subscan.io";
            // }
  
            // if (readable_chain_id === "Origintrail Parachain Mainnet") {
            //   url = "https://origintrail.api.subscan.io";
            // }
    
            // const config = {
            //   method: "post",
            //   url: url+'/api/scan/evm/account/tokens', 
            //   headers: {
            //     "Content-Type": "application/json",
            //     "X-API-Key": process.env.REACT_APP_SUBSCAN_KEY
            //   },
            //   data: {
            //     "address": account
            //   }, 
            // };
    
            // const account_balance = axios(config)
            //   .then(function (response) {
            //     // Handle the successful response here
            //     return response.data;
            //   })
            //   .catch(function (error) {
            //     // Handle errors here
            //     console.error(error);
            //   });
    
            // setBalance(account_balance.data);

            window.location.reload();
          })
        } else {
          // Metamask is not installed
          console.log('Metamask is not installed')
        }
      } catch (error) {
        console.error(error)
      }
    }

    checkConnection()
  }, [])

  const handleConnect = async () => {
    try {
      const provider = await detectEthereumProvider()
      if (provider && provider.request) {
        const accounts = await provider.request({
          method: 'eth_requestAccounts'
        })
        const activeChainId = await provider.request({
          method: 'eth_chainId'
        })

        if (accounts.length > 0) {
          setIsConnected(true)
          setAccount(accounts[0])
          setIsLoading(true)

          if (activeChainId === '0x4fce') {
            readable_chain_id = `Origintrail Parachain Testnet`
          } else if (activeChainId === '0x7fb') {
            readable_chain_id = 'Origintrail Parachain Mainnet'
          } else {
            readable_chain_id = 'Unsupported Chain'
          }

          // if (readable_chain_id === "Origintrail Parachain Testnet") {
          //   url = "https://origintrail-testnet.subscan.io";
          // }

          // if (readable_chain_id === "Origintrail Parachain Mainnet") {
          //   url = "https://origintrail.api.subscan.io";
          // }
  
          // const config = {
          //   method: "post",
          //   url: url+'/api/scan/evm/account/tokens', 
          //   headers: {
          //     "Content-Type": "application/json",
          //     "X-API-Key": process.env.REACT_APP_SUBSCAN_KEY
          //   },
          //   data: {
          //     "address": accounts[0]
          //   }, 
          // };
  
          // const account_balance = axios(config)
          //   .then(function (response) {
          //     // Handle the successful response here
          //     return response.data;
          //   })
          //   .catch(function (error) {
          //     // Handle errors here
          //     console.error(error);
          //   });
  
          // setBalance(account_balance.data);

          setChain(readable_chain_id)
        }
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleDisconnect = () => {
    setIsConnected(false)
    // Add code to handle disconnection or reset any necessary state
    setAccount('')
    setChain('')
  }

  return (
    <div>
      {isConnected ? (
        <button className='connectWalletButton' onClick={handleDisconnect}>
          Disconnect
        </button>
      ) : (
        <button className='connectWalletButton' onClick={handleConnect}>
          Connect
        </button>
      )}
    </div>
  )
}

export default MetamaskButton
