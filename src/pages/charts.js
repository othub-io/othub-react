import React from "react";
import "../css/charts.css";
import AssetsMinted from "../charts/assetsMinted";
let ext;

ext = "http";
if (process.env.REACT_APP_RUNTIME_HTTPS === "true") {
  ext = "https";
}

const Charts = () => {
  const isMobile = window.matchMedia("(max-width: 480px)").matches;

  return (
    <div className="charts">
      <header className="charts-header">
        <div className="chart-container">
          <AssetsMinted />
        </div>
        <div className="chart-container"></div>
        <div className="chart-container"></div>
        <div className="chart-container"></div>
      </header>
    </div>
  );
};

export default Charts;
