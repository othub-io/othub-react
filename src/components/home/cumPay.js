import React, { useState, useEffect } from "react";
import { Line} from "react-chartjs-2";
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

const CumPay = (settings) => {
  const [inputValue, setInputValue] = useState("");
  const [button, setButtonSelect] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [earningData, setEarningData] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        let data = {
          frequency: "monthly",
          timeframe: "1000",
          network: settings.data[0].network,
          blockchain: settings.data[0].blockchain,
          grouped: "yes"
        };
        const response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/nodes/stats`,
          data,
          config
        );
        setEarningData(response.data.result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setEarningData("");
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
        network: settings.data[0].network,
        blockchain: settings.data[0].blockchain,
        grouped: "yes"
      };
      const response = await axios.post(
        `${process.env.REACT_APP_API_HOST}/nodes/stats`,
        data,
        config
      );
      setEarningData(response.data.result);
      setisLoading(false);
    } catch (e) {
      console.log(e);
    }
  };

  const formattedData = {
    datasets: [],
  };

  if (earningData) {
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
    for (const blockchain of earningData) {
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

    let chain_color;
    for (const blockchain of earningData) {

      let cumPay = []

      for (const obj of formattedData.labels) {
        let containsDate = blockchain.data.some((item) => moment(button === "24h" || button === "7d" ? (item.datetime) : (item.date)).format(format) === obj);

        if(containsDate){
          let cumulativePayouts = 0;
          for (const item of blockchain.data) {
            if (moment(button === "24h" || button === "7d" ? (item.datetime) : (item.date)).format(format) === obj) {
              cumulativePayouts = item.cumulativePayouts + cumulativePayouts
            }
          }
          cumPay.push(cumulativePayouts)
        }else{
          cumPay.push(null)
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

      let cumulativePayout_obj = {
        label: blockchain.blockchain_name,
        data: cumPay,
        fill: false,
        borderColor: chain_color,
        backgroundColor: chain_color,
        type: "line",
        borderWidth: 2,
      };
      formattedData.datasets.push(cumulativePayout_obj);
    }
  }

  const options = {
    scales: {
      y: {
        beginAtZero: false, // Start the scale at 0
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
        title: {
          display: false,
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
      {earningData ? (
        <div className="chart-widget">
          <div className="home-chart-name">Cumulative TRAC rewarded for publishing</div>
          <div className="home-chart-port">
            <Line data={formattedData} options={options} />
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
