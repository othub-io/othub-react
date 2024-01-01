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

const NodeCommits = (node_data) => {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setisLoading] = useState(false);
  const [data, setData] = useState("");

  let sub_scan_link = "https://";
  let link_type = "origintrail";
  let explorer_url = "https://dkg.origintrail.io";

  if (node_data.data[0].network === "Origintrail Parachain Testnet") {
    link_type = "origintrail-testnet";
    explorer_url = "https://dkg-testnet.origintrail.io";
  }
  sub_scan_link = sub_scan_link + link_type + ".subscan.io";

  useEffect(() => {
    async function fetchData() {
      try {
        setisLoading(true);
        const time_data = {
          timeframe: "All",
          network: node_data.data[0].network,
          nodeId: node_data.data[0].nodeId,
          public_address: node_data.data[0].public_address,
        };

        const response = await axios.post(
          `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/node-dashboard/nodeCommits`,
          time_data
        );
        setData(response.data.chart_data);
        setisLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
    const intervalId = setInterval(fetchData, 60000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [node_data]);

  if (!data) {
    return (<Loading />)
  }

  return (
    data && (
      <div>
        <div className="dashboard-assets-history-title">Node Activity</div>
        <div className="dashboard-assets-history-list">
          {data.map((record) => (
            <div className="dashboard-assets-history-list-item">
              <div className="dashboard-assets-history-timestamp">
                {record.datetime}
              </div>
              {/* <div>{asset.tokenName}</div> */}
              <div className="dashboard-assets-history-head">
                
                  <div>
                  <span className={`dashboard-assets-history-event-name-${record.eventName}`}>{`${record.tokenName.substring(0, 10)} ${record.eventName}: `}</span>
                    <a
                      target ="_blank"
                      href={`${explorer_url}/explore?ual=${record.UAL}`}
                      style={{ color: "#6344df", textDecoration: "none" }}
                    >
                      {record.UAL}
                    </a>{" "}
                    <a
                    target ="_blank"
                      href={sub_scan_link + "/tx/" + record.transactionHash}
                      style={{ color: "#cccccc", textDecoration: "none" }}
                    >
                      {" | Txn: " + record.transactionHash.substring(0, 25)+"..."}
                    </a>
                  </div>
              </div>
              <div
                className={`dashboard-assets-history-event-${record.eventName}`}
              >
                {record.eventName === "CommitSubmitted" ?  (`Est. Earning: ${Number(record.eventValue1).toFixed(5)} Trac`) : ("")}
                {record.eventName === "ProofSubmitted" ?  (`Rewarded: ${Number(record.eventValue1).toFixed(5)} Trac`) : ("")}
                {record.eventName === "AskUpdated" ?  (`Ask Updated to: ${Number(record.eventValue1).toFixed(5)} Trac`) : ("")}
                {record.eventName === "StakeIncreased" ?  (`Stake Increased to: ${Number(record.eventValue1).toFixed(5)} Trac`) : ("")}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default NodeCommits;
