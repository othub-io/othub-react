import React, { useState, useEffect } from "react";
import Loading from "../effects/Loading";
import Stats from "./stats";
import CumRewards from "./charts/cumRewards";
import PubsCommited from "../my-othub/node-dashboard/charts/pubsCommited";
import Rewards from "../my-othub/node-dashboard/charts/rewards";
import CumPubsCommited from "./charts/cumPubsCommited";
import EstimatedEarnings from "./charts/estimatedEarnings";
import NodeStake from "../my-othub/node-dashboard/charts/nodeStake";
import axios from "axios";
let ext;

ext = "http";
if (process.env.REACT_APP_RUNTIME_HTTPS === "true") {
  ext = "https";
}

const NodeSettings = (settings) => {
  const [data, setData] = useState("");
  const [stats, setStats] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setStats("");

        let request_data = {
          node: settings.data[0],
          timeframe: "All",
        };

        const response = await axios
          .post(
            `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/nodes/nodeData`,
            request_data
          )
          .then((response) => {
            // Handle the successful response here
            return response.data;
          })
          .catch((error) => {
            // Handle errors here
            console.error(error);
          });
        setData(response.chart_data);

        const request_data1 = {
          blockchain: settings.data[0].blockchain_name,
          node: settings.data[0].nodeId,
        };

        const response1 = await axios.post(
          `${ext}://${process.env.REACT_APP_RUNTIME_HOST}/nodes/nodeStats`,
          request_data1
        );

        setStats(response1.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setData("");
    fetchData();
  }, []);

  console.log(data);

  return (
    <div className="node-pop">
      <div className="node-pop-div">
        <Stats
          data={[
            {
              blockchain_id: settings.data[0].blockchain_id,
              blockchain_name: settings.data[0].blockchain_name,
              node: settings.data[0].nodeId,
              node_name: settings.data[0].node_name,
            },
          ]}
        />
      </div>
      <div className="node-pop-div">
        <CumRewards
          data={[
            {
              blockchain_id: settings.data[0].blockchain_id,
              blockchain_name: settings.data[0].blockchain_name,
              node: settings.data[0].nodeId,
              node_name: settings.data[0].node_name,
              node_data: data,
            },
          ]}
        />
      </div>
      <div className="node-pop-div">
        <CumPubsCommited
          data={[
            {
              blockchain_id: settings.data[0].blockchain_id,
              blockchain_name: settings.data[0].blockchain_name,
              node: settings.data[0].nodeId,
              node_name: settings.data[0].node_name,
              node_data: data,
            },
          ]}
        />
      </div>
      <div className="node-pop-div">
        <EstimatedEarnings
          data={[
            {
              blockchain_id: settings.data[0].blockchain_id,
              blockchain_name: settings.data[0].blockchain_name,
              node: settings.data[0].nodeId,
              node_name: settings.data[0].node_name,
              node_data: data,
            },
          ]}
        />
      </div>
    </div>
  );
};

export default NodeSettings;
