import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const SalesGrowthBarChart = () => {
  const [data, setSalesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/sales/growth-rate`);
        setSalesData(response.data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchData();
  }, []);

  // Prepare the chart data
  const chartData = {
    labels: data?.map((item) => `${item._id.month}/${item._id.year}`), // Labels for each month/year
    datasets: [
      {
        label: "Sales Growth Rate (%)",
        data: data.map((item) =>
          item.growthRate !== null ? item.growthRate : 0
        ),
        backgroundColor: data.map((item) =>
          item.growthRate < 0
            ? "rgba(255, 99, 132, 0.6)"
            : "rgba(54, 162, 235, 0.6)"
        ),
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Sales Growth Rate Over Time",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Growth Rate (%)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Month/Year",
        },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default SalesGrowthBarChart;
