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

const TotalStake = (node_data) => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [data, setData] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const time_data = {
          timeframe: "All",
          network: node_data.data[0].network,
          nodeId: node_data.data[0].nodeId,
          public_address: node_data.data[0].public_address,
        };
        console.log(time_data);
        const response = await axios.post(
          `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/staking/nodeStake`,
          time_data
        );
        console.log(response.data.chart_data);
        setData(response.data.chart_data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setisLoading(true);
    setData("");
    fetchData();
    setisLoading(false);
  }, [node_data]);

  console.log(data)
  let totalStake = 0
  for(let i = 0; i < Number(data.length);i++){
    totalStake = totalStake + Number(data[i].nodeStake)
  }

  if (!data) {
    
    return (<div width="100" height="100">
        <br></br>
        <Loading data={''}/>
      </div>);
  }

  return (data &&
    <div>
      <div className="dashboard-total-rewards-title">Total Stake</div>
      <div className="dashboard-total-rewards-value">{totalStake.toFixed(3)}<span>TRAC</span></div>
    </div>
  );
};

export default TotalStake;
