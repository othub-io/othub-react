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
import Loading from "../Loading";

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

const NodePubs = (node_data) => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [data, setData] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const time_data = {
            timeframe: inputValue,
            network: node_data.data.chain_id,
            nodeIds: node_data.data.nodeFilter
        };
        const response = await axios.post(
          `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/staking/nodeStats`,
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
  }, [node_data]);

  const changeTimeFrame = async (timeframe) => {
    try {
      setisLoading(true)
      setInputValue(timeframe);
      const time_data = {
        timeframe: inputValue,
          network: node_data.data.chain_id,
          nodeId: node_data.data.nodeFilter,
          public_address: node_data.data.account
      };
      const response = await axios.post(
        `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/staking/nodeStats`,
        time_data
      );
      setData(response.data.chart_data);
      setisLoading(false)
    } catch (e) {
      console.log(e);
    }
  };

  let labels = [];
  let pubsCommited = [];
  let pubsCommited1stEpochOnly = [];
  let cumulativePubsCommited = [];
  let cumulativePubsCommited1stEpochOnly = [];
  if (data) {
    let format = "MMM"
    if(inputValue === "24h"){
      format = 'HH:00'
    }
    if(inputValue === "7d"){
      format = 'ddd HH:00'
    }
    if(inputValue === "30d"){
      format = 'DD MMM'
    }
    if(inputValue === "6m"){
      format = 'DD MMM'
    }


    labels = data.map((item) => moment(item.date).format(format));
    pubsCommited = data.map((item) => item.pubsCommited);
    pubsCommited1stEpochOnly = data.map((item) => item.pubsCommited1stEpochOnly);
    cumulativePubsCommited = data.map((item) => item.cumulativePubsCommited);
    cumulativePubsCommited1stEpochOnly = data.map((item) => item.cumulativePubsCommited1stEpochOnly);


  }else{
    return (<Loading />)
  }

  if(isLoading){
    return (<Loading />)
  }

  // Extract labels and data from the dataset
  const formattedData = {
    labels: labels,
    datasets: [
      {
        label: "Assets",
        data: pubsCommited,
        fill: false,
        borderColor: "#6344df",
        backgroundColor: "#6344df"
      },
      // {
      //   label: 'Expiring',
      //   data: expCounts,
      //   fill: false,
      //   borderColor: '#000000',
      // },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true, // Start the scale at 0
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
        title: {
          display: true,
          text: "Datetime (UTC)", // Add your X-axis label here
          color: "#6344df", // Label color
          font: {
            size: 12, // Label font size
          },
        },
      }
    },
  };

  return (
    <div>
      {data ? (
        <div className="chart-widget">
          <div className="chart-name">Assets Published</div>
          <div className="chart-port">
            <Bar data={formattedData} options={options} />
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

export default NodePubs;
