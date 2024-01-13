import React, { useState, useEffect } from "react";
import { Line, Bar } from "react-chartjs-2";
import moment from "moment";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import Loading from "../../../effects/Loading";

let ext = "http";
if (process.env.REACT_APP_RUNTIME_HTTPS === "true") {
  ext = "https";
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

function generateRandomColor() {
  // Generate a random hexadecimal color code
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);

  // Pad the color code with zeros if needed
  return "#" + "0".repeat(6 - randomColor.length) + randomColor;
}

const NodeRewards = (settings) => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [data, setData] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        // const time_data = {
        //   timeframe: inputValue,
        //   network: node_data.data[0].network,
        //   nodeId: node_data.data[0].nodeId,
        //   public_address: node_data.data[0].public_address,
        // };
        // const response = await axios.post(
        //   `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/node-dashboard/nodeStats`,
        //   time_data
        // );
        // setData(response.data.chart_data);
        setData(settings.data[0].node_data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setInputValue("");
    fetchData();
  }, [settings]);

  const changeTimeFrame = async (timeframe) => {
    try {
      setisLoading(true);
      setInputValue(timeframe);
      const time_data = {
        timeframe: timeframe,
        nodes: settings.data[0].nodes
      };
      const response = await axios.post(
        `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/node-dashboard/nodeData`,
        time_data
      );
      setData(response.data.chart_data);
      setisLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const formattedData = {
    datasets: [],
  };

  let payouts_obj = [];
  if (data) {
    let format = "MMM YY";
    if (inputValue === "24h") {
      format = "HH:00";
    }
    if (inputValue === "7d") {
      format = "ddd HH:00";
    }
    if (inputValue === "30d") {
      format = "DD MMM";
    }
    if (inputValue === "6m") {
      format = "DD MMM";
    }

    const uniqueDates = new Set();
    const formattedDates = [];
    console.log(data)
    for (const blockchain of data) {
      blockchain.data
        .filter((item) => {
          const formattedDate = moment(item.date).format(format);
          // Check if the formatted date is unique
          if (!uniqueDates.has(formattedDate)) {
            uniqueDates.add(formattedDate);
            formattedDates.push(formattedDate);
            return true;
          }
          return false;
        })
        .map((item) => moment(item.date).format(format));
    }

    formattedData.labels = formattedDates;

    let border_color;
    let chain_color;
    let payouts_obj;

    for (const blockchain of data) {
      let tokenNames = new Set(blockchain.data.map((item) => item.tokenName));
      for (const tokenName of tokenNames) {
        //let randomHexColor = generateRandomColor();
        const payouts = blockchain.data
          .filter((item) => item.tokenName === tokenName)
          .map((item) => item.payouts);

          if(payouts.length !== formattedData.labels.length){
            for(let i = 0; i < (Number(formattedData.labels.length) - Number(payouts.length)) + 1; i++){
              payouts.unshift(0);
            }
          }

          if (
            blockchain.blockchain_name === "Origintrail Parachain Mainnet" ||
            blockchain.blockchain_name === "Origintrail Parachain Testnet"
          ) {
            border_color = "#fb5deb";
            chain_color = "rgba(251, 93, 235, 0.1)"
          }
    
          if (
            blockchain.blockchain_name === "Gnosis Mainnet" ||
            blockchain.blockchain_name === "Chiado Testnet"
          ) {
            border_color = "#133629";
            chain_color = "rgba(19, 54, 41, 0.1)"
          }

          payouts_obj = {
            label: tokenName + ' Rewards',
            data: payouts,
            fill: false,
            borderColor: border_color,
            backgroundColor: chain_color,
            borderWidth: 2,
          };
    
          formattedData.datasets.push(payouts_obj);
      }
    }
  }

  const options = {
    scales: {
      y: {
        beginAtZero: true, // Start the scale at 0
        stacked: true,
        title: {
          display: true,
          text: "TRAC", // Add your X-axis label here
          color: "#6344df", // Label color
          font: {
            size: 12, // Label font size
          },
        },
        ticks: {
          callback: function (value, index, values) {
            if (value >= 1000000) {
              return (value / 1000000).toFixed(1) + "M";
            } else if (value >= 1000) {
              return (value / 1000).toFixed(1) + "K";
            } else {
              return value;
            }
          },
        },
      },
      x: {
        beginAtZero: true, // Start the scale at 0
        stacked: true,
        title: {
          // Start the scale at 0
          display: true,
          text: "Datetime (UTC)", // Add your X-axis label here
          color: "#6344df", // Label color
          font: {
            size: 12, // Label font size
          },
        },
      },
    },
  };

  return (
    <div>
      {data ? (
        <div className="chart-widget">
          <div className="chart-name">Node Rewards</div>
          <div className="chart-port">
            <Bar
              data={formattedData}
              options={options}
              height={
                window.matchMedia("(max-width: 380px)").matches
                  ? "120"
                  : window.matchMedia("(max-width: 400px)").matches
                  ? "170"
                  : window.matchMedia("(max-width: 420px)").matches
                  ? "150"
                  : window.matchMedia("(max-width: 480px)").matches
                  ? "110"
                  : window.matchMedia("(max-width: 1366px)").matches
                  ? "140"
                  : window.matchMedia("(max-width: 1536px)").matches
                  ? "110"
                  : "140"
              }
              width={
                window.matchMedia("(max-width: 380px)").matches
                  ? "180"
                  : window.matchMedia("(max-width: 400px)").matches
                  ? "260"
                  : window.matchMedia("(max-width: 420px)").matches
                  ? "240"
                  : window.matchMedia("(max-width: 480px)").matches
                  ? "200"
                  : window.matchMedia("(max-width: 1366px)").matches
                  ? "200"
                  : window.matchMedia("(max-width: 1536px)").matches
                  ? "200"
                  : "280"
              }
            />
          </div>
          <div className="chart-filter">
            <button
              className="chart-filter-button"
              onClick={() => changeTimeFrame("24h")}
              name="timeframe"
              style={
                inputValue === "24h"
                  ? { color: "#FFFFFF", backgroundColor: "#6344df" }
                  : {}
              }
            >
              24h
            </button>
            <button
              className="chart-filter-button"
              onClick={() => changeTimeFrame("7d")}
              name="timeframe"
              style={
                inputValue === "7d"
                  ? { color: "#FFFFFF", backgroundColor: "#6344df" }
                  : {}
              }
            >
              7d
            </button>
            <button
              className="chart-filter-button"
              onClick={() => changeTimeFrame("30d")}
              name="timeframe"
              style={
                inputValue === "30d"
                  ? { color: "#FFFFFF", backgroundColor: "#6344df" }
                  : {}
              }
            >
              30d
            </button>
            <button
              className="chart-filter-button"
              onClick={() => changeTimeFrame("6m")}
              name="timeframe"
              style={
                inputValue === "6m"
                  ? { color: "#FFFFFF", backgroundColor: "#6344df" }
                  : {}
              }
            >
              6m
            </button>
            <button
              className="chart-filter-button"
              onClick={() => changeTimeFrame("1y")}
              name="timeframe"
              style={
                inputValue === "1y"
                  ? { color: "#FFFFFF", backgroundColor: "#6344df" }
                  : {}
              }
            >
              1y
            </button>
            <button
              className="chart-filter-button"
              onClick={() => changeTimeFrame("")}
              name="timeframe"
              style={
                inputValue === ""
                  ? { color: "#FFFFFF", backgroundColor: "#6344df" }
                  : {}
              }
            >
              All
            </button>
          </div>
        </div>
      ) : (
        <div className="chart-widget">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default NodeRewards;
