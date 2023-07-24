import React, { useState, useEffect, useContext } from 'react'
import '../../css/portal/gateway.css'
import { AccountContext } from '../../AccountContext'
import Loading from '../../Loading'
import Request from './Request'
import axios from 'axios'
let ext

ext = 'http'
if(process.env.REACT_APP_RUNTIME_HTTPS === 'true'){
  ext = 'https'
}

const Gateway = () => {
  const [data, setData] = useState('')
  const { chain_id, account } = useContext(AccountContext)
  const [isRequestOpen, setIsRequestOpen] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [filterInput, setFilterInput] = useState({
    ual: '',
    app_name: '',
    order: '',
    txn_type: '',
    limit: '100'
  })

  const queryParameters = new URLSearchParams(window.location.search)

  useEffect(() => {
    async function fetchData () {
      try {
        if(account){
          const response = await axios.get(
            `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/portal/gateway?account=${account}&network=${chain_id}`
          )
          await setData(response.data)
        }

      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    setData('')
    fetchData()
  }, [account])

  if (!account) {
    return (
      <div className='keys'>
        <header className='keys-header'>
          Please connect your wallet to unlock your portal.
        </header>
      </div>
    )
  }

  const openRequestPopup = (txn) => {
    setInputValue(txn)
    setIsRequestOpen(true)
  }

  const closeRequestPopup = () => {
    setIsRequestOpen(false)
    setInputValue('')
  }

  const handleFilterInput = e => {
    const { name, value } = e.target;
    setFilterInput((filterInput) => ({
        ...filterInput,
        [name]: value,
    }));
  }

  const handleFilterSubmit = async e => {
    e.preventDefault()
    // Perform the POST request using the entered value
    try {
      const fetchFilteredData = async () => {
        try {
            console.log(filterInput)

          const response = await axios.get(
            `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/portal/gateway?ual=${filterInput.ual}&publisher=${filterInput.publisher}&nodeId=${filterInput.node_id}&order=${filterInput.order}&limit=${filterInput.limit}`
          )
          setData(response.data)
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }

      fetchFilteredData()
    } catch (error) {
      console.error(error) // Handle the error case
    }
    setData('')
  }

  return (
    <div className='gateway'>
        {isRequestOpen && (
        <div className='popup-overlay'>
          <div className='request-popup-content'>
            <button className='gateway-close-button' onClick={closeRequestPopup}>
                    X
            </button>
            <Request data={JSON.stringify(inputValue)}/>
          </div>
        </div>
      )}
      {data ? (
        <header className='gateway-header'>
            <div className="gateway-form">
                <form onSubmit={handleFilterSubmit}>
                <div>
                    UAL<br></br>
                    <input type="text" name="ual" value={filterInput.ual} onChange={handleFilterInput} maxLength='100'/>
                </div><br></br>
                <div>
                    Application Name<br></br>
                    <input type="text" name="app_name" value={filterInput.publisher} onChange={handleFilterInput} maxLength='100'/>
                </div>
                <div className="portal-limit">
                    Limit: {filterInput.limit}
                    <br></br>
                    <input
                        name="limit"
                        type="range"
                        min="0"
                        max="5000"
                        value={filterInput.limit}
                        onChange={handleFilterInput}
                        style={{ cursor: 'pointer', width: '75%' }}
                    />
                </div>
                <div className="radios">
                  Type:<br></br>
                  <input type="radio" name="txn_type" value='all' onChange={handleFilterInput} maxLength='100' checked/>All<br></br>
                    <input type="radio" name="txn_type" value='publish' onChange={handleFilterInput} maxLength='100'/>Publications<br></br>
                    <input type="radio" name="txn_type" value='update' onChange={handleFilterInput} maxLength='100'/>Updates<br></br>
                    <input type="radio" name="txn_type" value='transfer' onChange={handleFilterInput} maxLength='100'/>Transfers<br></br><br></br>
                  Status:<br></br>
                    <input type="radio" name="order" value='minted' onChange={handleFilterInput} maxLength='100'/>Minted<br></br>
                    <input type="radio" name="order" value='pending' onChange={handleFilterInput} maxLength='100'/>Pending<br></br>
                </div>
                <button type='submit'>Apply</button>
                </form>
            </div>
            <div className="recent-activity">

            </div>
            <div className="gateway-txn-container">
            {data.txn_header.map((txn) => (
                <button onClick={() => openRequestPopup(txn)} className="gateway-txn-record" key={txn.txn_id}>
                  <div>{txn.request} txn:{txn.txn_id}</div>
                    <div>{txn.progress}</div>
                    <div>Performed by {txn.app_name}</div>
                    <div>{txn.txn_description}</div>
                    <div>{txn.created_at}</div>
                </button>
                  ))}
            </div>
            <div className='gateway-stats'>
              Stats 
            </div>
        </header>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default Gateway
