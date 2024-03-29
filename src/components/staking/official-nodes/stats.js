import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../../effects/Loading";
import "../../../css/nodeDashboard.css";
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
          nodes: [
            {nodeId: '26', blockchain_name: 'Gnosis Mainnet', blockchain_id: 100, m_wallet: '0xec654cbFd1CA5fF00466dEFb5DcD7fF519aEEE33', o_wallet: '0x0EFA0c78aA0E5CB851E909614c22C98E68dd882d'},
            {nodeId: '27', blockchain_name: 'Gnosis Mainnet', blockchain_id: 100, m_wallet: '0x2C086533485a42B974cB3EBdE485031082c50909', o_wallet: '0xfB0Ca6054f9B536C435da4bF660E38eD51BbCfaa'},
            {nodeId: '37', blockchain_name: 'Gnosis Mainnet', blockchain_id: 100, m_wallet: '0x2C086533485a42B974cB3EBdE485031082c50909', o_wallet: '0xC27A7248a886639f491a6de8CfEa2a1C5E3F8ABb'},
         ],
        };

        const response = await axios.post(
          `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/staking`,
          request_data
        );

        setStats(response.data);

        const rsp = await axios.get(
          "https://api.coingecko.com/api/v3/coins/origintrail"
        );
        setPrice(rsp.data.market_data.current_price.usd);
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
    <div className="node-stats-staking">
      {stats.map((blockchain) => (
        <div key={blockchain.chain_name} className={`d${blockchain.blockchain_id}-node-div-staking`}>
            <div className={`d${blockchain.blockchain_id}-chain-logo`}>
                <img
                src={`${ext}://${process.env.REACT_APP_RUNTIME_HOST}/images?src=id${blockchain.blockchain_id}-logo.png`}
                alt={blockchain.chain_name}
                width="150"
                height={blockchain.blockchain_id === 100 ? ("15") : blockchain.blockchain_id === 2043 ? ("30") : ("50")}
                ></img>{blockchain.blockchain_id === 2043 ? (<span><b>euroWeb Mainnet</b></span>) : blockchain.blockchain_id === 20430 ? (<span><b>euroWeb Testnet</b></span>) : blockchain.blockchain_id === 10200 ? (<span><b>Chiado Testnet</b></span>) : ("")}
            </div>
            <div className="chain-assets">
                Name:<br/>
                <span>{blockchain.tokenName}</span>
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
                Stake:<br/>
                <span>{`${formatNumberWithSpaces(blockchain.totalStake.toFixed(0))} ($${formatNumberWithSpaces((blockchain.totalStake.toFixed(0) * price).toFixed(0))})`}</span>
            </div>
            <div className="chain-stake">
                Operator Fee:<br/>
                <span>{`${blockchain.op_fee}%`}</span>
            </div>
            <div className="chain-stake">
                Management Wallet:<br/>
                <span>{blockchain.m_wallet}</span>
            </div>
            <div className="chain-stake">
                Operational Wallet:<br/>
                <span>{blockchain.o_wallet}</span>
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
