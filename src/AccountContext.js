import React, { createContext, useState } from 'react'

export const AccountContext = createContext({
  account: '',
  chain_id: '',
  app_index: '',
  setAccount: () => {},
  setChain: () => {},
  setAppIndex: () => {}
})

export const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState('')
  const [chain_id, setChain] = useState('')
  const [app_index, setAppIndex] = useState(0)

  const handleSetAccount = newAccount => {
    setAccount(newAccount)
  }

  const handleSetChain = newChain => {
    setChain(newChain)
  }

  const handleSetAppIndex = appIndex => {
    setAppIndex(appIndex)
  }

  return (
    <AccountContext.Provider
      value={{
        account,
        chain_id,
        app_index,
        setAccount: handleSetAccount,
        setChain: handleSetChain,
        setAppIndex: handleSetAppIndex
      }}
    >
      {children}
    </AccountContext.Provider>
  )
}
