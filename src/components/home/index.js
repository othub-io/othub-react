import React, { useState, useEffect } from "react";
import "../../css/home.css";
import Loading from "../effects/Loading";
import CumPubs from "./cumPubs";
import CumPay from "./cumPay";
import ActivityFeed from "./activityFeed";
import Stats from "./stats";
import NetworkDrop from "../navigation/networkDrop";
import axios from "axios";
let ext;

ext = "http";
if (process.env.REACT_APP_RUNTIME_HTTPS === "true") {
  ext = "https";
}

const Home = () => {
  const [data, setData, token] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [blockchain, setBlockchain] = useState("");
  const [network, setNetwork] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        if(network !== ""){
          localStorage.removeItem("blockchain", "");

          let settings = {
            network: network,
          };
          const response = await axios.post(
            `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/home`,
            settings
          );
          setData(response.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setData("");
    fetchData();
  }, [network, blockchain]);

  return (
    <div className="home">
      <div className="header">
        <NetworkDrop network={setNetwork} blockchain={setBlockchain} />
      </div>
      {data && network ? (
        <div>
          <ActivityFeed
            data={[
              {
                network: network,
                data: data,
              },
            ]}
          />

          <Stats
            data={[
              {
                network: network,
              },
            ]}
          />
          <div className="home-chart">
            {/* <CumPay
              data={[
                {
                  network: network,
                  blockchain: blockchain,
                },
              ]}
            /> */}
          </div>
          <div className="home-chart">
            {/* <CumPubs
              data={[
                {
                  network: network,
                  blockchain: blockchain,
                },
              ]}
            /> */}
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
