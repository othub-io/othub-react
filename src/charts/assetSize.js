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

const AssetSize = (network) => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [data, setData] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const time_data = {
          timeframe: inputValue,
          network: network.data
        };
        const response = await axios.post(
          `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/charts/assetsMinted`,
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
  }, [network]);

  const changeTimeFrame = async (timeframe) => {
    try {
      setisLoading(true)
      setInputValue(timeframe);
      const time_data = {
        timeframe: timeframe,
        network: network.data
      };
      const response = await axios.post(
        `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/charts/assetsMinted`,
        time_data
      );
      setData(response.data.chart_data);
      setisLoading(false)
    } catch (e) {
      console.log(e);
    }
  };

  let labels = [];
  let avgPubSize = [];
  let priv = [];
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
    avgPubSize = data.map((item) => item.avgPubSize);
    priv = data.map((item) => item.privatePubsPercentage);
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
        label: "Private %",
        data: priv,
        fill: false,
        borderColor: "#df44c0",
        backgroundColor: "#df44c0",
        yAxisID: 'line-y-axis',
        type: 'line'
      },
      {
        label: "Size",
        data: avgPubSize,
        fill: false,
        borderColor: "#6344df",
        backgroundColor: "#6344df",
        yAxisID: 'bar-y-axis'
      }
    ],
  };

  const options = {
    scales: {
        'line-y-axis': {
            position: 'left',
            beginAtZero: true,
            title: {
                display: true,
                text: "Percent", // Add your X-axis label here
                color: "#df44c0", // Label color
                font: {
                  size: 12, // Label font size
                },
              },
        },
        'bar-y-axis': {
            position: 'right',
            beginAtZero: true,
            title: {
                display: true,
                text: "Bytes", // Add your X-axis label here
                color: "#6344df", // Label color
                font: {
                  size: 12, // Label font size
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
    }
  };

  return (
    <div>
      {data ? (
        <div className="chart-widget">
          <div className="chart-name">Asset size and public/private ratio</div>
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

export default AssetSize;
