import React, { useContext } from 'react'
import '../css/NavBar.css'
import { AccountContext } from '../AccountContext'
import MetamaskButton from './MetamaskButton'
let front_admin_key
let back_admin_key
let addr
let chain

function NavBar () {
  const { account, chain_id } = useContext(AccountContext)
  const isMobile = window.matchMedia('(max-width: 360px)').matches

  if (account) {
    front_admin_key = account.substring(0, 6)
    back_admin_key = account.substring(account.length - 6)
    addr = `[ ${front_admin_key}...${back_admin_key} ]`
    chain = `[ ${chain_id} ]`
  }

  const connectionStyle = {
    color: chain_id === 'Unsupported Chain' ? 'red' : '#13B785',
    fontSize: '20px',

    ...(isMobile && {
      fontSize: '12px'
    })
  }

  return (
    <nav>
      <div className='navbar'>
        <h1>
          <a href='/' className='logo-text'>
            otnode.io
          </a>
        </h1>
        {account ? (
          <div className='connection-info'>
            <span style={connectionStyle}>{addr}</span>
            <br></br>
            <span style={connectionStyle}>{chain}</span>
          </div>
        ) : (
          <div></div>
        )}
        <MetamaskButton />
      </div>
    </nav>
  )
}

export default NavBar
