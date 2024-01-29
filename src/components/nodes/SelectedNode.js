import React, { useState, useEffect } from "react";
import Stats from "./stats";
import Rewards from "./charts/rewards";
import PubsCommited from "./charts/pubsCommited";
import EstimatedEarnings from "./charts/estimatedEarnings";
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
          nodeId: settings.data[0].nodeId,
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

  return (
    <div className="node-pop">
      <div className="node-pop-div">
        <Stats
          data={[
            {
              blockchain_id: settings.data[0].blockchain_id,
              blockchain_name: settings.data[0].blockchain_name,
              nodeId: settings.data[0].nodeId,
              node_name: settings.data[0].node_name,
            },
          ]}
        />
      </div>
      <div className="node-pop-div">
        <Rewards
          data={[
            {
              blockchain_id: settings.data[0].blockchain_id,
              blockchain_name: settings.data[0].blockchain_name,
              nodeId: settings.data[0].nodeId,
              node_name: settings.data[0].node_name,
              node_data: data,
            },
          ]}
        />
      </div>
      <div className="node-pop-div">
        <PubsCommited
          data={[
            {
              blockchain_id: settings.data[0].blockchain_id,
              blockchain_name: settings.data[0].blockchain_name,
              nodeId: settings.data[0].nodeId,
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
              nodeId: settings.data[0].nodeId,
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
