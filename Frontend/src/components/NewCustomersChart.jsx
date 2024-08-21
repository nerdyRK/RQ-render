// src/NewCustomersChart.js
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend
);

const API_URL = "/api/customers/new-customers";

const NewCustomersChart = () => {
  const [data, setData] = useState({ labels: [], datasets: [] });

  useEffect(() => {
    fetch(API_URL)
      .then((response) => response.json())
      .then((newCustomersData) => {
        const labels = [];
        const dataPoints = [];

        newCustomersData.forEach(({ _id, count }) => {
          const month = _id.month < 10 ? `0${_id.month}` : _id.month;
          labels.push(`${_id.year}-${month}`);
          dataPoints.push(count);
        });

        setData({
          labels,
          datasets: [
            {
              label: "New Customers",
              data: dataPoints,
              fill: false,
              borderColor: "rgba(75, 192, 192, 1)",
              tension: 0.1,
            },
          ],
        });
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="md:w-11/12 mx-auto  my-4">
      <h2 className="text-2xl font-bold mb-4">New Customers Added Over Time</h2>
      <Line
        data={data}
        options={{
          scales: {
            x: {
              title: {
                display: true,
                text: "Month-Year",
              },
            },
            y: {
              title: {
                display: true,
                text: "Number of Customers",
              },
            },
          },
          plugins: {
            title: {
              display: true,
              text: "New Customers Added Over Time",
            },
            legend: {
              display: true,
            },
            tooltips: {
              mode: "label",
            },
          },
        }}
      />
    </div>
  );
};

export default NewCustomersChart;
