import React, { useState } from "react";
import "../../css/home.css";
import "../../css/main.css";
import Loading from "../effects/Loading";
import CumPubs from "./cumPubs";
import CumPay from "./cumPay";
import CumEarnings from "./cumEarnings";
import ActivityFeed from "./activityFeed";
import Stats from "./stats";
import NetworkDrop from "../navigation/networkDrop";

const Home = () => {
  const [blockchain, setBlockchain] = useState("");
  const [network, setNetwork] = useState("");

  return (
    <div className="main">
      <div className="header">
        <NetworkDrop network={setNetwork} blockchain={setBlockchain} />
      </div>
      {network ? (
        <div className="body">
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
          <div className="home-charts-body">
            <div className="home-chart-container">
              <CumEarnings
                data={[
                  {
                    network: network,
                    blockchain: blockchain,
                  },
                ]}
              />
            </div>
            <div className="home-chart-container">
              <CumPay
                data={[
                  {
                    network: network,
                    blockchain: blockchain,
                  },
                ]}
              />
            </div>
            <div className="home-chart-container">
              <CumPubs
                data={[
                  {
                    network: network,
                    blockchain: blockchain,
                  },
                ]}
              />
            </div>
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
