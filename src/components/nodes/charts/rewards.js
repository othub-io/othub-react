import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
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
import Loading from "../../effects/Loading";

const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};

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
  const [rewardData, setRewardData] = useState("");
  const [button, setButtonSelect] = useState("6m");

  useEffect(() => {
    async function fetchData() {
      try {
        setRewardData(settings.data[0].node_data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setInputValue("");
    fetchData();
  }, [settings]);

  const changeFrequency = async (frequency,button_select) => {
    try {
      setisLoading(true);
      setInputValue(frequency);
      setButtonSelect(button_select)
      let data = {
        frequency: frequency,
        timeframe: button_select === "24h" ? (24) : button_select === "7d" ? (168) : button_select === "30d" ? (30) : button_select === "6m" ? (160) : button_select === "1y" ? (12) : null,
        blockchain: settings.data[0].blockchain,
        nodeId: settings.data[0].nodeId,
        grouped: "no"
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/nodes/stats`,
        data,
        config
      );
      setRewardData(response.data.result);
      setisLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const formattedData = {
    datasets: [],
  };

  if (rewardData) {
    let format = "MMM YY";
    if (button === "24h") {
      format = "HH:00";
    }
    if (button === "7d") {
      format = "ddd HH:00";
    }
    if (button === "30d") {
      format = "DD MMM YY";
    }
    if (button === "6m") {
      format = "DD MMM YY";
    }

    const uniqueDates = new Set();
    const formattedDates = [];
    
    rewardData[0].data
      .filter((item) => {
        const formattedDate = moment(button === "24h" || button === "7d" ? (item.datetime) : (item.date)).format(format);
        // Check if the formatted date is unique
        if (!uniqueDates.has(formattedDate)) {
          uniqueDates.add(formattedDate);
          formattedDates.push(formattedDate);
          return true;
        }
        return false;
      })
      .map((item) => moment(button === "24h" || button === "7d" ? (item.datetime) : (item.date)).format(format));

      formattedData.labels = button === "24h" || button === "7d" ? formattedDates : formattedDates.sort((a, b) => moment(a, format).toDate() - moment(b, format).toDate())

    let border_color;
    let chain_color;
    let payouts_obj;

    const payouts = rewardData[0].data.map((item) => item.payouts);

    if (
      settings.data[0].blockchain === "NeuroWeb Mainnet" ||
      settings.data[0].blockchain === "NeuroWeb Testnet"
    ) {
      chain_color = "#fb5deb";
      border_color = "rgba(251, 93, 235, 0.1)";
    }

    if (
      settings.data[0].blockchain === "Gnosis Mainnet" ||
      settings.data[0].blockchain === "Chiado Testnet"
    ) {
      chain_color = "#133629";
      border_color = "rgba(19, 54, 41, 0.1)";
    }

    payouts_obj = {
      label: settings.data[0].nodeName,
      data: payouts,
      fill: false,
      borderColor: chain_color,
      backgroundColor: border_color,
      borderWidth: 2,
    };

    formattedData.datasets.push(payouts_obj);
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
      {rewardData ? (
        <div className="node-pop-chart-widget">
          <div className="node-pop-chart-name">Node Rewards</div>
          <div className="node-pop-chart-port">
            <Bar data={formattedData} options={options} />
          </div>
          <div className="node-pop-chart-filter">
            <button
              className="node-pop-chart-filter-button"
              onClick={() => changeFrequency("hourly","24h")}
              name="frequency"
              style={
                button === "24h"
                  ? { color: "#FFFFFF", backgroundColor: "#6344df" }
                  : {}
              }
            >
              24h
            </button>
            <button
              className="node-pop-chart-filter-button"
              onClick={() => changeFrequency("hourly", "7d")}
              name="frequency"
              style={
                button === "7d"
                  ? { color: "#FFFFFF", backgroundColor: "#6344df" }
                  : {}
              }
            >
              7d
            </button>
            <button
              className="node-pop-chart-filter-button"
              onClick={() => changeFrequency("daily","30d")}
              name="frequency"
              style={
                button === "30d"
                  ? { color: "#FFFFFF", backgroundColor: "#6344df" }
                  : {}
              }
            >
              30d
            </button>
            <button
              className="node-pop-chart-filter-button"
              onClick={() => changeFrequency("daily","6m")}
              name="frequency"
              style={
                button === "6m"
                  ? { color: "#FFFFFF", backgroundColor: "#6344df" }
                  : {}
              }
            >
              6m
            </button>
            <button
              className="node-pop-chart-filter-button"
              onClick={() => changeFrequency("monthly","1y")}
              name="frequency"
              style={
                button === "1y"
                  ? { color: "#FFFFFF", backgroundColor: "#6344df" }
                  : {}
              }
            >
              1y
            </button>
            <button
              className="node-pop-chart-filter-button"
              onClick={() => changeFrequency("monthly","")}
              name="frequency"
              style={
                button === ""
                  ? { color: "#FFFFFF", backgroundColor: "#6344df" }
                  : {}
              }
            >
              All
            </button>
          </div>
        </div>
      ) : (
        <div className="node-pop-chart-widget">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default NodeRewards;
