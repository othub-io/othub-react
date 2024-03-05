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
import Loading from "../../effects/Loading";

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

const NodeStake = (settings) => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [data, setData] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const time_data = {
          timeframe: inputValue,
          network: settings.data[0].network,
          blockchain: settings.data[0].blockchain,
        };
        const response = await axios.post(
          `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/charts/nodeStake`,
          time_data
        );
        setData(response.data.chart_data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setData("");
    setInputValue("");
    fetchData();
  }, [settings]);

  const changeTimeFrame = async (timeframe) => {
    try {
      setisLoading(true);
      setInputValue(timeframe);
      const time_data = {
        timeframe: timeframe,
        network: settings.data[0].network,
        blockchain: settings.data[0].blockchain,
      };
      const response = await axios.post(
        `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/charts/nodeStake`,
        time_data
      );
      setData(response.data.chart_data);
      setisLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  const formattedData = {
    datasets: [],
  };

  if (data) {
    let format = "MMM YY";
    if (inputValue === "24h") {
      format = "HH:00";
    }
    if (inputValue === "7d") {
      format = "DD HH:00";
    }
    if (inputValue === "30d") {
      format = "DD MMM YY";
    }
    if (inputValue === "6m") {
      format = "DD MMM YY";
    }

    const uniqueDates = new Set();
    const formattedDates = [];
    for (const blockchain of data) {
      blockchain.chart_data
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

    formattedData.labels = formattedDates.sort((a, b) => moment(a, format).toDate() - moment(b, format).toDate());

    let border_color;
    let chain_color;
    for (const blockchain of data) {
      let nodeStake = []
      let nodesWithMoreThan50kStake = []

      for (const obj of formattedData.labels) {
        let containsDate = blockchain.chart_data.some((item) => moment(item.date).format(format) === obj);
        if(containsDate){
          for (const item of blockchain.chart_data) {
            if (moment(item.date).format(format) === obj) {
              nodeStake.push(item.combinedNodesStake)
              nodesWithMoreThan50kStake.push(item.nodesWithMoreThan50kStake)
            }
          }
        }else{
          nodeStake.push(null)
          nodesWithMoreThan50kStake.push(null)
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

      let nodeStake_obj = {
        label: blockchain.blockchain_name + " Stake",
        data: nodeStake,
        fill: false,
        borderColor: border_color,
        backgroundColor: chain_color,
        yAxisID: "bar-y-axis",
        borderWidth: 2
      };

      formattedData.datasets.push(nodeStake_obj);

      let nodesWithMoreThan50kStake_obj = {
        label: blockchain.blockchain_name + " Nodes",
        data: nodesWithMoreThan50kStake,
        fill: false,
        borderColor: border_color,
        backgroundColor: border_color,
        yAxisID: "line-y-axis",
        type: "line",
        borderWidth: 2
      };

      formattedData.datasets.unshift(nodesWithMoreThan50kStake_obj);
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
          text: "Nodes", // Add your X-axis label here
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
      {data ? (
        <div className="chart-widget">
          <div className="chart-name">
            Number of Nodes and Combined Stake
          </div>
          <div className="chart-port">
            <Bar data={formattedData} options={options} />
          </div>
          <div className="chart-filter">
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

export default NodeStake;
