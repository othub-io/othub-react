import React, { useContext, useState, useEffect } from 'react'
import '../../css/keys.css'
import { AccountContext } from '../../AccountContext'
import Loading from '../../Loading'
import axios from 'axios'
let ext

ext = 'http'
if(process.env.REACT_APP_RUNTIME_HTTPS === 'true'){
  ext = 'https'
}

const Keys = () => {
  const { account } = useContext(AccountContext)
  const [data, setData] = useState('')
  const [isOpenDeleteKey, setIsDeleteKey] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const isMobile = window.matchMedia('(max-width: 480px)').matches

  useEffect(() => {
    async function fetchData () {
      try {
        if (account) {
          const response = await axios.get(
            `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/api/keys?admin_key=${account}`
          )
          console.log(response.data)
          setData(response.data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    setData('')
    fetchData()
  }, [account])

  const handleInputCreateKey = e => {
    setInputValue(e.target.value)
  }

  const handleCreateKey = async e => {
    e.preventDefault()
    // Perform the POST request using the entered value
    try {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/api/keys?admin_key=${account}&app_name=${inputValue}`
          )
          setData(response.data)
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }

      fetchData()
    } catch (error) {
      console.error(error) // Handle the error case
    }
    setInputValue('')
  }

  const openPopupDeleteKey = (api_key) => {
    setInputValue(api_key)
    setIsDeleteKey(true)
  }

  const closePopupDeleteKey = () => {
    setIsDeleteKey(false)
  }

  const handleDeleteKey = async e => {
    e.preventDefault()
    // Perform the POST request using the entered value
    try {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/api/keys?admin_key=${account}&deleteKey=${inputValue}`
          )
          setData(response.data)
        } catch (error) {
          console.error('Error fetching data:', error)
        }
      }

      fetchData()
      setIsDeleteKey(false)
      setInputValue('')

    } catch (error) {
      console.error(error) // Handle the error case
    }
  }

  if (!account) {
    return (
      <div className='keys'>
        <header className='keys-header'>
          Please connect your wallet to view your API keys.
        </header>
      </div>
    )
  }

  if (isMobile) {
    return (
      <div className='keys'>
        <header className='keys-header'>
          This page does not support Mobile.
        </header>
      </div>
    )
  }

  return (
    <div className='keys'>
      {isOpenDeleteKey && (
        <div className='popup-overlay'>
          <div className='keys-popup-content'>
            <button className='keys-close-button' onClick={closePopupDeleteKey}>
              X
            </button>
            <form onSubmit={handleDeleteKey}>
              <label>
                Are you sure you want to delete this key?
              </label>
              <button type='submit'>Yes</button>
            </form>
          </div>
        </div>
      )}
      {data ? (
        <header>
          <div className='keys-header1'>
          <div className="container">
          Basic Access:
          <br></br>
            <div className="box">Rate:<br></br>Up to 1 API Key<br></br>1 request per 30m</div>
            <div className="box">Networks:<br></br>OTP Testnet #soon<br></br>OTP Mainnet</div>
          </div>
          <div className="container2">
          Premium Access:
          <br></br>
            <div className="box2">Rate:<br></br>Up to 2 API Key<br></br>1 request per 1s</div>
            <div className="box2">Networks:<br></br>OTP Testnet #soon<br></br>OTP Mainnet</div>
          </div>
            <div className='create-form'>
              <div className='key-text'>
                Active Keys:
                <br></br>
                {data.userRecords.length}
              </div>
              <form onSubmit={handleCreateKey} className='app-text'>
                <label>
                  Application Name:
                  <input
                    type='text'
                    value={inputValue}
                    onChange={handleInputCreateKey}
                    maxLength='20'
                    required
                  />
                </label>
                <button type='submit'>Create Key</button>
              </form>
              <div className='msg-text'>
                {data.msg}
              </div>
            </div>
          </div>
          <div className='keys-header2'>
            Documentation:
            <br></br>
            <a href="https://www.postman.com/crimson-crescent-721757/workspace/othub-api/overview" target='_blank' rel="noreferrer">Postman Workspace</a>
          </div>
          <div className='keys-header3'>
            <div className='bug'>
              Find a bug?
              <br></br>
              <a href="https://github.com/othub-io/othub-api" target='_blank' rel="noreferrer">Github issue</a>
            </div>
            <div className='help'>
              Need some help?
              <br></br>
              <a href="https://t.me/OriginTrailClub" target='_blank' rel="noreferrer">Join Our Telegram</a>
            </div>
          </div>
          {isMobile ? (
            <div>
              Mobile not supported.
            </div>
          ) : (
            <table className='keysTable'>
              <thead>
                <tr>
                  <th>Application</th>
                  <th>API Token</th>
                  <th>Access</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.userRecords.map(record => (
                  <tr key={record.api_key}>
                    <td>{record.app_name}</td>
                    <td>{record.api_key}</td>
                    <td>{record.access}</td>
                    <td>
                      <button onClick={() => openPopupDeleteKey(record.api_key)}>
                        <img alt='trashcan' src="https://img.icons8.com/material-rounded/24/000000/trash.png"/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </header>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default Keys
