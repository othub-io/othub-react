import React, { useState, useEffect } from "react";
import Stats from "./stats";
import Rewards from "./charts/rewards";
import PubsCommited from "./charts/pubsCommited";
import EstimatedEarnings from "./charts/estimatedEarnings";
import ShareValue from "./charts/shareValue";
import axios from "axios";

const config = {
  headers: {
    "X-API-Key": process.env.REACT_APP_OTHUB_KEY,
  },
};

const NodeSettings = (settings) => {
  const [data, setData] = useState("");
  const [stats, setStats] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        setStats("");

        let data = {
          timeframe: "1000",
          frequency: "daily",
          blockchain: settings.data[0].blockchain,
          nodeId: settings.data[0].nodeId,
          grouped: "no"
        };

        let response = await axios.post(
          `${process.env.REACT_APP_API_HOST}/nodes/stats`,
          data, 
          config
        );
        setData(response.data.result);

        // data = {
        //   timeframe: "",
        //   frequency: "last24h",
        //   blockchain: settings.data[0].blockchain,
        //   nodeId: settings.data[0].nodeId,
        //   grouped: "no"
        // };

        // response = await axios.post(
        //   `${process.env.REACT_APP_API_HOST}/nodes/stats`,
        //   data, 
        //   config
        // );

        // setStats(response.data.result);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    setData("");
    fetchData();
  }, []);

  return data ? (
    <div className="node-pop">
      <div className="node-pop-div-large" style={{marginBottom: '-5px'}}>
        <ShareValue
          data={[
            {
              blockchain_id: settings.data[0].blockchain_id,
              blockchain: settings.data[0].blockchain,
              nodeId: settings.data[0].nodeId,
              nodeName: settings.data[0].nodeName,
              node_data: data,
            },
          ]}
        />
      </div>
      <div className="node-pop-div">
        <Stats
          data={[
            {
              blockchain_id: settings.data[0].blockchain_id,
              blockchain: settings.data[0].blockchain,
              nodeId: settings.data[0].nodeId,
              nodeName: settings.data[0].nodeName,
              node_data: data,
            },
          ]}
        />
      </div>
      <div className="node-pop-div">
        <Rewards
          data={[
            {
              blockchain_id: settings.data[0].blockchain_id,
              blockchain: settings.data[0].blockchain,
              nodeId: settings.data[0].nodeId,
              nodeName: settings.data[0].nodeName,
              node_data: data
            },
          ]}
        />
      </div>
      <div className="node-pop-div">
        <PubsCommited
          data={[
            {
              blockchain_id: settings.data[0].blockchain_id,
              blockchain: settings.data[0].blockchain,
              nodeId: settings.data[0].nodeId,
              nodeName: settings.data[0].nodeName,
              node_data: data,
            },
          ]}
        />
      </div>
      <div className="node-pop-div"  style={{marginBottom: '10px'}}>
        <EstimatedEarnings
          data={[
            {
              blockchain_id: settings.data[0].blockchain_id,
              blockchain: settings.data[0].blockchain,
              nodeId: settings.data[0].nodeId,
              nodeName: settings.data[0].nodeName,
              node_data: data,
            },
          ]}
        />
      </div>
    </div>
  ): (<div></div>);
};

export default NodeSettings;
