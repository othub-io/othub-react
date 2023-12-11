import React, { useState, useEffect } from "react";
import "../css/home.css";
import Loading from "../Loading";
import CumPubs from "../charts/cumPubs";
import CumPay from "../charts/cumPay";
import ActivityFeed from "../charts/activityFeed";
import axios from "axios";
const networks = JSON.parse(process.env.REACT_APP_SUPPORTED_NETWORKS);
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

const Home = () => {
  const [data, setData, token] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [network, setNetwork] = useState("Origintrail Parachain Mainnet");

  useEffect(() => {
    async function fetchData() {
      try {
        let network_data = {
          network: network,
        };
        const response = await axios.post(
          `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/home`,
          network_data
        );
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setData("");
    fetchData();
  }, [network]);

  let pub_count;
  let totalTracSpent;
  let totalPubs_24h;
  let totalSpent_24h;
  let avg_size;
  let avg_epochs;
  let avg_ask;
  let avg_big;
  let totalStake;

  if (data) {
    pub_count = formatNumber(parseFloat(data.pub_count));
    totalTracSpent = formatNumber(
      parseFloat(Number(data.totalTracSpent).toFixed(2))
    );
    totalPubs_24h = formatNumber(
      parseFloat(data.v_pubs_stats_last24h[0].totalPubs)
    );
    totalSpent_24h = formatNumber(
      parseFloat(data.v_pubs_stats_last24h[0].totalTracSpent).toFixed(2)
    );
    avg_size = formatNumber(
      parseFloat(data.v_pubs_stats_last24h[0].avgPubSize).toFixed(0)
    );
    avg_epochs = formatNumber(
      parseFloat(data.v_pubs_stats_last24h[0].avgEpochsNumber).toFixed(1)
    );
    avg_ask = formatNumber(
      parseFloat(data.v_pubs_stats_last24h[0].avgPubPrice).toFixed(2)
    );
    avg_big = formatNumber(
      parseFloat(data.v_pubs_stats_last24h[0].avgBid).toFixed(2)
    );
    totalStake = formatNumber(parseFloat(Number(data.totalStake).toFixed(2)));
  } else {
    return (
      <div className="assets">
        <div className="assets-header">
          <Loading />
        </div>
      </div>
    );
  }

  const percentage = (data.pub_count / 10000000) * 100;

  return (
    <div className="home">
      <div className="header">
        <div className="home-network-drop-down">
          <select onChange={(e) => setNetwork(e.target.value)}>
            {networks.map((network) => (
              <option key={network.name} value={network.name}>
                {network.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      {data && network ? (
        <div>
          {/* <div className="bar-header">
            <div className="badge">
              <a
                href="https://dkg.origintrail.io/explore?ual=did:dkg:otp/0x5cac41237127f94c2d21dae0b14bfefa99880630/1004951"
                target="_blank"
              >
                <img
                  src={`${ext}://${process.env.REACT_APP_RUNTIME_HOST}/images?src=OTHub-1M-Badge.jpg`}
                  alt="1M Assets Badge"
                ></img>
              </a>
            </div>
            <div className="bar-legend-big">1M</div>
            <div className="bar-legend"></div>
            <div className="bar-legend"></div>
            <div className="bar-legend"></div>
            <div className="bar-legend-big">5M</div>
            <div className="bar-legend"></div>
            <div className="bar-legend"></div>
            <div className="bar-legend"></div>
            <div className="bar-legend"></div>
            <div className="bar-legend-big">10M</div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${percentage}%` }}
              >
                <div className="bar-text">{pub_count}</div>
              </div>
            </div>
            <div className="bar-title">Road to 10 Million Assets</div>
          </div>   */}
          <div className="activity-feed">
            <ActivityFeed
              data={[
                {
                  network: network,
                  data: data,
                },
              ]}
            />
          </div>
          <div className="home-form">
            <div className="home-title">Network Statistics</div>
            <div className="total-assets">
              Assets Published
              <br></br>
              <div className="home-stats-info">{pub_count}</div>
            </div>
            <div className="home-total-stake">
              TRAC Spent
              <br></br>
              <div className="home-stats-info">{totalTracSpent}</div>
            </div>
            <div className="home-nodes">
              Total Stake
              <br></br>
              <div className="home-stats-info">{totalStake}</div>
            </div>
            <div className="trac-spent">
              Assets Published 24h
              <br></br>
              <div className="home-stats-info">{totalPubs_24h}</div>
            </div>
            <div className="assets-24h">
              Nodes
              <br></br>
              <div className="home-stats-info">{data.v_nodes_length}</div>
            </div>
            <div className="trac-spent-24h">
              TRAC Spent 24h
              <br></br>
              <div className="home-stats-info">{totalSpent_24h}</div>
            </div>
          </div>
          <div className="home-chart">
            <CumPay data={network} />
          </div>
          <div className="home-chart">
            <CumPubs data={network} />
          </div>
        </div>
      ) : (
        <div className="assets">
          <div className="assets-header">
            <Loading />
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
