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
          blockchain: settings.data[0].blockchain
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
        timeframe: inputValue,
          network: settings.data[0].network,
          blockchain: settings.data[0].blockchain
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

  let labels = [];
  let nodesStake = [];
  let nodesWithMoreThan50kStake = [];
  if (data) {
    let format = "DD MMM";
    if (inputValue === "24h") {
      format = "HH:00";
    }
    if (inputValue === "7d") {
      format = "ddd HH:00";
    }
    if (inputValue === "30d") {
      format = "DD MMM";
    }

    labels = data.map((item) => moment(item.date).format(format));
    nodesStake = data.map((item) => item.nodesStake);
    nodesWithMoreThan50kStake = data.map(
      (item) => item.nodesWithMoreThan50kStake
    );
  } else {
    return <Loading />;
  }

  if (isLoading) {
    return <Loading />;
  }
  // Extract labels and data from the dataset
  const formattedData = {
    labels: labels,
    datasets: [
      {
        label: "Stake in TRAC",
        data: nodesStake,
        fill: false,
        borderColor: "#df6344",
        backgroundColor: "#df6344",
        yAxisID: "line-y-axis",
        type: "line",
      },
      {
        label: "Active",
        data: nodesWithMoreThan50kStake,
        fill: false,
        borderColor: "#6344df",
        backgroundColor: "#6344df",
        yAxisID: "bar-y-axis",
      }
    ],
  };

  const options = {
    scales: {
      "line-y-axis": {
        position: "right",
        beginAtZero: true,
        title: {
            // Start the scale at 0
            display: true,
            text: "Stake", // Add your X-axis label here
            color: "#df6344", // Label color
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
        position: "left",
        beginAtZero: true,
        title: {
            // Start the scale at 0
            display: true,
            text: "Nodes", // Add your X-axis label here
            color: "#6344df", // Label color
            font: {
              size: 12, // Label font size
            }
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
          <div className="chart-name">Number of nodes and combined nodes stake</div>
          <div className="chart-port">
            <Line data={formattedData} options={options} />
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
