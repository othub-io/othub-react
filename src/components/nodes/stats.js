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

  useEffect(() => {
    async function fetchData() {
      try {
        setStats("");
        const request_data = {
          blockchain: settings.data[0].blockchain_name,
          nodeId: settings.data[0].nodeId,
        };

        const response = await axios.post(
          `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/nodes/nodeStats`,
          request_data
        );

        setStats(response.data);

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

  return stats ? (
    <div className={`node-pop-stats`}>
      <img
        src={`${ext}://${process.env.REACT_APP_RUNTIME_HOST}/images?src=node${settings.data[0].blockchain_id}-logo.png`}
        width="30px"
        alt={settings.data[0].blockchain_name}
      ></img>{`  ${settings.data[0].node_name}`}<br></br>
      <div className="node-stat">
        <div className="node-pop-header">Total Pubs</div>
        <span>{stats.pubs_commited}</span>
      </div>
      <div className="node-stat">
        <div className="node-pop-header">24h Pubs</div>
        <span>{stats.pubs_commited_24h}</span>
      </div>
      <div className="node-stat">
        <div className="node-pop-header">Total Rewards</div>
        <span>{stats.payouts.toFixed(3)} TRAC</span>
      </div>
      <div className="node-stat">
        <div className="node-pop-header">24h Rewards</div>
        <span>{stats.payouts_24h.toFixed(3)} TRAC</span>
      </div>
      <div className="node-stat">
        <div className="node-pop-header">Total Earnings</div>
        <span>{stats.earnings.toFixed(3)} TRAC</span>
      </div>
      <div className="node-stat">
        <div className="node-pop-header">24h Earnings</div>
        <span>{stats.earnings_24h.toFixed(3)} TRAC</span>
      </div>
    </div>
  ) : (
    <div className="home-stats">
      <Loading />
    </div>
  );
};

export default Stats;
