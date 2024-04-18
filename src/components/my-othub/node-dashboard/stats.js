import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import Loading from "../../effects/Loading";

function formatNumberWithSpaces(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const Stats = (settings) => {
  const [stats24h, setStats24h] = useState("");
  const [statsLatest, setStatsLatest] = useState("");
  const [price, setPrice] = useState("");
  let pubs_commited = 0
  let pubs_commited_24h = 0
  let earnings = 0
  let earnings_24h = 0
  let payouts = 0
  let payouts_24h = 0
  let totalStake = 0
  let nodes = 0
  let chain_data = [];

  useEffect(() => {
    async function fetchData() {
      try {
        setStats24h(settings.data[0].nodeStats24h);
        setStatsLatest(settings.data[0].nodeStatsLatest);

        const rsp = await axios.get(
            "https://api.coingecko.com/api/v3/coins/origintrail"
          );
  
        if(settings.data[0].network === 'DKG Mainnet'){
            const rsp = await axios.get(
                "https://api.coingecko.com/api/v3/coins/origintrail"
              );
              setPrice(rsp.data.market_data.current_price.usd);
        }else{
            setPrice(0.000000001)
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [settings]);

  if(statsLatest && stats24h){
    for(let a = 0; a < statsLatest.length; a++){
      let chain_pubs = 0
      let chain_earnings = 0
      let chain_payouts = 0
      let chain_stake = 0
      let chain_nodes = 0
      let chain_pubs_commited_24h = 0
      let chain_earnings_24h = 0
      let chain_payouts_24h = 0

      for(let b = 0; b < statsLatest[a].data.length; b++){
        pubs_commited = pubs_commited + statsLatest[a].data[b].pubsCommited
        chain_pubs = chain_pubs + statsLatest[a].data[b].pubsCommited

        earnings = earnings + statsLatest[a].data[b].estimatedEarnings
        chain_earnings = chain_earnings + statsLatest[a].data[b].estimatedEarnings

        payouts = payouts + Number(statsLatest[a].data[b].cumulativePayouts)
        chain_payouts = chain_payouts + Number(statsLatest[a].data[b].cumulativePayouts)

        totalStake = totalStake + Number(statsLatest[a].data[b].nodeStake)
        chain_stake = chain_stake + Number(statsLatest[a].data[b].nodeStake)

        nodes = nodes + 1
        chain_nodes = chain_nodes + 1

        pubs_commited_24h = pubs_commited_24h + stats24h[a].data[b].pubsCommited
        chain_pubs_commited_24h = chain_pubs_commited_24h + stats24h[a].data[b].pubsCommited

        earnings_24h = earnings_24h + stats24h[a].data[b].estimatedEarnings
        chain_earnings_24h = chain_earnings_24h + stats24h[a].data[b].estimatedEarnings

        payouts_24h = payouts_24h + Number(stats24h[a].data[b].cumulativePayouts)
        chain_payouts_24h = chain_payouts_24h + Number(stats24h[a].data[b].cumulativePayouts)
      }

      let chain_obj ={
        blockchain_name: statsLatest[a].blockchain_name,
        blockchain_id: statsLatest[a].blockchain_id,
        pubsCommited: chain_pubs,
        earnings: chain_earnings,
        payouts: chain_payouts,
        totalStake: chain_stake,
        nodes: chain_nodes,
        pubsCommited_24h: chain_pubs_commited_24h,
        earnings_24h: chain_earnings_24h,
        payouts_24h: chain_payouts_24h
      }

      chain_data.push(chain_obj)
    }
  }

  return stats24h && statsLatest ? (
    <div className="node-stats">
       {!settings.data[0].nodeSelected && !settings.data[0].blockchain && <div key="total_stats" className={`total-stats-node-div`}>
            <div className="chain-logo">
                <img
                src={`${process.env.REACT_APP_API_HOST}/images?src=origintrail_logo-dark_purple.png`}
                alt="Origintrail Network"
                width="100"
                ></img><span>{settings.data[0].network.substring(4)}</span>
            </div>
            <div className="chain-assets">
                Active Nodes:<br/>
                <span>{nodes}</span>
            </div>
            <div className="chain-stake">
                Total Pubs:<br/>
                <span>{pubs_commited}</span>
            </div>
            <div className="chain-stake">
                Pubs Last 24h:<br/>
                <span>{pubs_commited_24h}</span>
            </div>
            <div className="chain-stake">
                TRAC Earnings:<br/>
                <span>{`${formatNumberWithSpaces(earnings.toFixed(0))} ($${formatNumberWithSpaces((earnings.toFixed(0) * price).toFixed(0))})`}</span>
            </div>
            <div className="chain-stake">
                TRAC Earnings Last 24h:<br/>
                <span>{`${formatNumberWithSpaces(earnings_24h.toFixed(0))} ($${formatNumberWithSpaces((earnings_24h.toFixed(0) * price).toFixed(0))})`}</span>
            </div>
            <div className="chain-stake">
                TRAC Rewards:<br/>
                <span>{`${formatNumberWithSpaces(payouts.toFixed(0))} ($${formatNumberWithSpaces((payouts.toFixed(0) * price).toFixed(0))})`}</span>
            </div>
            <div className="chain-stake">
                TRAC Rewards Last 24h:<br/>
                <span>{`${formatNumberWithSpaces(payouts_24h.toFixed(0))} ($${formatNumberWithSpaces((payouts_24h.toFixed(0) * price).toFixed(0))})`}</span>
            </div>
            <div className="chain-stake">
                Network Stake:<br/>
                <span>{`${formatNumberWithSpaces(totalStake.toFixed(0))} ($${formatNumberWithSpaces((totalStake.toFixed(0) * price).toFixed(0))})`}</span>
            </div>
        </div>}
      {chain_data.map((blockchain) => (
        <div key={blockchain.blockchain_name} className={`d${blockchain.blockchain_id}-node-div`}>
            <div className={`d${blockchain.blockchain_id}-chain-logo`}>
                <img
                src={`${process.env.REACT_APP_API_HOST}/images?src=id${blockchain.blockchain_id}-logo.png`}
                alt={blockchain.blockchain_name}
                width="150"
                height={blockchain.blockchain_id === 100 ? ("15") : blockchain.blockchain_id === 2043 ? ("30") : ("50")}
                ></img>{blockchain.blockchain_id === 2043 ? (<span><b>euroWeb Mainnet</b></span>) : blockchain.blockchain_id === 20430 ? (<span><b>euroWeb Testnet</b></span>) : blockchain.blockchain_id === 10200 ? (<span><b>Chiado Testnet</b></span>) : ("")}
            </div>
            <div className="chain-assets">
                Active Nodes:<br/>
                <span>{blockchain.nodes}</span>
            </div>
            <div className="chain-stake">
                Pubs:<br/>
                <span>{blockchain.pubsCommited}</span>
            </div>
            <div className="chain-stake">
                Pubs Last 24h:<br/>
                <span>{blockchain.pubsCommited_24h}</span>
            </div>
            <div className="chain-stake">
                TRAC Earnings:<br/>
                <span>{`${formatNumberWithSpaces(blockchain.earnings.toFixed(0))} ($${formatNumberWithSpaces((blockchain.earnings.toFixed(0) * price).toFixed(0))})`}</span>
            </div>
            <div className="chain-stake">
                TRAC Earnings Last 24h:<br/>
                <span>{`${formatNumberWithSpaces(blockchain.earnings_24h.toFixed(0))} ($${formatNumberWithSpaces((blockchain.earnings_24h.toFixed(0) * price).toFixed(0))})`}</span>
            </div>
            <div className="chain-stake">
                TRAC Rewards:<br/>
                <span>{`${formatNumberWithSpaces(blockchain.payouts.toFixed(0))} ($${formatNumberWithSpaces((blockchain.payouts.toFixed(0) * price).toFixed(0))})`}</span>
            </div>
            <div className="chain-stake">
                 TRAC Rewards Last 24h:<br/>
                <span>{`${formatNumberWithSpaces(blockchain.payouts_24h.toFixed(0))} ($${formatNumberWithSpaces((blockchain.payouts_24h.toFixed(0) * price).toFixed(0))})`}</span>
            </div>
            <div className="chain-stake">
                Blockchain Stake:<br/>
                <span>{`${formatNumberWithSpaces(blockchain.totalStake.toFixed(0))} ($${formatNumberWithSpaces((blockchain.totalStake.toFixed(0) * price).toFixed(0))})`}</span>
            </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="home-stats">
        <Loading />
    </div>
  );
};

export default Stats;
