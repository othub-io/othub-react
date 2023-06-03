import React, { useContext, useState, useEffect } from 'react'
import '../css/settings.css'
import { AccountContext } from '../AccountContext'
import axios from 'axios'

const NodeSettings = async () => {
  const { account } = useContext(AccountContext)
  const [data, setData] = useState('')
  const [isOpenTelegram, setIsOpenTelegram] = useState(false)
  const [isOpenBot, setIsOpenBot] = useState(false)
  const [inputValue, setInputValue] = useState('')

  await useEffect(async () => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9009/myNodes/settings?admin_key=${account}`
        )
        setData(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    await fetchData()
  }, [account])

  let telegramID
  let botToken
  console.log(data.operatorRecord[0])

  const openPopupTelegram = () => {
    setIsOpenTelegram(true)
  }

  const closePopupTelegram = () => {
    setIsOpenTelegram(false)
  }

  const handleInputChangeTelegram = e => {
    setInputValue(e.target.value)
  }

  const handleSubmitTelegram = async e => {
    e.preventDefault()
    // Perform the POST request using the entered value
    try {
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `http://localhost:9009/myNodes/settings?admin_key=${account}&telegramID=${inputValue}`
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
    setIsOpenTelegram(false)
    setInputValue('')
  }

  const openPopupBotToken = () => {
    setIsOpenBot(true)
  }

  const closePopupBotToken = () => {
    setIsOpenBot(false)
  }

  const handleInputChangeBotToken = e => {
    setInputValue(e.target.value)
  }

  const handleSubmitBotToken = async e => {
    e.preventDefault()
    // Perform the POST request using the entered value
    try {
      const response = await axios.get(
        `http://localhost:9009/myNodes/settings?admin_key=${account}&botToken=${inputValue}`
      )

      setData(response.data)
    } catch (error) {
      console.error(error) // Handle the error case
    }
    setIsOpenBot(false)
    setInputValue('')
  }

  //console.log(data.operatorRecord[0].telegramID)
  return (
    <div className='settings'>
      <header className='settings-header'>
        <div className='settings-form'>
          <h1>Account Settings</h1>
          <span className='telegram-id'>
            Telegram ID:
            <button onClick={openPopupTelegram}>
              <img
                src='https://img.icons8.com/ios/50/000000/pencil.png'
                alt='pencil'
                width='15'
                height='15'
              ></img>
            </button>
            <br></br>
            <span className='setting-info'>{telegramID}</span>
          </span>
          <span className='bot-token'>
            Bot Token:
            <button onClick={openPopupBotToken}>
              <img
                src='https://img.icons8.com/ios/50/000000/pencil.png'
                alt='pencil'
                width='15'
                height='15'
              ></img>
            </button>
            <br></br>
            <span className='setting-info'>{botToken}</span>
          </span>
          {isOpenTelegram && (
            <div className='popup-overlay'>
              <div className='popup-content'>
                <button className='close-button' onClick={closePopupTelegram}>
                  X
                </button>
                <form onSubmit={handleSubmitTelegram}>
                  <label>
                    Enter your Telegram ID:
                    <input
                      type='text'
                      value={inputValue}
                      onChange={handleInputChangeTelegram}
                      maxLength='50'
                    />
                  </label>
                  <button type='submit'>Apply</button>
                </form>
              </div>
            </div>
          )}
          {isOpenBot && (
            <div className='popup-overlay'>
              <div className='popup-content'>
                <button className='close-button' onClick={closePopupBotToken}>
                  X
                </button>
                <form onSubmit={handleSubmitBotToken}>
                  <label>
                    Enter your Bot Token:
                    <input
                      type='text'
                      value={inputValue}
                      onChange={handleInputChangeBotToken}
                      maxLength='50'
                    />
                  </label>
                  <button type='submit'>Apply</button>
                </form>
              </div>
            </div>
          )}
        </div>
        {data ? (
          <table className='nodesTable'>
            <thead>
              <tr>
                <th>Network ID</th>
                <th>Name</th>
                <th>Symbol</th>
                <th>Stake</th>
                <th>Payouts</th>
                <th>Pending</th>
                <th>Ask</th>
              </tr>
            </thead>
            <tbody>
              {data.nodeRecords.map(record => (
                <tr key={record.networkId}>
                  <td>{record.networkId}</td>
                  <td>{record.tokenName}</td>
                  <td>{record.tokenSymbol}</td>
                  <td>{record.nodeStake.toFixed(2) + ' TRAC'}</td>
                  <td>{record.cumulativePayouts.toFixed(2) + ' TRAC'}</td>
                  <td>
                    {record.cumulativeEstimatedEarnings.toFixed(2) + ' TRAC'}
                  </td>
                  <td>{record.Ask}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Loading data...</p>
        )}
      </header>
    </div>
  )
}

export default NodeSettings
