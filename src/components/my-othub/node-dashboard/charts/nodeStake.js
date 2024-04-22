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

const NodeStake = (settings) => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [nodeData, setNodeData] = useState("");
  const [button, setButtonSelect] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setNodeData(settings.data[0].nodeStats);
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

      let node_stats = [];
      for(const node of settings.data[0].nodes){
        let data = {
          blockchain: node.chainName,
          nodeId: node.nodeId,
        };
    
        let response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/nodes/info`,
          data,
          config
        );
  
        data = {
          frequency: frequency,
          timeframe: button_select === "24h" ? (24) : button_select === "7d" ? (168) : button_select === "30d" ? (30) : button_select === "6m" ? (160) : button_select === "1y" ? (12) : null,
          blockchain: node.chainName,
          grouped: "no",
          nodeId: node.nodeId
        };

        response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/nodes/stats`,
          data,
          config
        );

        node_stats.push(response.data.result[0]);
      }

      setNodeData(node_stats);
      setisLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const formattedData = {
    datasets: [],
  };

  if (nodeData) {
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

    for (const blockchain of nodeData) {
      blockchain.data
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
    }

    formattedData.labels = button === "24h" || button === "7d" ? formattedDates : formattedDates.sort((a, b) => moment(a, format).toDate() - moment(b, format).toDate())

    let border_color;
    let chain_color;

    for (const blockchain of nodeData) {
      let total_nodeStake = [];
      for (const date of formattedData.labels) {
        let nodeStake = 0;
          for (const item of blockchain.data) {
            if (moment(button === "24h" || button === "7d" ? (item.datetime) : (item.date)).format(format) === date) {
              nodeStake = item.nodeStake + nodeStake;
            }
          }
          total_nodeStake.push(nodeStake);
      }

      if (
        blockchain.blockchain_name === "NeuroWeb Mainnet" ||
        blockchain.blockchain_name === "NeuroWeb Testnet"
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

      let nodeStake_obj = {
        label: blockchain.blockchain_name + " Stake",
        data: total_nodeStake,
        fill: false,
        borderColor: border_color,
        backgroundColor: border_color,
        yAxisID: "line-y-axis",
        type: "line",
        borderWidth: 2
      };

      formattedData.datasets.push(nodeStake_obj);
    }

    for (const blockchain of nodeData) {
      let tokenNames = new Set(blockchain.data.map((item) => item.tokenName));
      for (const tokenName of tokenNames) {
        let final_stake = [];
        for (const obj of formattedData.labels) {
          let containsDate = blockchain.data.some((item) => moment(button === "24h" || button === "7d" ? (item.datetime) : (item.date)).format(format) === obj && tokenName === item.tokenName);
          if(containsDate){
            for (const item of blockchain.data) {
              if (tokenName === item.tokenName && moment(button === "24h" || button === "7d" ? (item.datetime) : (item.date)).format(format) === obj) {
                final_stake.push(item.nodeStake)
              }
            }
          }else{
            final_stake.push(null)
          }
        }

        if (
          blockchain.blockchain_name === "NeuroWeb Mainnet" ||
          blockchain.blockchain_name === "NeuroWeb Testnet"
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
  
        let final_stake_obj = {
          label: tokenName,
          data: final_stake,
          fill: false,
          borderColor: border_color,
          backgroundColor: chain_color,
          borderWidth: 2,
          yAxisID: "bar-y-axis",
        };

        formattedData.datasets.push(final_stake_obj);
      }
    }
  }

  const options = {
    scales: {
      "line-y-axis": {
        position: "left",
        beginAtZero: true,
        title: {
          // Start the scale at 0
          display: true,
          text: "Total Stake", // Add your X-axis label here
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
      "bar-y-axis": {
        position: "right",
        beginAtZero: true,
        stacked: true,
        title: {
          // Start the scale at 0
          display: true,
          text: "Stake", // Add your X-axis label here
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
        beginAtZero: true,
        stacked: true,
        title: {
          // Start the scale at 0
          display: true,
          text: "Date (UTC)", // Add your X-axis label here
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
      {nodeData ? (
        <div className="chart-widget">
          <div className="chart-name">
            Node Stakes
          </div>
          <div className="chart-port">
            <Bar data={formattedData} options={options} />
          </div>
          <div className="chart-filter">
            <button
              className="chart-filter-button"
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
              className="chart-filter-button"
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
              className="chart-filter-button"
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
              className="chart-filter-button"
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
        <div className="chart-widget">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default NodeStake;
