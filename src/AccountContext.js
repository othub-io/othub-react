import React, { createContext, useState } from 'react'

export const AccountContext = createContext({
  account: '',
  chain: '',
  setAccount: () => {},
  setChain: () => {}
})

export const AccountProvider = ({ children }) => {
  const [account, setAccount] = useState('')
  const [chain_id, setChain] = useState('')

  const handleSetAccount = newAccount => {
    setAccount(newAccount)
  }

  const handleSetChain = newChain => {
    setChain(newChain)
  }

  return (
    <AccountContext.Provider
      value={{
        account,
        chain_id,
        setAccount: handleSetAccount,
        setChain: handleSetChain
      }}
    >
      {children}
    </AccountContext.Provider>
  )
}
