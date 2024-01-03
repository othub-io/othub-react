import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import Loading from "../effects/Loading";
let ext;

ext = "http";
if (process.env.REACT_APP_RUNTIME_HTTPS === "true") {
  ext = "https";
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

  useEffect(() => {
    async function fetchData() {
      try {
        setStats("")
        const request_data = {
          network: settings.data[0].network,
          blockchain: settings.data[0].blockchain,
        };

        const response = await axios.post(
          `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/home`,
          request_data
        );

        setStats(response.data);

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

  if(stats !== ""){
    for(const blockchain of stats){
        total_pub_count = total_pub_count + blockchain.pub_count
        total_stake = total_stake + blockchain.totalStake
        total_trac_spent = total_trac_spent + blockchain.totalTracSpent
        nodes = nodes + blockchain.nodes
        pubs_stats_last24h = pubs_stats_last24h + Number(blockchain.pubs_stats_last24h[0].totalPubs)
        total_trac_spent24h = total_trac_spent24h + Number(blockchain.pubs_stats_last24h[0].totalTracSpent)
    }
  }

  return stats ? (
    <div className="home-stats">
       {!localStorage.getItem("blockchain") && <div key="total_stats" className={`total-stats-home-div`}>
            <div className="chain-logo">
                <img
                src={`${ext}://${process.env.REACT_APP_RUNTIME_HOST}/images?src=origintrail_logo-dark_purple.png`}
                alt="Origintrail Network"
                width="100"
                ></img><span>{settings.data[0].network.substring(4)}</span>
            </div>
            <div className="chain-assets">
                Assets:<br/>
                <span>{total_pub_count}</span>
            </div>
            <div className="chain-stake">
                Assets Last 24h:<br/>
                <span>{pubs_stats_last24h}</span>
            </div>
            <div className="chain-stake">
                Active Nodes:<br/>
                <span>{nodes}</span>
            </div>
            <div className="chain-stake">
                TRAC Spent Last 24h:<br/>
                <span>{`${total_trac_spent24h.toFixed(2)} ($${(total_trac_spent24h.toFixed(2) * price).toFixed(2)})`}</span>
            </div>
            <div className="chain-stake">
                Trac Spent:<br/>
                <span>{`${total_trac_spent.toFixed(2)} ($${(total_trac_spent.toFixed(2) * price).toFixed(2)})`}</span>
            </div>
            <div className="chain-stake">
                Network Stake:<br/>
                <span>{`${total_stake.toFixed(2)} ($${(total_stake.toFixed(2) * price).toFixed(2)})`}</span>
            </div>
        </div>}
      {stats.map((blockchain) => (
        <div key={blockchain.chain_name} className={`d${blockchain.blockchain_id}-home-div`}>
            <div className="chain-logo">
                <img
                src={`${ext}://${process.env.REACT_APP_RUNTIME_HOST}/images?src=id${blockchain.blockchain_id}-logo.png`}
                alt={blockchain.chain_name}
                width="150"
                height={blockchain.blockchain_id === 100 ? ("15") : blockchain.blockchain_id === 2043 ? ("30") : ("50")}
                ></img>
            </div>
            <div className="chain-assets">
                Assets:<br/>
                <span>{blockchain.pub_count}</span>
            </div>
            <div className="chain-stake">
                Assets Last 24h:<br/>
                <span>{blockchain.pubs_stats_last24h[0].totalPubs}</span>
            </div>
            <div className="chain-stake">
                Active Nodes:<br/>
                <span>{blockchain.nodes}</span>
            </div>
            <div className="chain-stake">
                TRAC Spent Last 24h:<br/>
                <span>{`${blockchain.pubs_stats_last24h[0].totalTracSpent.toFixed(2)} ($${(blockchain.pubs_stats_last24h[0].totalTracSpent.toFixed(2) * price).toFixed(2)})`}</span>
            </div>
            <div className="chain-stake">
                Trac Spent:<br/>
                <span>{`${blockchain.totalTracSpent.toFixed(2)} ($${(blockchain.totalTracSpent.toFixed(2) * price).toFixed(2)})`}</span>
            </div>
            <div className="chain-stake">
                Network Stake:<br/>
                <span>{`${blockchain.totalStake.toFixed(2)} ($${(blockchain.totalStake.toFixed(2) * price).toFixed(2)})`}</span>
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
