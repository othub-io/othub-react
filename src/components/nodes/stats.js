import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import Loading from "../effects/Loading";

const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};

const Stats = (settings) => {
  const [stats, setStats] = useState("");
  const [statsLast24h, setStatsLast24h] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setStats("");
        setStatsLast24h("");
        // let data = {
        //   timeframe: "",
        //   frequency: "daily",
        //   blockchain: settings.data[0].blockchain,
        //   nodeId: JSON.stringify(settings.data[0].nodeId),
        //   grouped: "no"
        // };

        // let response = await axios.post(
        //   `${process.env.REACT_APP_API_HOST}/nodes/stats`,
        //   data, 
        //   config
        // );
        setStats(settings.data[0].node_data);
        
        let data = {
          timeframe: "",
          frequency: "last24h",
          blockchain: settings.data[0].blockchain,
          nodeId: JSON.stringify(settings.data[0].nodeId),
          grouped: "no"
        };

        let response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/nodes/stats`,
          data, 
          config
        );
        setStatsLast24h(response.data.result);

        const rsp = await axios.get(
          "https://api.coingecko.com/api/v3/coins/origintrail"
        );

        if (settings.data[0].network === "DKG Mainnet") {
          const rsp = await axios.get(
            "https://api.coingecko.com/api/v3/coins/origintrail"
          );
          setPrice(rsp.data.market_data.current_price.usd);
        } else {
          setPrice(0.000000001);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, []);

  return stats && statsLast24h ? (
    <div className={`node-pop-stats`}>
      <img
        src={`${process.env.REACT_APP_API_HOST}/images?src=node${settings.data[0].blockchain_id}-logo.png`}
        width="30px"
        alt={settings.data[0].blockchain}
      ></img>{`  ${settings.data[0].nodeName}`}<br></br>
      <div className="node-stat">
        <div className="node-pop-header">Total Pubs</div>
        <span>{stats[0].data[Number(stats[0].data.length) - 1].cumulativePubsCommited}</span>
      </div>
      <div className="node-stat">
        <div className="node-pop-header">24h Pubs</div>
        <span>{statsLast24h[0].data[0].pubsCommited}</span>
      </div>
      <div className="node-stat">
        <div className="node-pop-header">Total Rewards</div>
        <span>{stats[0].data[Number(stats[0].data.length) - 1].cumulativePayouts.toFixed(3)} TRAC</span>
      </div>
      <div className="node-stat">
        <div className="node-pop-header">24h Rewards</div>
        <span>{statsLast24h[0].data[0].cumulativePayouts.toFixed(3)} TRAC</span>
      </div>
      <div className="node-stat">
        <div className="node-pop-header">Total Earnings</div>
        <span>{stats[0].data[Number(stats[0].data.length) - 1].cumulativeEstimatedEarnings.toFixed(3)} TRAC</span>
      </div>
      <div className="node-stat">
        <div className="node-pop-header">24h Earnings</div>
        <span>{statsLast24h[0].data[0].estimatedEarnings.toFixed(3)} TRAC</span>
      </div>
    </div>
  ) : (
    <div className="home-stats">
      <Loading />
    </div>
  );
};

export default Stats;
