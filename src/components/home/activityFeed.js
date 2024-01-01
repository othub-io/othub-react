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
        const params = {
          network: node_data.data[0].network,
        };

        const response = await axios.post(
          `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/activityFeed`,
          params
        );
        setData(response.data.chart_data);
        setisLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
    const intervalId = setInterval(fetchData, 30000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [node_data]);

  if (!data) {
    return (<Loading />)
  }

  return (
    data && (
      <div className="activity-feed">
        <div className="activity-feed-title"></div>
        <div className="activity-feed-list">
          {data.map((record) => (
            <div className="activity-feed-list-item">
              <div className="activity-feed-timestamp">
                {record.datetime ? (record.datetime.slice(0, -5)) : ("")}
              </div>
              <div className="activity-feed-head">
                  <div>
                  <span className={`activity-feed-event-name-${record.eventName}`}>{`${record.signer ? (record.signer.substring(0, 10)) : ("")} ${record.eventName}: `}</span>
                    <a
                      target ="_blank"
                      href={`${explorer_url}/explore?ual=${record.UAL}`}
                      style={{ color: "#6344df", textDecoration: "none" }}
                    >
                      {` Token Id ${record.tokenId}`}
                    </a>{" "}
                    <a
                    target ="_blank"
                      href={sub_scan_link + "/tx/" + record.transactionHash}
                      style={{ color: "#cccccc", textDecoration: "none" }}
                    >
                      {window.matchMedia("(max-width: 440px)").matches ? ("") : (" | Txn: " + record.transactionHash.substring(0, 12)+"...")}
                    </a>
                  </div>
              </div>
              <div
                className={`activity-feed-event-${record.eventName}`}
              >
                {record.eventName === "AssetCreated" ?  (`Paid ${Number(record.eventValue1).toFixed(5)} Trac`) : ("")}
                {record.eventName === "AssetUpdated" ?  (`Paid ${Number(record.eventValue1).toFixed(5)} Trac`) : ("")}
                {record.eventName === "AssetTransfered" ?  (`Paid ${Number(record.eventValue1).toFixed(5)} Trac`) : ("")}
                {record.eventName === "AssetBurnt" ?  (`Asset Burnt`) : ("")}
                {record.eventName === "CommitSubmitted" ?  (`Est. Earning ${Number(record.eventValue1).toFixed(5)} Trac`) : ("")}
                {record.eventName === "ProofSubmitted" ?  (`Rewarded ${Number(record.eventValue1).toFixed(5)} Trac`) : ("")}
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  );
};

export default NodeCommits;
