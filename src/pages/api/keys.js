import React, { useContext, useState, useEffect } from 'react'
import '../../css/keys.css'
import { AccountContext } from '../../AccountContext'
import Loading from '../../Loading'
import axios from 'axios'

const Keys = () => {
  const { account } = useContext(AccountContext)
  const [data, setData] = useState('')
  const [isOpenDeleteKey, setIsDeleteKey] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const isMobile = window.matchMedia('(max-width: 360px)').matches

  useEffect(() => {
    async function fetchData () {
      try {
        if (account) {
          const response = await axios.get(
            `http://${process.env.REACT_APP_RUNTIME_HOST}:${process.env.REACT_APP_RUNTIME_PORT}/api/keys?admin_key=${account}`
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
            `http://${process.env.REACT_APP_RUNTIME_HOST}:${process.env.REACT_APP_RUNTIME_PORT}/api/keys?admin_key=${account}&app_name=${inputValue}`
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

  const openPopupDeleteKey = () => {
    setIsDeleteKey(true)
  }

  const closePopupDeleteKey = () => {
    setIsDeleteKey(false)
  }

  const handleInputDeleteKey = e => {
    setInputValue(e.target.value)
  }

  const handleDeleteKey = async e => {
    e.preventDefault()
    // Perform the POST request using the entered value
    try {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `http://${process.env.REACT_APP_RUNTIME_HOST}:${process.env.REACT_APP_RUNTIME_PORT}/api/keys?admin_key=${account}&deleteKey=${inputValue}`
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
    setIsDeleteKey(false)
    setInputValue('')
  }

  if (!account) {
    return (
      <div className='keys'>
        <header className='settings-header'>
          Please connect your wallet to view your API keys.
        </header>
      </div>
    )
  }

  return (
    <div className='keys'>
      {isOpenDeleteKey && (
        <div className='popup-overlay'>
          <div className='popup-content'>
            <button className='close-button' onClick={closePopupDeleteKey}>
              X
            </button>
            <form onSubmit={handleDeleteKey}>
              <label>
                Are you sure you want to delete this key?
                <input
                  type='text'
                  value={inputValue}
                  onChange={handleInputDeleteKey}
                  maxLength='50'
                />
              </label>
              <button type='submit'>Yes</button>
            </form>
          </div>
        </div>
      )}
      {data ? (
        <header>
          <div className='keys-header1'>
            <h1>Your API Key</h1>
            <div className='create-form'>
              <form onSubmit={handleCreateKey}>
                <label>
                  Application Name:
                  <input
                    type='text'
                    value={inputValue}
                    onChange={handleInputCreateKey}
                    maxLength='20'
                  />
                </label>
                <button type='submit'>Create Key</button>
              </form>
            </div>
          </div>
          <div className='keys-header2'></div>
          <div className='keys-header3'></div>
          {isMobile ? (
            <table className='keysTable'>
              <thead>
                <tr>
                  <th>Application</th>
                  <th>API Token</th>
                  <th>Access</th>
                </tr>
              </thead>
              <tbody>
                {data.userRecords.map(record => (
                  <tr key={record.nodeId}>
                    <td>{record.app_name}</td>
                    <td>{record.api_key}</td>
                    <td>{record.access}</td>
                    <td>
                      <button
                        className='close-button'
                        onClick={openPopupDeleteKey}
                        value={record.api_key}
                      >
                        X
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className='keysTable'>
              <thead>
                <tr>
                  <th>Application</th>
                  <th>API Token</th>
                  <th>Access</th>
                </tr>
              </thead>
              <tbody>
                {data.userRecords.map(record => (
                  <tr key={record.nodeId}>
                    <td>{record.app_name}</td>
                    <td>{record.api_key}</td>
                    <td>{record.access}</td>
                    <td>
                      <button
                        className='close-button'
                        onClick={openPopupDeleteKey}
                        value={record.api_key}
                      >
                        X
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
