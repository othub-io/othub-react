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

const Delegations = (node_data) => {
//   const [inputValue, setInputValue] = useState("");
//   const [isLoading, setisLoading] = useState(false);
//   const [data, setData] = useState("");

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         const time_data = {
//           timeframe: "All",
//           network: node_data.data[0].network,
//           nodeId: node_data.data[0].nodeId,
//           public_address: node_data.data[0].public_address,
//         };
//         console.log(time_data);
//         const response = await axios.post(
//           `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/staking/dataStored`,
//           time_data
//         );
//         console.log(response.data.chart_data);
//         setData(response.data.chart_data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     }

//     setisLoading(true);
//     setData("");
//     fetchData();
//     setisLoading(false);
//   }, [node_data]);

//   if (!data) {
//     return (<div width="100" height="100">
//         <br></br>
//         <Loading data={''}/>
//       </div>);
//   }

//   let size = 0
//   if (data) {
//     for(const asset of data){
//       size = size + Number(asset.size)
//     }
//   }

  return (
    <div>
      <div className="dashboard-total-rewards-title">Delegations</div>
      <div className="dashboard-total-rewards-value">0<span>TRAC</span></div>
    </div>
  );
};

export default Delegations;
