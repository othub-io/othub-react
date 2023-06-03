import React, { useContext } from 'react'
import '../css/settings.css'
import { AccountContext } from '../AccountContext'

const NodeSettings = () => {
  const { account, chain_id } = useContext(AccountContext)
  return (
    <div className='settings'>
      {/* Render the fetched data
      {data.map(item => (
        <p key={item.id}>{item.title}</p>
      ))} */}

      <header className='settings-header'>
        <p>settings page</p>
      </header>
    </div>
  )
}

export default NodeSettings
