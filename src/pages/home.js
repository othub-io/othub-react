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

function getReadableTime(days) {
  let remainingDays = days;

  const years = Math.floor(remainingDays / 365);
  remainingDays -= years * 365;

  const months = Math.floor(remainingDays / 30);
  remainingDays -= months * 30;

  let result = '';

  if (years > 0) {
    result += `${years}y ${years === 1 ? '' : ''}`;
  }
  if (months > 0) {
    result += `${months}mo ${months === 1 ? '' : ''} `;
  }
  if (remainingDays > 0) {
    result += `${remainingDays}d ${remainingDays === 1 ? '' : ''}`;
  }

  return result;
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
  let pub_count
  let tracSpent_24h
  let totalPubs_24h
  let tracSpent
  let totalStake

  if(data){
    pub_count = formatNumber(parseFloat(data.pub_count))
    tracSpent =  formatNumber(parseFloat(Number(data.totalTracSpent).toFixed(2)))
    totalPubs_24h = formatNumber(parseFloat(data.totalPubs))
    tracSpent_24h = formatNumber(parseFloat(data.tracSpent_24h).toFixed(2))
    totalStake = formatNumber(parseFloat(data.totalStake))
  }
  

  const percentage = (data.pub_count / 1000000) * 100;
  const startDate = new Date("2022-12-14");
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const timeSinceStartDate = getReadableTime(diffDays);

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
              Age
              <br></br>
              <div className='home-stats-info'>
                {timeSinceStartDate}
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
              {data.v_nodes.length}
              </div>
            </div>
            <div className='trac-spent'>
              Total Trac Spent
              <br></br>
              <div className='home-stats-info'>
                {tracSpent}
              </div>
            </div>
            <div className='assets-24h'>
              Assets 24h
              <br></br>
              <div className='home-stats-info'>{totalPubs_24h}</div>
            </div>
            <div className='trac-spent-24h'>
              Trac Spent 24h
              <br></br>
              <div className='home-stats-info'>
              {tracSpent_24h}
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
