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
import Loading from "../../Loading";

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

const PubsCommited = (node_data) => {
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
        setData(node_data.data[0].data.chart_data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setInputValue("");
    fetchData();
  }, [node_data]);

  const changeTimeFrame = async (timeframe) => {
    try {
      setisLoading(true);
      setInputValue(timeframe);
      const time_data = {
        timeframe: timeframe,
        network: node_data.data[0].network,
        nodeId: node_data.data[0].nodeId,
        public_address: node_data.data[0].public_address,
      };
      const response = await axios.post(
        `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/node-dashboard/nodeStats`,
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

  let pubsCommited_obj = [];
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

    formattedData.labels = data
    .filter((item) => {
      const formattedDate = moment(item.date).format(format);
      // Check if the formatted date is unique
      if (!uniqueDates.has(formattedDate)) {
        uniqueDates.add(formattedDate);
        return true;
      }
      return false;
    })
    .map((item) => moment(item.date).format(format));

    let tokenNames = new Set(data.map((item) => item.tokenName));
    for (const tokenName of tokenNames) {
      let randomHexColor = generateRandomColor();
      const pubsCommited = data
        .filter((item) => item.tokenName === tokenName)
        .map((item) => item.pubsCommited);

        if(pubsCommited.length !== formattedData.labels.length){
          for(let i = 0; i < (Number(formattedData.labels.length) - Number(pubsCommited.length)); i++){
            pubsCommited.unshift(0);
          }
        }

        pubsCommited_obj = {
          label: tokenName,
          data: pubsCommited,
          fill: false,
          borderColor: randomHexColor,
          backgroundColor: randomHexColor,
        };
  
        formattedData.datasets.push(pubsCommited_obj);
    }
  } else {
    return <Loading />;
  }

  if (isLoading) {
    return <Loading />;
  }

  const options = {
    scales: {
      y: {
        beginAtZero: true, // Start the scale at 0
        stacked: true,
        title: {
          display: true,
          text: "Assets", // Add your X-axis label here
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
          <div className="chart-name">Pubs Commited</div>
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
          <div className="ee-chart-filter">
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

export default PubsCommited;
