import React, { useState, useEffect } from 'react'
import '../css/home.css'
import Loading from '../Loading'
import HomeChart from '../charts/homeChart'
import HomeGauge from '../charts/homeGauge'
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
        <header>
          <div className='header'>
          Network Statistics
          </div>

          <div className='home-gauge'>
              <HomeGauge data={JSON.stringify(data.totalPubs_24h)}/>
            </div>
            <div className="pub-o-meter">Pub-o-Meter</div>
            <div className="gauge-max">5,000</div>
          <div className='home-form'>
            <div className='total-assets'>
              Total Assets
              <br></br>
              <div className='home-stats-info'>
                {data.pub_count}
              </div>
            </div>
            <div className='home-total-stake'>
              Total Stake
              <br></br>
              <div className='home-stats-info'>
                {data.totalStake}
              </div>
            </div>
            <div className='home-nodes'>
              Nodes
              <br></br>
              <div className='home-stats-info'>
              {data.v_nodes.length}
              </div>
            </div>
            <div className='trac-spent'>
              Total Trac Spent
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
              Trac Spent 24h
              <br></br>
              <div className='home-stats-info'>
              {data.tracSpent_24h}
              </div>
            </div>
            <div className='home-chart'>
              <HomeChart data={JSON.stringify(data.v_pubs_stats)} width="1500" height="100"/>
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
