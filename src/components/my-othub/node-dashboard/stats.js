import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import Loading from "../../effects/Loading";
let ext;

ext = "http";
if (process.env.REACT_APP_RUNTIME_HTTPS === "true") {
  ext = "https";
}

function formatNumberWithSpaces(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const Stats = (settings) => {
  const [stats, setStats] = useState("");
  const [price, setPrice] = useState("");
  let pubs_commited = 0
  let pubs_commited_24h = 0
  let earnings = 0
  let earnings_24h = 0
  let payouts = 0
  let payouts_24h = 0
  let totalStake = 0
  let nodes = 0

  useEffect(() => {
    async function fetchData() {
      try {
        setStats("")
        const request_data = {
          network: settings.data[0].network,
          blockchain: settings.data[0].blockchain,
          nodes: settings.data[0].nodes
        };

        const response = await axios.post(
          `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/node-dashboard/nodeStats`,
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
      pubs_commited = pubs_commited + blockchain.pubs_commited
      pubs_commited_24h = pubs_commited_24h + blockchain.pubs_commited_24h
      earnings = earnings + blockchain.earnings
      earnings_24h = earnings_24h + blockchain.earnings_24h
      payouts = payouts + Number(blockchain.payouts)
      payouts_24h = payouts_24h + Number(blockchain.payouts_24h)
      totalStake = totalStake + blockchain.totalStake
      nodes = nodes + blockchain.nodes
    }
  }

  return stats ? (
    <div className="node-stats">
       {!settings.data[0].nodeSelected && !settings.data[0].blockchain && <div key="total_stats" className={`total-stats-node-div`}>
            <div className="chain-logo">
                <img
                src={`${ext}://${process.env.REACT_APP_RUNTIME_HOST}/images?src=origintrail_logo-dark_purple.png`}
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
      {stats.map((blockchain) => (
        <div key={blockchain.chain_name} className={`d${blockchain.blockchain_id}-node-div`}>
            <div className={`d${blockchain.blockchain_id}-chain-logo`}>
                <img
                src={`${ext}://${process.env.REACT_APP_RUNTIME_HOST}/images?src=id${blockchain.blockchain_id}-logo.png`}
                alt={blockchain.chain_name}
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
                <span>{blockchain.pubs_commited}</span>
            </div>
            <div className="chain-stake">
                Pubs Last 24h:<br/>
                <span>{blockchain.pubs_commited_24h}</span>
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
