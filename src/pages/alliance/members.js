import React, { useContext, useState, useEffect } from 'react'
import '../../css/members.css'
import { AccountContext } from '../../AccountContext'
import Loading from '../../Loading'
import axios from 'axios'
let ext

ext = 'http'
if(process.env.REACT_APP_RUNTIME_HTTPS === 'true'){
  ext = 'https'
}

const AllianceMembers = () => {
  const { account } = useContext(AccountContext)
  const [data, setData] = useState('')
  const isMobile = window.matchMedia('(max-width: 600px)').matches

  useEffect(() => {
    async function fetchData () {
      try {
        const response = await axios.get(
          `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/alliance/members`
        )
        setData(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    setData('')
    fetchData()
  }, [])

  const LeaveAlliance = async () => {
    try {
      setData('')
      const response = await axios.get(
        `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/alliance/members?admin_key=${account}&group=Solo`
      )
      setData(response.data)
    } catch (error) {
      console.error(error) // Handle the error case
    }
  }

  const JoinAlliance = async () => {
    try {
      setData('')
      const response = await axios.get(
        `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/alliance/members?admin_key=${account}&group=Alliance`
      )

      setData(response.data)
    } catch (error) {
      console.error(error) // Handle the error case
    }
  }

  let allianceNodes
  let allianceOperators
  let allianceStats
  let v_nodes
  let nodeCount
  let totalNodes
  let alliance

  if (data) {
    allianceNodes = data.allianceNodes
    allianceOperators = data.allianceOperators
    allianceStats = data.allianceStats
    v_nodes = data.v_nodes

    nodeCount = Number(allianceNodes.length)
    totalNodes = Number(v_nodes.length)

    alliance = allianceOperators.filter(obj => obj.adminKey === account)[0]
  }

  console.log(data)
  return (
    <div className='alliance-members'>
      {data && data.allianceNodes.toString().trim() !== '' ? (
        <header className='alliance-members-header'>
          <div className='alliance-members-form'>
            <h1>Alliance KPIs</h1>
            <div className='min-ask'>
              Minimum Ask
              <br></br>
              <div className='alliance-members-info'>
                {process.env.REACT_APP_MINIMUM_ASK}
              </div>
            </div>
            <div className='avg-ask'>
              Avg Ask
              <br></br>
              <div className='alliance-members-info'>
                {allianceStats.avgAsk.toFixed(2)}
              </div>
            </div>
            <div className='nodes'>
              Nodes
              <br></br>
              <div className='alliance-members-info'>{nodeCount}</div>
            </div>
            <div className='participation'>
              Participation
              <br></br>
              <div className='alliance-members-info'>
                {((nodeCount / totalNodes) * 100).toFixed(2)}%
              </div>
            </div>
            <div className='avg-stake'>
              Avg Stake
              <br></br>
              <div className='alliance-members-info'>
                {allianceStats.avgStake}
              </div>
            </div>
            <div className='total-stake'>
              Total Stake
              <br></br>
              <div className='alliance-members-info'>
                {allianceStats.totalStake}
              </div>
            </div>
            {alliance ? (
              <div>
                <div className='star-alliance'>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
                    <polygon
                      fill='gold'
                      points='256,8 314.395,195.472 503.526,186.513 354.931,301.528 413.326,489 256,396.542 98.674,489 157.069,301.528 8.474,186.513 197.605,195.472'
                    />
                  </svg>
                </div>
                <button
                  onClick={LeaveAlliance}
                  className='leave-button-alliance'
                >
                  Leave Alliance
                </button>
              </div>
            ) : !isMobile && account ? (
              <button onClick={JoinAlliance} className='join-button-alliance'>
                Join Alliance
              </button>
            ) : (
              <div></div>
            )}
          </div>
          <div className='alliance-table-container'>
            {isMobile ? (
              <table className='membersTable'>
                <thead>
                  <tr>
                    <th>Node ID</th>
                    <th>Name</th>
                    <th>Stake</th>
                  </tr>
                </thead>
                <tbody>
                  {data.allianceNodes.map(record => (
                    <tr key={record.nodeId}>
                      <td>{record.nodeId}</td>
                      <td>{record.tokenName}</td>
                      <td>{record.nodeStake.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className='membersTable'>
                <thead>
                  <tr>
                    <th>Node ID</th>
                    <th>Name</th>
                    <th>Network ID</th>
                    <th>Stake</th>
                    <th>Ask</th>
                  </tr>
                </thead>
                <tbody>
                  {data.allianceNodes.map(record => (
                    <tr key={record.nodeId}>
                      <td>{record.nodeId}</td>
                      <td>{record.tokenName}</td>
                      <td>{record.networkId}</td>
                      <td>{record.nodeStake.toFixed(2)}</td>
                      <td>{record.nodeAsk}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </header>
      ) : data && data.allianceNodes.toString().trim() === '' ? (
        <header className='alliance-members-header'>
          <div className='alliance-members-form'>
            <h1>Alliance KPIs</h1>
            <div className='min-ask'>
              Minimum Ask
              <br></br>
              <div className='alliance-members-info'></div>
            </div>
            <div className='avg-ask'>
              Avg Ask
              <br></br>
              <div className='alliance-members-info'></div>
            </div>
            <div className='nodes'>
              Nodes
              <br></br>
              <div className='alliance-members-info'></div>
            </div>
            <div className='participation'>
              Participation
              <br></br>
              <div className='alliance-members-info'></div>
            </div>
            <div className='avg-stake'>
              Avg Stake
              <br></br>
              <div className='alliance-members-info'></div>
            </div>
            <div className='total-stake'>
              Total Stake
              <br></br>
              <div className='alliance-members-info'></div>
            </div>
            {alliance ? (
              <div>
                <div className='star-alliance'>
                  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
                    <polygon
                      fill='gold'
                      points='256,8 314.395,195.472 503.526,186.513 354.931,301.528 413.326,489 256,396.542 98.674,489 157.069,301.528 8.474,186.513 197.605,195.472'
                    />
                  </svg>
                </div>
                <button
                  onClick={LeaveAlliance}
                  className='leave-button-alliance'
                >
                  Leave Alliance
                </button>
              </div>
            ) : !isMobile ? (
              <button onClick={JoinAlliance} className='join-button-alliance'>
                Join Alliance
              </button>
            ) : (
              <div></div>
            )}
          </div>
          <div className='alliance-table-container'>
            {isMobile ? (
              <table className='membersTable'>
                <thead>
                  <tr>
                    <th>Node ID</th>
                    <th>Name</th>
                    <th>Stake</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            ) : (
              <table className='membersTable'>
                <thead>
                  <tr>
                    <th>Node ID</th>
                    <th>Name</th>
                    <th>Network ID</th>
                    <th>Stake</th>
                    <th>Ask</th>
                  </tr>
                </thead>
                <tbody></tbody>
              </table>
            )}
          </div>
        </header>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default AllianceMembers
