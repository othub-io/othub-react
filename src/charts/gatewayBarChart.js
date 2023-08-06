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

const BarChart = ({ data }) => {
  // Extract labels and data from the dataset
  const labels = ['Mints', 'Updates', 'Transfers'];

  let mint_count = 0
  let update_count = 0
  let transfer_count = 0

  for(let i = 0; i < data.length;i++){
    if(data[i].request === 'Mint' && data[i].progress === 'COMPLETE'){
        mint_count = mint_count + 1
    }

    if(data[i].request === 'Update' && data[i].progress === 'COMPLETE'){
        update_count = update_count + 1
    }
    if(data[i].request === 'Transfer' && data[i].progress === 'COMPLETE'){
        transfer_count = transfer_count + 1
    }
  }

  const counts = [mint_count,update_count,transfer_count]
  
  const formattedData = {
    labels: labels,
    datasets: [
      {
        data: counts,
        fill: false,
        backgroundColor: ['#6168ED','#6168ED','#6168ED'],
      },
      // {
      //   label: 'Expiring',
      //   data: expCounts,
      //   fill: false,
      //   borderColor: '#000000',
      // },
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
        position: 'right'
      },
      title: {
        display: false,
        text: 'Asset Activity',
      },
    },
  };

  return <Bar data={formattedData} options={options} width="2200" height="950"/>;
};

export default BarChart

