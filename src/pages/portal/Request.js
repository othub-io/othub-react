import React, { useContext, useState } from 'react'
import '../../css/portal/Asset.css' // Import the CSS file for styling (see Step 3)
import { AccountContext } from '../../AccountContext'
import Loading from '../../Loading'
const { ethers } = require("ethers"); 
import { DKG } from 'dkg.js';
window.Buffer = window.Buffer || require("buffer").Buffer;


const testnet_node_options = {
  endpoint: process.env.REACT_APP_OTNODE_HOST,
  port: process.env.REACT_APP_OTNODE_TESTNET_PORT,
  useSSL: true,
  maxNumberOfRetries: 100
}

const mainnet_node_options = {
  endpoint: process.env.REACT_APP_OTNODE_HOST,
  port: process.env.REACT_APP_OTNODE_MAINNET_PORT,
  useSSL: true,
  maxNumberOfRetries: 100
}

const Request = (txn) => {
  const { chain_id, account } = useContext(AccountContext)
  const [isLoading, setIsLoading] = useState(false)
  txn = JSON.parse(txn.data)

  const handleSubmit = async (txn) => {
    try {
        console.log(txn)
        if(account.toUpperCase() !== txn.public_address.toUpperCase()){
            console.log(`${account} attempted to sign a txn meant for ${txn.public_address}`)
            return;
        }

        setIsLoading(true)
        let options
        if(txn.network === 'otp::testnet' && chain_id === 'Origintrail Parachain Testnet'){
            options = testnet_node_options
        }

        if(txn.network === 'otp::mainnet' && chain_id === 'Origintrail Parachain Mainnet'){
            options = mainnet_node_options
        }

        if(!options){
            return
        }

        let publishOptions
        console.log(txn.trac_fee)
        if(!txn.trac_fee){
            publishOptions= {
                epochsNum: txn.epochs,
                maxNumberOfRetries: 30,
                frequency: 1,
                keywords: txn.keywords,
                blockchain : {
                    name: txn.network,
                }
            }
          }else{
            publishOptions= {
                epochsNum: txn.epochs,
                maxNumberOfRetries: 30,
                frequency: 1,
                //tokenAmount: ethers.utils.parseEther(txn.trac_fee),
                keywords: txn.keywords,
                blockchain : {
                    name: txn.network,
                }
            }
          }

        let dkg_txn_data = JSON.parse(txn.txn_data);

        if(!dkg_txn_data['@context']){
            dkg_txn_data['@context'] = 'https://schema.org'
        }

        console.log(dkg_txn_data)
        console.log(publishOptions)

        window.DkgClient = new DKG(options);
        console.log("client initialized")

        await DkgClient.asset.create({
          public: dkg_txn_data,
        },publishOptions)
            .then(result => {
                console.log({ assertionId: result.assertionId, UAL: result.UAL })
                return result;
            });

        setIsLoading(false)
    } catch (error) {
      console.log(error);
    }
  };

  if (isLoading) {
    return (
      <Loading />
    )
  }

  return ( 
    <div className='request-data'>
        <div className='requested'>
            <span>Requested on {txn.created_at}</span>
        </div>
        <div className='txn'>
            <span>
                {txn.txn_id}
            </span>
        </div>
        <div className='progress'>
            <div className='progress-value'>{txn.progress}</div>
        </div>
        <div className='request-keywords'>
            <div className='request-keywords-header'>Keywords</div>
            <div className='request-keywords-value'>{txn.keywords}</div>
        </div>
        <div className='request-epochs'>
            <div className='request-epochs-header'>Epochs</div>
            <div className='request-epochs-value'>{txn.epochs}</div>
        </div>
        <div className='description'>
            <div className='description-header'>Description</div>
            <div className='description-value'>{txn.txn_description}</div>
        </div>
        <div className='data'>
            <div className='data-header'>Data</div>
            <div className='data-value'>{txn.txn_data}</div>
        </div>
        <div className='app-name'>
            <div className='app-name-header'>App Name</div>
            <div className='app-name-value'>{txn.app_name}</div>
        </div>
        <button onClick={() => handleSubmit(txn)} >
            Submit
        </button>
    </div>
  )
}

export default Request