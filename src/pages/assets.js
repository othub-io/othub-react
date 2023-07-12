import React, { useContext, useState, useEffect } from 'react'
import '../css/assets.css'
import { AccountContext } from '../AccountContext'
import Loading from '../Loading'
import Asset from '../Asset'
import axios from 'axios'
let ext
let chain_id

ext = 'http'
if(process.env.REACT_APP_RUNTIME_HTTPS === 'true'){
  ext = 'https'
}

const Assets = () => {
  const [data, setData] = useState('')
  const { chain_id } = useContext(AccountContext)
  const [isAssetOpen, setIsAssetOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    async function fetchData () {
      try {
        const response = await axios.get(
          `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/pubs`
        )
        setData(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    setData('')
    fetchData()
  }, [])

  const openAssetPopup = (pub) => {
    setInputValue(pub)
    setIsAssetOpen(true)
  }

  const closeAssetPopup = () => {
    setIsAssetOpen(false)
  }

  console.log(data)
  return (
    <div className='assets'>
        {isAssetOpen && (
        <div className='popup-overlay'>
          <div className='popup-content'>
            <button className='close-button' onClick={closeAssetPopup}>
                    X
            </button>
            <Asset data={JSON.stringify(data.v_pubs)} chain_id={chain_id}/>
          </div>
        </div>
      )}
      {data ? (
        <header className='assets-header'>
            <div className="asset-card-container">
            {data.v_pubs.map(pub => (
                <button onClick={() => openAssetPopup(JSON.stringify(pub))} className="asset-card" key={pub.UAL}>
                    <span>ID: {pub.token_id}</span><br></br>
                    <span>Size: {pub.size}kb</span><br></br>
                    <span>Cost: {pub.token_amount.toFixed(2)} Trac</span><br></br>
                    <span>Days: {Number(pub.epochs_number) * Number(pub.epoch_length_days)}</span>
                </button>
                  ))}
            </div>
        </header>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default Assets
