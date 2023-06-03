import React from 'react'
import '../css/home.css'

const home = () => {
  return (
    <div className='home'>
      {/* Render the fetched data
      {data.map(item => (
        <p key={item.id}>{item.title}</p>
      ))} */}

      <header className='home-header'>
        <p>home page</p>
      </header>
    </div>
  )
}

export default home
