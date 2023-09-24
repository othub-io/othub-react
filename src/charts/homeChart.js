import React from 'react'
import { Doughnut, Line } from 'react-chartjs-2';
import moment from 'moment';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const HomeChart = ({ data }) => {

  data = JSON.parse(data)
  // Extract labels and data from the dataset
  const labels = data.map((item) => moment(item.date).format('DD MMM'));
  // const expDate = data.map((item) => {
  //   const days_to_expire = Number(item.epochs_number) * Number(item.epoch_length_days) * 24 * 60 * 60 * 1000

  //   const date = new Date(item.block_ts_hour);
  //   const mint_date = date.getTime();

  //   const expire_date = mint_date + days_to_expire
  //   const expire_date_fancy = new Date(expire_date).toISOString();
  //   return expire_date_fancy
  // });

  const pubCounts = data.map((item) => item.totalPubs);
  // let expCounts = 0
  // for(let i = 0; i < data.length;i++){
  //   let item = data[i]
  //   const days_to_expire = Number(item.epochs_number) * Number(item.epoch_length_days) * 24 * 60 * 60 * 1000
  //   if(days_to_expire <= 0){
  //     expCounts = expCounts + 1
  //   }
  // }
  
  const formattedData = {
    labels: labels,
    datasets: [
      {
        label: 'OTP Publication',
        data: pubCounts,
        fill: false,
        borderColor: '#6168ED',
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
    scales: {
      y: {
        beginAtZero: true, // Start the scale at 0
      },
    },
  };

  return <Line data={formattedData} options={options} width="3200" height="950"/>;
};

export default HomeChart

