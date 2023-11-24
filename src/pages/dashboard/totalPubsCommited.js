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

const TotalPubsCommited = (node_data) => {
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

    setisLoading(true);
    fetchData();
    setisLoading(false);
  }, [node_data]);

  let totalPubsCommited = 0
  if(data){
    for(const record of data){
      totalPubsCommited = totalPubsCommited + Number(record.pubsCommited)
    }
  }

  if (!data) {
    return (<div><Loading data={''}/></div>);
  }

  return (
    <div>
      <div className="dashboard-total-rewards-title">Total Pubs Commited</div>
      <div className="dashboard-total-rewards-value">{totalPubsCommited}<span>Pubs</span></div>
    </div>
  );
};

export default TotalPubsCommited;
