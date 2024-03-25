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

function generateRandomColor() {
  // Generate a random hexadecimal color code
  const randomColor = Math.floor(Math.random() * 16777215).toString(16);

  // Pad the color code with zeros if needed
  return "#" + "0".repeat(6 - randomColor.length) + randomColor;
}

const TokenValue = (settings) => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [data, setData] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const time_data = {
          node: settings.data[0],
        };
        const response = await axios.post(
          `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/nodes/nodeValue`,
          time_data
        );
        setData(response.data.chart_data);
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
        node: settings.data[0],
      };
      const response = await axios.post(
        `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/nodes/nodeValue`,
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

  if (data) {
    let format = "DD MMM YY";
    if (inputValue === "24h") {
      format = "HH:00";
    }
    if (inputValue === "7d") {
      format = "ddd HH:00";
    }
    if (inputValue === "30d") {
      format = "DD MMM YY";
    }
    if (inputValue === "6m") {
      format = "DD MMM YY";
    }

    const uniqueDates = new Set();
    const formattedDates = [];

    data.data
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

      formattedData.labels = inputValue === "24h" || inputValue === "7d" ? formattedDates : formattedDates.sort((a, b) => moment(a, format).toDate() - moment(b, format).toDate())

    let currentValues = [];
    let futureValues = [];

    let border_color;
    let chain_color;
    for (const item of data.data) {
      currentValues.push(item.shareValueCurrent);
      futureValues.push(item.shareValueFuture);
    }

    if (
      settings.data[0].blockchain_name === "NeuroWeb Mainnet" ||
      settings.data[0].blockchain_name === "NeuroWeb Testnet"
    ) {
      border_color = "#fb5deb";
      chain_color = "rgba(251, 93, 235, 0.1)";
    }

    if (
      settings.data[0].blockchain_name === "Gnosis Mainnet" ||
      settings.data[0].blockchain_name === "Chiado Testnet"
    ) {
      border_color = "#133629";
      chain_color = "rgba(19, 54, 41, 0.1)";
    }

    let currentValues_obj = {
      label: `Current`,
      data: currentValues,
      fill: false,
      borderColor: border_color,
      backgroundColor: border_color,
      borderWidth: 2,
    };
    formattedData.datasets.push(currentValues_obj);

    let futureValues_obj = {
      label: `Potential if all earned TRAC is rewarded`,
      data: futureValues,
      fill: false,
      borderColor: chain_color,
      backgroundColor: chain_color,
      borderWidth: 2,
    };
    formattedData.datasets.push(futureValues_obj);
  }

  const options = {
    scales: {
      x: {
        stacked: false,
        title: {
          display: true,
          text: "Datetime (UTC)", // Add your X-axis label here
          color: "#6344df", // Label color
          font: {
            size: 12, // Label font size
          },
        },
      },
      y: {
        stacked: false,
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
              return value.toFixed(5);
            }
          },
        },
      },
    },
  };

  return (
    <div>
      {data ? (
        <div className="node-pop-chart-widget">
          <div className="node-pop-chart-name" style={{fontSize:'24px', paddingTop: '10px', paddingBottom: '10px'}}>{`${data.data[0].tokenName} Share Value`}</div>
          <div className="node-pop-chart-port" style={{paddingLeft: '10px'}}>
            <Line
              data={formattedData}
              options={options}
            />
          </div>
          <div className="node-pop-chart-filter" style={{paddingTop: '20px'}}>
            <button
              className="node-pop-chart-filter-button"
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
              className="node-pop-chart-filter-button"
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
              className="node-pop-chart-filter-button"
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
              className="node-pop-chart-filter-button"
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
              className="node-pop-chart-filter-button"
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
              className="node-pop-chart-filter-button"
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
        <div className="node-pop-chart-widget">
          <Loading />
        </div>
      )}
    </div>
  );
};

export default TokenValue;
