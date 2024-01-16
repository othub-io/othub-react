import React, { useState, useEffect } from "react";
import "../../css/home.css";
import "../../css/main.css";
import Loading from "../effects/Loading";
import CumPubs from "./cumPubs";
import CumPay from "./cumPay";
import ActivityFeed from "./activityFeed";
import Stats from "./stats";
import NetworkDrop from "../navigation/networkDrop";
let ext;

ext = "http";
if (process.env.REACT_APP_RUNTIME_HTTPS === "true") {
  ext = "https";
}

const Home = () => {
  const [blockchain, setBlockchain] = useState("");
  const [network, setNetwork] = useState("");
  const isMobile = window.matchMedia("(max-width: 480px)").matches;

  return (
    <div className="main">
      <div className="header">
        <NetworkDrop network={setNetwork} blockchain={setBlockchain} />
      </div>
      {network ? (
        <div>
          <ActivityFeed
            data={[
              {
                network: network,
                blockchain: blockchain,
              },
            ]}
          />

          <Stats
            data={[
              {
                network: network,
                blockchain: blockchain,
              },
            ]}
          />
          <div className="charts-body">
          <div className="chart-container">
              <CumPubs
                data={[
                  {
                    network: network,
                    blockchain: blockchain,
                  },
                ]}
              />
            </div>
            <div className="chart-container">
              <CumPay
                data={[
                  {
                    network: network,
                    blockchain: blockchain,
                  },
                ]}
              />
            </div>
          </div>
          <div className="spacer">
            
          </div>
        </div>
      ) : (
        <div>
          <Loading />
        </div>
      )}
    </div>
  );
};

export default Home;
