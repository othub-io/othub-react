import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {Chart, ArcElement} from 'chart.js'
Chart.register(ArcElement);

const GaugeChart = ({ data, maxValue }) => {
    maxValue = 5000
    data = JSON.parse(data)
    const count = Number(data)
    
    const gauge_data = {
        labels: ['OTP Pubs'],
        datasets: [
        {   
            data: [count, maxValue - count],
            backgroundColor: ['#6168ED', 'rgba(0,0,0,0.1)'],
            borderWidth: 0,
        },
        ],
    };

  const options = {
    type: 'doughnut',
    cutout: '80%', // Adjust the size of the gauge by changing the cutout value
    rotation: 82.25 * Math.PI, // Adjust the starting angle of the gauge needle
    circumference: 65 * Math.PI, // Adjust the angle range of the gauge needle
    responsive: true,
    tooltips: { 
        enabled: true,
        filter: function (tooltipItem) {
            console.log(tooltipItem)
            return tooltipItem.datasetIndex === 0;
        },
     },
    plugins: {
      legend: {
        display: false,
        position: "right",
        align: "middle",
    }
    },
  };

  return <Doughnut data={gauge_data} options={options}/>;
};

export default GaugeChart;


