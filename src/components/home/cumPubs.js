import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
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

const CumPubs = (settings) => {
  const [inputValue, setInputValue] = useState("");
  const [data, setData] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const time_data = {
          network: settings.data[0].network,
          blockchain: settings.data[0].blockchain,
        };
        const response = await axios.post(
          `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/charts/cumPubs`,
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

  let cumulativePubs_obj = [];

  const formattedData = {
    datasets: [],
  };

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

    const uniqueDates = new Set();
    const formattedDates = [];
    for (const blockchain of data) {
      blockchain.cum_total
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

    let chain_color;
    for (const blockchain of data) {
      if (
        blockchain.blockchain_name === "Total" &&
        settings.data[0].blockchain
      ) {
        continue;
      }

      let cumPubs = []

      for (const obj of formattedData.labels) {
        let containsDate = blockchain.cum_total.some((item) => moment(item.date).format(format) === obj);
        if(containsDate){
          for (const item of blockchain.cum_total) {
            if (moment(item.date).format(format) === obj) {
              cumPubs.push(item.cumulativePubs)
            }
          }
        }else{
          cumPubs.push(null)
        }
      }

      if (blockchain.blockchain_name === "NeuroWeb Mainnet") {
        chain_color = "#fb5deb";
      }

      if (blockchain.blockchain_name === "Gnosis Mainnet") {
        chain_color = "#133629";
      }

      if (blockchain.blockchain_name === "NeuroWeb Testnet") {
        chain_color = "#fb5deb";
      }

      if (blockchain.blockchain_name === "Chiado Testnet") {
        chain_color = "#133629";
      }

      if (blockchain.blockchain_name === "Total") {
        chain_color = "#6344df";
      }

      cumulativePubs_obj = {
        label: blockchain.blockchain_name,
        data: cumPubs,
        fill: false,
        borderColor: chain_color,
        backgroundColor: chain_color,
        borderWidth: 2
      };
      formattedData.datasets.push(cumulativePubs_obj);
    }
  }

  const options = {
    scales: {
      y: {
        beginAtZero: false, // Start the scale at 0
        title: {
          display: true,
          text: "Assets Published", // Add your X-axis label here
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
    <div>
      {data ? (
        <div className="chart-widget">
          <div className="chart-name">
            Cumulative number of published assets
          </div>
          <div className="chart-port">
            <Line
              data={formattedData}
              options={options}
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

export default CumPubs;
