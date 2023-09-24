import React from 'react'
import './css/effects/Loading.css' // Import the CSS file for styling (see Step 3)

const Loading = (data) => {
    let text = 'Loading...'
    if (JSON.stringify(data) !== '{}') {
        text = data.data
    }
  return (
    <div className='loading-overlay'>
      <div className='loading-spinner'></div>
          <p className='loading-text'>{text}</p>
    </div>
  )
}

export default Loading
