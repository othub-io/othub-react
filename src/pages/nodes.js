import React, { useState, useEffect } from 'react'
import '../css/nodes.css'
import Loading from '../Loading'
import axios from 'axios'
let orderby

const Nodes = () => {
  const [data, setData] = useState('')
  const isMobile = window.matchMedia('(max-width: 360px)').matches

  useEffect(() => {
    async function fetchData () {
      try {
        orderby = 'nodeStake'
        const response = await axios.get(
          `http://${process.env.REACT_APP_RUNTIME_HOST}:${process.env.REACT_APP_RUNTIME_PORT}/nodes?orderby=${orderby}`
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
    <div className='allnodes'>
      {data ? (
        <header className='allnodes-header'>
          {isMobile ? (
            <div className='allnodes-table-container'>
              <table className='allnodesTable'>
                <thead>
                  <tr>
                    <th>Node ID</th>
                    <th>Name</th>
                    <th>Stake</th>
                  </tr>
                </thead>
                <tbody>
                  {data.v_nodes.map(node => (
                    <tr key={node.nodeId}>
                      <td width='10'>{node.nodeId}</td>
                      <td>{node.tokenName}</td>
                      <td>{Number(node.nodeStake).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className='allnodes-table-container'>
              <table className='allnodesTable'>
                <thead>
                  <tr>
                    <th>Node ID</th>
                    <th>Network ID</th>
                    <th>Token Name</th>
                    <th>Token Symbol</th>
                    <th>Stake</th>
                    <th>Group</th>
                  </tr>
                </thead>
                <tbody>
                  {data.v_nodes.map(node => (
                    <tr key={node.nodeId}>
                      <td>{node.nodeId}</td>
                      <td>{node.networkId}</td>
                      <td>{node.tokenName}</td>
                      <td>{node.tokenSymbol}</td>
                      <td>{Number(node.nodeStake).toFixed(2)}</td>
                      <td>{node.nodeGroup}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </header>
      ) : (
        <Loading />
      )}
    </div>
  )
}

export default Nodes
