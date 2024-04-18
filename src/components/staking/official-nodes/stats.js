import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "../../effects/Loading";
import "../../../css/nodeDashboard.css";

const config = {
  headers: {
    Authorization: localStorage.getItem("token"),
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};

function formatNumberWithSpaces(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const Stats = (settings) => {
  const [stats, setStats] = useState("");
  const [price, setPrice] = useState("");


  useEffect(() => {
    async function fetchData() {
      try {
        setStats("")

        let data = {
          blockchain: "Gnosis Mainnet",
          nodeId: "26,27,37"
        };

        const response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/nodes/info`,
          data,
          config
        );

        setStats(response.data.result);

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

  return stats ? (
    <div className="node-stats-staking">
      {stats.map((blockchain) => (
        <div key={blockchain.chainName} className={`d${blockchain.chainId}-node-div-staking`}>
            <div className={`d${blockchain.chainId}-chain-logo`}>
                <img
                src={`${process.env.REACT_APP_API_HOST}/images?src=id${blockchain.chainId}-logo.png`}
                alt={blockchain.chainName}
                width="150"
                height={blockchain.chainId === 100 ? ("15") : blockchain.chainId === 2043 ? ("30") : ("50")}
                ></img>{blockchain.chainId === 2043 ? (<span><b>euroWeb Mainnet</b></span>) : blockchain.chainId === 20430 ? (<span><b>euroWeb Testnet</b></span>) : blockchain.chainId === 10200 ? (<span><b>Chiado Testnet</b></span>) : ("")}
            </div>
            <div className="chain-assets">
                Name:<br/>
                <span>{blockchain.tokenName}</span>
            </div>
            <div className="chain-stake">
                Stake:<br/>
                <span>{`${formatNumberWithSpaces(blockchain.nodeStake.toFixed(0))} ($${formatNumberWithSpaces((blockchain.nodeStake.toFixed(0) * price).toFixed(0))})`}</span>
            </div>
            <div className="chain-stake">
                Operator Fee:<br/>
                <span>{`${blockchain.nodeOperatorFee}%`}</span>
            </div>
            <div className="chain-stake">
                Ask:<br/>
                <span>{blockchain.nodeAsk}</span>
            </div>
            <div className="chain-stake">
                {`Current Share Value (in Trac):`}<br/>
                <span>{blockchain.shareValueCurrent.toFixed(5)}</span>
            </div>
            <div className="chain-stake">
                {`Future Share Value (in Trac):`}<br/>
                <span>{blockchain.shareValueFuture.toFixed(5)}</span>
            </div>
            <div className="chain-stake">
                Age:<br/>
                <span>{blockchain.nodeAgeDays+ " days"}</span>
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
