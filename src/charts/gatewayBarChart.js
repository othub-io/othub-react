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
    console.log(data[i].request)
    if(data[i].request === 'Mint'){
        mint_count = mint_count + 1
    }

    if(data[i].request === 'Update'){
        update_count = update_count + 1
    }
    if(data[i].request === 'Transfer'){
        transfer_count = transfer_count + 1
    }
  }

  const counts = [mint_count,update_count,transfer_count]
  
  const formattedData = {
    labels: labels,
    datasets: [
      {
        label: 'Mints',
        data: mint_count,
        fill: false,
        backgroundColor: ['#FF6384'],
      },
      {
        label: 'Updates',
        data: update_count,
        fill: false,
        backgroundColor: ['#36A2EB'],
      },
      {
        label: 'Transfers',
        data: transfer_count,
        fill: false,
        backgroundColor: ['#FFCE56'],
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
        position: 'right',
      },
      title: {
        display: true,
        text: 'Chart.js Horizontal Bar Chart',
      },
    },
  };

  return <Bar data={formattedData} options={options} width="3200" height="950"/>;
};

export default BarChart

