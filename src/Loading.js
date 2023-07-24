import React from 'react'
import './css/effects/Loading.css' // Import the CSS file for styling (see Step 3)

const Loading = () => {
  return (
    <div className='loading-overlay'>
      <div className='loading-spinner'></div>
      <p className='loading-text'>Loading...</p>
    </div>
  )
}

export default Loading
