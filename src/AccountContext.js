import React, { createContext, useState } from 'react'

export const AccountContext = createContext({
  data: '',
  account: '',
  chain_id: '',
  app_index: '',
  isRequestOpen: '',
  isCreateAppOpen: '',
  isAppSettingsOpen: '',
  isResultOpen: '',
  resultValue: '',
  setData: () => { },
  setAccount: () => {},
  setChain: () => {},
  setAppIndex: () => { },
  setIsResultOpen: () => { },
  setIsRequestOpen: () => { },
  setCreateAppPopup: () => { },
  setIsAppSettingsOpen: () => { },
  setResultValue: () => { }
})

export const AccountProvider = ({ children }) => {
  const [data, setData] = useState('')
  const [isCreateAppOpen, setCreateAppPopup] = useState(false);
  const [isAppSettingsOpen, setIsAppSettingsOpen] = useState(false);
  const [account, setAccount] = useState('')
  const [chain_id, setChain] = useState('')
  const [app_index, setAppIndex] = useState(0)
  const [isRequestOpen, setIsRequestOpen] = useState(false)
  const [isResultOpen, setIsResultOpen] = useState(false)
  const [resultValue, setResultValue] = useState('')

  const handleSetData = data => {
     setData(data)
  }

  const handleSetAccount = newAccount => {
    setAccount(newAccount)
  }

  const handleSetChain = newChain => {
    setChain(newChain)
  }

  const handleSetAppIndex = appIndex => {
    setAppIndex(appIndex)
    }

    const handleSetIsRequestOpen = isRequestOpen => {
        setIsRequestOpen(isRequestOpen)
    }

    const handleSetCreateAppPopup = isCreateAppOpen => {
        setCreateAppPopup(isCreateAppOpen)
    }

    const handleSetIsAppSettingsOpen = isAppSettingsOpen => {
        setIsAppSettingsOpen(isAppSettingsOpen)
    }

  const handleSetIsResultOpen = isResultOpen => {
      setIsResultOpen(isResultOpen)
  }

  const handleSetResultValue = resultValue => {
    setResultValue(resultValue)
  }

  return (
    <AccountContext.Provider
        value={{
        data,
        account,
        chain_id,
        app_index,
        isRequestOpen,
        isCreateAppOpen,
        isAppSettingsOpen,
        isResultOpen,
        resultValue,
        setAccount: handleSetAccount,
        setChain: handleSetChain,
        setAppIndex: handleSetAppIndex,
        setIsRequestOpen: handleSetIsRequestOpen,
        setData: handleSetData,
        setCreateAppPopup: handleSetCreateAppPopup,
        setIsAppSettingsOpen: handleSetIsAppSettingsOpen,
        setIsResultOpen: handleSetIsResultOpen,
        setResultValue: handleSetResultValue
      }}
    >
      {children}
    </AccountContext.Provider>
  )
}
