import React, { useState, useEffect } from 'react'
import '../css/home.css'
import Loading from '../Loading'
import axios from 'axios'
let ext

ext = 'http'
if(process.env.REACT_APP_RUNTIME_HTTPS === 'true'){
  ext = 'https'
}

const Home = () => {
  const [data, setData] = useState('')

  useEffect(() => {
    async function fetchData () {
      try {
        const response = await axios.get(
          `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/home`
        )
        setData(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    setData('')
    fetchData()
  }, [])

  console.log(data)
  return (
    <div className='home'>
      {data ? (
        <header className='home-header'>
          <div className='home-form'>
            <h1>Network Statistics</h1>
            <div className='total-assets'>
              Total Assets
              <br></br>
              <div className='home-stats-info'>
                {data.pub_count}
              </div>
            </div>
            <div className='trac-spent'>
              Trac Spent
              <br></br>
              <div className='home-stats-info'>
                {data.tracSpent}
              </div>
            </div>
            <div className='assets-24h'>
              Assets 24h
              <br></br>
              <div className='home-stats-info'>{data.totalPubs_24h}</div>
            </div>
            <div className='trac-spent-24h'>
              Spent 24h
              <br></br>
              <div className='home-stats-info'>
              {data.tracSpent_24h}
              </div>
            </div>
            <div className='home-nodes'>
              Nodes
              <br></br>
              <div className='home-stats-info'>
              {data.v_nodes.length}
              </div>
            </div>
            <div className='home-total-stake'>
              Total Stake
              <br></br>
              <div className='home-stats-info'>
                {data.totalStake}
              </div>
            </div>
          </div>
        </header>
      ) :  (
        <Loading />
      )}
    </div>
  )
}

export default Home
