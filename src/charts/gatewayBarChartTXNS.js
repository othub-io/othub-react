import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChartTXNS = ({ data }) => {
  // Extract labels and data from the dataset
  const labels = ['COMPLETE', 'PENDING', 'REJECTED'];

  let complete_count = 0
  let pending_count = 0
  let rejected_count = 0

  for(let i = 0; i < data.length;i++){
    if(data[i].progress === 'COMPLETE'){
        complete_count = complete_count + 1
    }
    if(data[i].progress === 'PENDING'){
        pending_count = pending_count + 1
    }
    if(data[i].progress === 'REJECTED'){
        rejected_count = rejected_count + 1
    }
  }

  const counts = [complete_count,pending_count,rejected_count]
  
  const formattedData = {
    labels: labels,
    datasets: [
      {
        data: counts,
        fill: false,
        backgroundColor: ['#6344df','#6344df','#6344df'],
      },
    ],
  };

  const options = {
    indexAxis: 'y',
    elements: {
      bar: {
        borderWidth: 2,
      },
    },
    responsive: true,
    plugins: {
      legend: {
        display: false,
        position: 'right',
      },
      title: {
        display: false,
        text: 'Asset Activity',
      },
    },
  };

  return <Bar data={formattedData} options={options} width="2200" height="950"/>;
};

export default BarChartTXNS

