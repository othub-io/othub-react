import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../effects/Loading";

const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};

function formatNumberWithSpaces(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const Stats = (settings) => {
  const [stats, setStats] = useState("");
  const [price, setPrice] = useState("");
  let total_pub_count = 0
  let total_stake = 0
  let total_trac_spent = 0
  let nodes = 0
  let pubs_stats_last24h = 0
  let total_trac_spent24h = 0
  let tvl = 0

  useEffect(() => {
    async function fetchData() {
      try {
        setStats("")
        const data = {
          network: settings.data[0].network,
          blockchain: settings.data[0].blockchain,
          nodes: settings.data[0].nodes ? (settings.data[0].nodes) : ("")
        };

        const response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/othub/home`,
          data,
          config
        );

        setStats(response.data.result);
  
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

  if(stats !== ""){
    for(const blockchain of stats){
        total_pub_count = total_pub_count + blockchain.pub_count
        total_stake = total_stake + blockchain.totalStake
        total_trac_spent = total_trac_spent + blockchain.totalTracSpent
        nodes = nodes + blockchain.nodes
        pubs_stats_last24h = pubs_stats_last24h + Number(blockchain.pubs_stats_last24h[0].totalPubs)
        total_trac_spent24h = total_trac_spent24h + Number(blockchain.pubs_stats_last24h[0].totalTracSpent)
        tvl = tvl + (Number(blockchain.totalTracSpent) + Number(blockchain.totalStake))
    }
  }

  return stats ? (
    <div className="home-stats">
       {!localStorage.getItem("blockchain") && <div key="total_stats" className={`total-stats-home-div`}>
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
                Total Value Locked:<br/>
                <span>{`${formatNumberWithSpaces(tvl.toFixed(0))} ($${formatNumberWithSpaces((tvl.toFixed(0) * price).toFixed(0))})`}</span>
            </div>
            <div className="chain-stake">
                Assets Published (24h):<br/>
                <span>{formatNumberWithSpaces(pubs_stats_last24h)}</span>
            </div>
            <div className="chain-stake">
                Assets Published:<br/>
                <span>{formatNumberWithSpaces(total_pub_count)}</span>
            </div>
            <div className="chain-stake">
                TRAC Spent (24h):<br/>
                <span>{`${formatNumberWithSpaces(total_trac_spent24h.toFixed(0))} ($${formatNumberWithSpaces((total_trac_spent24h.toFixed(0) * price).toFixed(0))})`}</span>
            </div>
            <div className="chain-stake">
                Trac Spent:<br/>
                <span>{`${formatNumberWithSpaces(total_trac_spent.toFixed(0))} ($${formatNumberWithSpaces((total_trac_spent.toFixed(0) * price).toFixed(0))})`}</span>
            </div>
        </div>}
      {stats.map((blockchain) => (
        <div key={blockchain.chain_name} className={`d${blockchain.blockchain_id}-home-div`}>
            <div className={`d${blockchain.blockchain_id}-chain-logo`}>
                <img
                src={`${process.env.REACT_APP_API_HOST}/images?src=id${blockchain.blockchain_id}-logo.png`}
                alt={blockchain.chain_name}
                ></img>{blockchain.blockchain_id === 2043 ? (<span><b>euroWeb Mainnet</b></span>) : blockchain.blockchain_id === 20430 ? (<span><b>euroWeb Testnet</b></span>) : blockchain.blockchain_id === 10200 ? (<span><b>Chiado Testnet</b></span>) : ("")}
            </div>
            <div className="chain-assets">
                Active Nodes:<br/>
                <span>{blockchain.nodes}</span>
            </div>
            <div className="chain-stake">
                Total Value Locked:<br/>
                <span>{`${formatNumberWithSpaces((blockchain.totalTracSpent + blockchain.totalStake).toFixed(0))} ($${formatNumberWithSpaces(((blockchain.totalTracSpent + blockchain.totalStake).toFixed(0) * price).toFixed(0))})`}</span>
            </div>
            <div className="chain-stake">
                Assets Published (24h):<br/>
                <span>{formatNumberWithSpaces(blockchain.pubs_stats_last24h[0].totalPubs)}</span>
            </div>
            <div className="chain-stake">
                Assets Published:<br/>
                <span>{formatNumberWithSpaces(blockchain.pub_count)}</span>
            </div>
            <div className="chain-stake">
                TRAC Spent (24h):<br/>
                <span>{`${formatNumberWithSpaces(blockchain.pubs_stats_last24h[0].totalTracSpent.toFixed(0))} ($${formatNumberWithSpaces((blockchain.pubs_stats_last24h[0].totalTracSpent.toFixed(0) * price).toFixed(0))})`}</span>
            </div>
            <div className="chain-stake">
                Trac Spent:<br/>
                <span>{`${formatNumberWithSpaces(blockchain.totalTracSpent.toFixed(0))} ($${formatNumberWithSpaces((blockchain.totalTracSpent.toFixed(0) * price).toFixed(0))})`}</span>
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