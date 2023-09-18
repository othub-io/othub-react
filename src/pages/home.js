import React, { useState, useEffect } from 'react'
import '../css/home.css'
import Loading from '../Loading'
import HomeChart from '../charts/homeChart'
import axios from 'axios'
let ext

ext = 'http'
if(process.env.REACT_APP_RUNTIME_HTTPS === 'true'){
  ext = 'https'
}

function formatNumber (number) {
  if (number >= 1000) {
    const suffixes = ['', 'K', 'M', 'B', 'T']
    const suffixIndex = Math.floor(Math.log10(number) / 3)
    const shortNumber =
      suffixIndex !== 0 ? number / Math.pow(1000, suffixIndex) : number
    const roundedNumber = Math.round(shortNumber * 10) / 10
    return (
      roundedNumber.toString().replace(/\.0$/, '') + suffixes[suffixIndex]
    )
  }
  return number.toString()
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

  let pub_count
  let totalTracSpent
  let totalPubs_24h
  let totalSpent_24h
  let avg_size
  let avg_epochs
  let avg_ask
  let avg_big
  let totalStake

  if(data){
    pub_count = formatNumber(parseFloat(data.pub_count))
    totalTracSpent =  formatNumber(parseFloat(Number(data.totalTracSpent).toFixed(2)))
    totalPubs_24h = formatNumber(parseFloat(data.v_pubs_stats_last24h[0].totalPubs))
    totalSpent_24h = formatNumber(parseFloat(data.v_pubs_stats_last24h[0].totalTracSpent).toFixed(2))
    avg_size = formatNumber(parseFloat(data.v_pubs_stats_last24h[0].avgPubSize).toFixed(0))
    avg_epochs = formatNumber(parseFloat(data.v_pubs_stats_last24h[0].avgEpochsNumber).toFixed(1))
    avg_ask = formatNumber(parseFloat(data.v_pubs_stats_last24h[0].avgPubPrice).toFixed(2))
    avg_big = formatNumber(parseFloat(data.v_pubs_stats_last24h[0].avgBid).toFixed(2))
    totalStake = formatNumber(parseFloat(Number(data.totalStake).toFixed(2)))
  }
  

  const percentage = (data.pub_count / 1000000) * 100;

  return (
    <div className='home'>
      {data ? (
        <header>
          <div className='header'>
          Network Statistics
          </div>
          <div className="bar-header">
            <div className="bar-title">
              Road to 1 Million Assets
            </div>
            <div className="bar-legend">
              500K
            </div>
            <div className="bar-legend">
              1M
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${percentage}%` }}>
                  <div className='bar-text'>
                    {pub_count}
                  </div>
                </div>
            </div>
          </div>
          <div className='home-form'>
            <div className='total-assets'>
              Total Trac Spent
              <br></br>
              <div className='home-stats-info'>
                {totalTracSpent}
              </div>
            </div>
            <div className='home-total-stake'>
              Total Stake
              <br></br>
              <div className='home-stats-info'>
                {totalStake}
              </div>
            </div>
            <div className='home-nodes'>
              Nodes
              <br></br>
              <div className='home-stats-info'>
              {data.v_nodes_length}
              </div>
            </div>
            <div className='trac-spent'>
              Assets Minted 24h
              <br></br>
              <div className='home-stats-info'>
                {totalPubs_24h}
              </div>
            </div>
            <div className='assets-24h'>
              Trac Spent 24h
              <br></br>
              <div className='home-stats-info'>{totalSpent_24h}</div>
            </div>
            <div className='trac-spent-24h'>
              Avg Asset Size
              <br></br>
              <div className='home-stats-info'>
              {avg_size}bytes
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
