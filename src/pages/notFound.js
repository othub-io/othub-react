import React from 'react'
import '../css/notFound.css'

const notFound = () => {
  return (
    <div className='notFound'>
      {/* Render the fetched data
      {data.map(item => (
        <p key={item.id}>{item.title}</p>
      ))} */}

      <header className='notFound-header'>
        <p>notFound page</p>
      </header>
    </div>
  )
}

export default notFound
