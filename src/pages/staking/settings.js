import React, { useContext, useState, useEffect } from 'react'
import '../../css/staking/settings.css'
import { AccountContext } from '../../AccountContext'
import Loading from '../../Loading'
import axios from 'axios'
let ext

ext = 'http'
if(process.env.REACT_APP_RUNTIME_HTTPS === 'true'){
  ext = 'https'
}

const Settings = () => {
  const { account, chain_id } = useContext(AccountContext)
  const [data, setData] = useState('')
  const [isOpenTelegram, setIsOpenTelegram] = useState(false)
  const [isOpenBot, setIsOpenBot] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const isMobile = window.matchMedia('(max-width: 480px)').matches

  useEffect(() => {
    async function fetchData () {
      try {
        if (account) {
          const response = await axios.get(
            `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/staking/settings?auth=${process.env.REACT_APP_RUNTIME_AUTH}&public_address=${account}`
          )
          setData(response.data)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    setData('')
    fetchData()
  }, [account])

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
      setIsLoading(true)
      const fetchData = async () => {
        try {
          const response = await axios.get(
            `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/staking/settings?auth=${process.env.REACT_APP_RUNTIME_AUTH}&public_address=${account}&telegramID=${inputValue}`
          )
          setData(response.data)
          setIsLoading(false)
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
    setIsOpenBot(false)
    e.preventDefault()
    // Perform the POST request using the entered value
    try {
      setIsLoading(true)
      const response = await axios.get(
        `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/staking/settings?auth=${process.env.REACT_APP_RUNTIME_AUTH}&public_address=${account}&botToken=${inputValue}`
      )

      setData(response.data)
      setIsLoading(false)
    } catch (error) {
      console.error(error) // Handle the error case
    }
    setInputValue('')
    }

    const submitSettings = async () => {
        try {
            await axios.get(
                `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/staking/settings?auth=${process.env.REACT_APP_RUNTIME_AUTH}&public_address=${account}&sendScript=yes`
            )
        } catch (error) {
            console.error(error) // Handle the error case
        }
    }

  let telegramID
  let botToken

  console.log(data)
  if (data) {
    if (data.operatorRecord.toString().trim() === '') {
    } else {
      telegramID = data.operatorRecord[0].telegramID

      botToken = 'Not Set'
      if (data.operatorRecord[0].botToken) {
        botToken = data.operatorRecord[0].botToken.substring(0, 20) + '...'
      }
    }
  }

  if (!account) {
    return (
      <div className='keys'>
        <header className='keys-header'>
          Please connect your admin wallet to view your nodes.
        </header>
      </div>
    )
  }

    if (chain_id !== 'Origintrail Parachain Testnet' && chain_id !== 'Origintrail Parachain Mainnet') {
        return (
            <div className="keys">
                <header className="keys-header">
                    Connected with an unsupported chain. Please switch to Origintrail Parachain Testnet or Mainnet.
                </header>
            </div>
        )
    }

  if (isLoading) {
    return (
      <Loading />
    )
  }

  return (
    <div className='settings'>
      {isOpenTelegram && (
        <div className='popup-overlay'>
          <div className='settings-popup-content'>
            <button className='settings-close-button' onClick={closePopupTelegram}>
              X
            </button>
            <form onSubmit={handleSubmitTelegram}>
              <label>
                Enter your Telegram ID:
                <br></br>
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
          <div className='settings-popup-content'>
            <button className='settings-close-button' onClick={closePopupBotToken}>
                  X
            </button>
            <form onSubmit={handleSubmitBotToken}>
              <label>
                Enter your Bot Token:
                <br></br>
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
      {data ? (
        <header className='settings-header'>
          <div className='settings-form'>
            <h1>Alert Settings</h1>
            <div className='telegram-id'>
              Telegram ID
              <button onClick={openPopupTelegram}>
                <img
                  src='https://img.icons8.com/ios/50/000000/pencil.png'
                  alt='pencil'
                  width='12'
                  height='12'
                ></img>
              </button>
              <br></br>
              <div className='settings-info'>{telegramID}</div>
            </div>
            <div className='bot-token'>
              Bot Token
              <button onClick={openPopupBotToken}>
                <img
                  src='https://img.icons8.com/ios/50/000000/pencil.png'
                  alt='pencil'
                  width='12'
                  height='12'
                ></img>
              </button>
              <br></br>
              <div className='settings-info'>{botToken}</div>
            </div>
              <button onClick={submitSettings} className="submitSettings">
              <strong>Submit</strong>
            </button>
          </div>
          <div className='nodesTable-container'>
          {isMobile ? (
            <table className='nodesTable'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Payouts</th>
                  <th>Pending</th>
                </tr>
              </thead>
              <tbody>
                {data.nodeRecords.map(record => (
                  <tr key={record.nodeId}>
                    <td>{record.nodeId}</td>
                    <td>{record.tokenName}</td>
                    <td>{record.cumulativePayouts ? (record.cumulativePayouts.toFixed(2)) :(record.cumulativePayouts)}</td>
                    <td>{record.cumulativeEstimatedEarnings ? ((record.cumulativeEstimatedEarnings - record.cumulativePayouts).toFixed(2)) :((record.cumulativeEstimatedEarnings - record.cumulativePayouts).toFixed(2))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className='nodesTable'>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Network ID</th>
                  <th>Stake</th>
                  <th>Payouts</th>
                  <th>Pending</th>
                  <th>Ask</th>
                </tr>
              </thead>
              <tbody>
                {data.nodeRecords.map(record => (
                  <tr key={record.nodeId}>
                    <td>{record.nodeId}</td>
                    <td>{record.tokenName}</td>
                    <td>{record.networkId}</td>
                    <td>{record.nodeStake ? (record.nodeStake.toFixed(2) + ' TRAC') : (record.nodeStake  + ' TRAC')}</td>
                    <td>{record.cumulativePayouts ? (record.cumulativePayouts.toFixed(2) + ' TRAC') : (record.cumulativePayouts  + ' TRAC')}</td>
                    <td>
                    {record.cumulativeEstimatedEarnings ? ((record.cumulativeEstimatedEarnings - record.cumulativePayouts).toFixed(2)) :((record.cumulativeEstimatedEarnings - record.cumulativePayouts).toFixed(2))}
                    </td>
                    <td>{record.ask}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          </div>
        </header>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default Settings