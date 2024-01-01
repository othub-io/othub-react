import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import Loading from "../effects/Loading";
let ext;

ext = "http";
if (process.env.REACT_APP_RUNTIME_HTTPS === "true") {
  ext = "https";
}

function formatNumber(number) {
  if (number >= 1000) {
    const suffixes = ["", "K", "M", "B", "T"];
    const suffixIndex = Math.floor(Math.log10(number) / 3);
    const shortNumber =
      suffixIndex !== 0 ? number / Math.pow(1000, suffixIndex) : number;
    const roundedNumber = Math.round(shortNumber * 10) / 10;
    return roundedNumber.toString().replace(/\.0$/, "") + suffixes[suffixIndex];
  }
  return number.toString();
}

const Stats = (settings) => {
  const [stats, setStats] = useState("");
  let total_pub_count = 0
  let total_stake = 0
  let total_trac_spent = 0
  let nodes = 0
  let pubs_stats_last24h = 0
  let total_trac_spent24h = 0

  useEffect(() => {
    async function fetchData() {
      try {
        console.log(settings.data[0].network)
        const request_data = {
          network: settings.data[0].network,
        };

        const response = await axios.post(
          `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/home`,
          request_data
        );

        console.log(response.data)
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [settings]);

  //   if (stats) {
  //     pub_count = formatNumber(parseFloat(data.pub_count));
  //     totalTracSpent = formatNumber(
  //       parseFloat(Number(data.totalTracSpent).toFixed(2))
  //     );
  //     totalPubs_24h = formatNumber(
  //       parseFloat(data.v_pubs_stats_last24h[0].totalPubs)
  //     );
  //     totalSpent_24h = formatNumber(
  //       parseFloat(data.v_pubs_stats_last24h[0].totalTracSpent).toFixed(2)
  //     );
  //     avg_size = formatNumber(
  //       parseFloat(data.v_pubs_stats_last24h[0].avgPubSize).toFixed(0)
  //     );
  //     avg_epochs = formatNumber(
  //       parseFloat(data.v_pubs_stats_last24h[0].avgEpochsNumber).toFixed(1)
  //     );
  //     avg_ask = formatNumber(
  //       parseFloat(data.v_pubs_stats_last24h[0].avgPubPrice).toFixed(2)
  //     );
  //     avg_big = formatNumber(
  //       parseFloat(data.v_pubs_stats_last24h[0].avgBid).toFixed(2)
  //     );
  //     totalStake = formatNumber(parseFloat(Number(data.totalStake).toFixed(2)));
  //   }

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
       <div key="total_stats" className={`total-stats-home-div`}>
            <div className="chain-logo">
                <img
                src={`${ext}://${process.env.REACT_APP_RUNTIME_HOST}/images?src=origintrail_logo-dark_purple.png`}
                alt="ot-logo"
                width="100"
                ></img><span>{settings.data[0].network.substring(4)}</span>
            </div>
            <div className="chain-assets">
                Total Assets:<br/>
                <span>{total_pub_count}</span>
            </div>
            <div className="chain-stake">
                Total Stake:<br/>
                <span>{total_stake}</span>
            </div>
            <div className="chain-stake">
                Total Trac Spent:<br/>
                <span>{total_trac_spent}</span>
            </div>
            <div className="chain-stake">
                Total Nodes:<br/>
                <span>{nodes}</span>
            </div>
            <div className="chain-stake">
                Total Assets Last 24h:<br/>
                <span>{pubs_stats_last24h}</span>
            </div>
            <div className="chain-stake">
                Total TRAC Spent Last 24h:<br/>
                <span>{total_trac_spent24h}</span>
            </div>
        </div>
      {stats.map((blockchain) => (
        <div key={blockchain.blockchain_name} className={`d${blockchain.blockchain_id}-home-div`}>
            <div className="chain-logo">
                <img
                src={`${ext}://${process.env.REACT_APP_RUNTIME_HOST}/images?src=id${blockchain.blockchain_id}-logo.png`}
                alt={`id${blockchain.blockchain_id}-logo`}
                width="150"
                ></img>
            </div>
            <div className="chain-assets">
                Assets:<br/>
                <span>{blockchain.pub_count}</span>
            </div>
            <div className="chain-stake">
                Stake:<br/>
                <span>{blockchain.totalStake}</span>
            </div>
            <div className="chain-stake">
                Trac Spent:<br/>
                <span>{blockchain.totalTracSpent}</span>
            </div>
            <div className="chain-stake">
                Nodes:<br/>
                <span>{blockchain.nodes}</span>
            </div>
            <div className="chain-stake">
                Assets Last 24h:<br/>
                <span>{blockchain.pubs_stats_last24h[0].totalPubs}</span>
            </div>
            <div className="chain-stake">
                TRAC Spent Last 24h:<br/>
                <span>{blockchain.pubs_stats_last24h[0].totalTracSpent}</span>
            </div>
        </div>
      ))}
    </div>
  ) : (
    <div className="home-form">
        <Loading />
    </div>
  );
};

export default Stats;
