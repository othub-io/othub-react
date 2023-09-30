import React, { useContext, useState, useEffect } from 'react'
import '../../css/portal/invAsset.css' // Import the CSS file for styling (see Step 3)
import { AccountContext } from '../../AccountContext'
import moment from 'moment';
import axios from "axios";
let ext;
let explorer_url

ext = "http";
if (process.env.REACT_APP_RUNTIME_HTTPS === "true") {
  ext = "https";
}

let asset_data
let sub_scan_link
let link_type

const InvAsset = (on_chain) => {
  const { chain_id } = useContext(AccountContext)
  const [assetHistory, setAssetHistory] = useState("");
  const isMobile = window.matchMedia('(max-width: 480px)').matches
  let winners
  asset_data = on_chain.data
  winners = JSON.parse(asset_data.winners)

  sub_scan_link = 'https://'
  link_type = 'origintrail'
  explorer_url = 'https://dkg.origintrail.io'

  if(chain_id === 'Origintrail Parachain Testnet'){
    link_type =  'origintrail-testnet'
    explorer_url = 'https://dkg-testnet.origintrail.io'
  }
  sub_scan_link = sub_scan_link + link_type + '.subscan.io'

  const days_to_expire = Number(asset_data.epochs_number) * Number(asset_data.epoch_length_days) * 24 * 60 * 60 * 1000

  const date = new Date(asset_data.block_ts_hour);
  const mint_date = date.getTime();
  const mint_date_fancy = new Date(mint_date).toISOString();
  const formatted_mint_date_fancy = moment.utc(mint_date_fancy).format('MM/DD/YYYY')

  const expire_date = mint_date + days_to_expire
  const expire_date_fancy = new Date(expire_date).toISOString();
  const formatted_expire_date_fancy = moment.utc(expire_date_fancy).format('MM/DD/YYYY')

  useEffect(() => {
    async function fetchData () {
      try {
        const response = await axios.get(
          `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/asset/getHistory?auth=${process.env.REACT_APP_RUNTIME_AUTH}&ual=${asset_data.UAL}&network=${chain_id}`
        )
        console.log(response.data)
        await setAssetHistory(response.data.assetHistory)

      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    setAssetHistory('')
    fetchData()
  }, [asset_data.UAL])

  const handleCopyLink = async (link) => {
    try {
      await navigator.clipboard.writeText(link); // Replace with your desired link
      console.log('Link copied to clipboard!');
    } catch (error) {
      console.log('Failed to copy link to clipboard:', error);
    }
  };

  const historyTxn = async (url) => {
    try {
        await window.open(url, '_blank');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div> 
    <div className='inv-asset-data'>
        <div className='created'>
            <span>Created on {formatted_mint_date_fancy}</span>
        </div>
        <div className='token'>
            <span>
                Asset {asset_data.token_id}
                <button onClick={() => handleCopyLink(`https://www.othub.io/portal/inventory?ual=${asset_data.UAL}`)}>
                    <img class='copy-icon' src={'https://img.icons8.com/ios/50/000000/copy.png'} alt="Copy Link" />
                </button>
            </span>
        </div>
        <div className='size'>
            <div className='size-header'>Size</div>
            <div className='size-value'>{asset_data.size}bytes</div>
        </div>
        <div className='epochs'>
            <div className='epochs-header'>Epochs</div>
            <div className='epochs-value'>{asset_data.epochs_number}</div>
        </div>
        <div className='triples'>
            <div className='triples-header'>Triples</div>
            <div className='triples-value'>{asset_data.triples_number}</div>
        </div>
        <div className='payment'>
            <div className='triples-header'>Payment</div>
            <div className='triples-value'>{asset_data.token_amount.toFixed(4)}</div>
        </div>
        <div className='bid'>
            <div className='bid-header'>Bid</div>
            <div className='bid-value'>{asset_data.bid.toFixed(4)}</div>
        </div>
        <div className='expires'>
            <div className='expires-header'>Expires</div>
            <div className='expires-value'>{formatted_expire_date_fancy}</div>
        </div>
        <div className='meta-data'>
            <div className='ual'>
                <div className='ual-header'>UAL</div>
                <div className='ual-value'><a href={`${explorer_url}/explore?ual=${asset_data.UAL}`} target='_blank' rel="noreferrer">{asset_data.UAL}</a></div>
            </div>
            <div className='state'>
                <div className='state-header'>State</div>
                <div className='state-value'>{asset_data.state}</div>
            </div>
            <div className='txn-hash'>
                <div className='txn-hash-header'>Txn Hash</div>
                <div className='txn-hash-value'><a href={sub_scan_link+'/tx/'+ asset_data.transaction_hash} target='_blank' rel="noreferrer">{asset_data.transaction_hash}</a></div>
            </div>
            <div className='keywords'>
                <div className='keywords-header'>Keywords</div>
                <div className='keywords-value'>{asset_data.keyword}</div>
            </div>
            <div className='publisher'>
                <div className='publisher-header'>Publisher</div>
                <div className='publisher-value'><a href={`${explorer_url}/profile?wallet=${asset_data.publisher}`} target='_blank' rel="noreferrer">{asset_data.publisher}</a></div>
            </div>
        </div>
        <div className='winning-nodes'>
            <span>Winning Nodes</span>
        </div>
        {winners ? (<div>{winners.map((group, index) => (
            <div className='winners' key={index}>
                <div className='winners-header'>Epoch {index}</div>
                <div className='winners-value'>{group.winners}</div>
            </div>
        ))}</div>) : (<div></div>)}
    </div>
        <div className="inv-asset-history" style={({display: isMobile ? "none" : "block"})}>
            {assetHistory && !isMobile ? (<div>{assetHistory.map((event, index) => (
                <div className='event-list-item' key={index} onClick={() => historyTxn(sub_scan_link+'/tx/'+ event.transaction_hash)}>
                    <div className='event-timestamp'>{event.updated_at}</div>
                    <div className='event-name'>{event.event} for {event.minted_epochs_number} epoch(s)</div>
                    <div className='event-cost'>Costing {event.minted_token_amount / 1000000000000000000} TRAC</div>
                </div>
            ))}</div>) : (<div></div>)}
        </div>
    </div>
    
  )
}

export default InvAsset