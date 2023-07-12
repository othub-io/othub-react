import React, { useState, useEffect } from 'react'
import Loading from './Loading'
import './css/Asset.css' // Import the CSS file for styling (see Step 3)
import axios from 'axios'
let ext

ext = 'http'
if(process.env.REACT_APP_RUNTIME_HTTPS === 'true'){
  ext = 'https'
}

const Asset = (on_chain,chain_id) => {
  const [data, setData] = useState('')
  //on_chain = JSON.parse(on_chain)
  let dkg_data
  let payload

  useEffect(() => {
    async function fetchData () {
      try {
        console.log(`1: ${JSON.parse(on_chain)}`, `2: ${JSON.stringify(chain_id)}`)
        if(on_chain){
            payload = await axios.get(
                `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/dkg/get?ual=${on_chain.UAL}&chain=${chain_id}`
              )

            dkg_data = {
                payload: payload
            }
    
            setData(dkg_data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    setData('')
    fetchData()
  }, [])

  return ( 
    <div className='asset-data'>
        {data ? (
            <div>
                <span>Assertion ID:{on_chain.assertion_id}</span><br></br>
                <span>Keywords:{on_chain.keyword}</span><br></br>
                <span>UAL: {on_chain.UAL}</span><br></br>
                <span>Size: {on_chain.size}kb</span><br></br>
                <span>Triples: {on_chain.triples_number}</span><br></br>
                <span>Epochs: {on_chain.epochs_number}</span><br></br>
                <span>Days: {Number(on_chain.epochs_number) * Number(on_chain.epoch_length_days)}</span><br></br>
                <span>Payment: {on_chain.token_amount}</span><br></br>
                <span>Bid: {on_chain.bid}</span><br></br>
                <span>Txn Hash: {on_chain.transaction_hash}</span><br></br>
                <span>Minted: {on_chain.block_ts_hour}</span><br></br>
                <span>State: {on_chain.state}</span><br></br>
                <span>Publisher: {on_chain.from}</span><br></br>
                <span>Winners: {on_chain.winners}</span>
                <span>Payload: {data.payload}</span>
            </div>) : (<Loading />)}
    </div>
  )
}

export default Asset