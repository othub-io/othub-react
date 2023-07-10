import React from 'react'
import { Line } from 'react-chartjs-2';
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

  console.log(data)
  data = JSON.parse(data)
  // Extract labels and data from the dataset
  const labels = data.map((item) => moment(item.date).format('DD MMM'));
  const pubCounts = data.map((item) => item.totalPubs);
  
  console.group(pubCounts)
  const formattedData = {
    labels: labels,
    datasets: [
      {
        label: 'Publication Count',
        data: pubCounts,
        fill: false,
        borderColor: '#6168ED',
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true, // Start the scale at 0
      },
    },
  };

  return <Line data={formattedData} options={options} />;
};

export default HomeChart

