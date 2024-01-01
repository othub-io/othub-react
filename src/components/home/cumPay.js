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
import Loading from "../effects/Loading";

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

const CumPay = (settings) => {
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
          `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/charts/cumGraph`,
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

  let labels = [];
  let cumulativeTotalTracSpent = [];
  let cumulativePubs = [];
  let cumulativePayout = [];
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
    cumulativeTotalTracSpent = data.map(
      (item) => item.cumulativeTotalTracSpent
    );
    cumulativePubs = data.map((item) => item.cumulativePubs);
    cumulativePayout = data.map((item) => item.cumulativePayout);
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
            label: "TRAC Spent",
            data: cumulativeTotalTracSpent,
            fill: false,
            borderColor: "#6344df",
            backgroundColor: "#6344df",
          },
      {
        label: "TRAC Rewarded",
        data: cumulativePayout,
        fill: false,
        borderColor: "#df6344",
        backgroundColor: "#df6344",
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: false, // Start the scale at 0
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
    <div className="home-chart">
      {data ? (
        <div className="chart-widget">
            <div className="home-chart-name">Cumulative TRAC spent on asset publishing and TRAC rewarded</div>
            <br></br>
          <div className="chart-port">
            <Line
              data={formattedData}
              options={options}
              height={
                window.matchMedia("(max-width: 380px)").matches ? "170" : window.matchMedia("(max-width: 400px)").matches ? "160" : window.matchMedia("(max-width: 420px)").matches ? "140" : window.matchMedia("(max-width: 480px)").matches ? "100" : (window.matchMedia("(max-width: 1366px)").matches ? "140" : (window.matchMedia("(max-width: 1536px)").matches ? "110" : "100"))
              }
              width={
                window.matchMedia("(max-width: 380px)").matches ? "260" : window.matchMedia("(max-width: 400px)").matches ? "260" : window.matchMedia("(max-width: 420px)").matches ? "240" : window.matchMedia("(max-width: 480px)").matches ? "200" : (window.matchMedia("(max-width: 1366px)").matches ? "200" : (window.matchMedia("(max-width: 1536px)").matches ? "200" : "200"))
              }
            />
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

export default CumPay;
