import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,

  Title,
  Tooltip,
  Legend
);

const RepeatCustomersChart = () => {
  const [chartData, setChartData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [interval, setInterval] = useState("monthly"); // Default interval

  useEffect(() => {
    const fetchRepeatCustomers = async () => {
      try {
        const response = await axios.get(
          `/api/customers/repeat-customers?interval=${interval}`
        );
        const data = response.data;

        // Prepare data for the chart
        const labels = data.map((item) => item._id);
        const values = data.map((item) => item.repeatCustomers);

        setChartData({
          labels,
          datasets: [
            {
              label: "Number of Repeat Customers",
              data: values,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
        setLoading(false);
      }
    };

    fetchRepeatCustomers();
  }, [interval]);

  const handleIntervalChange = (event) => {
    setInterval(event.target.value);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h3>Repeat Customers Over Time</h3>
      <div>
        <label htmlFor="interval-select">Select Interval: </label>
        <select
          id="interval-select"
          onChange={handleIntervalChange}
          value={interval}
        >
          <option value="daily">Daily</option>
          <option value="monthly">Monthly</option>
          <option value="quarterly">Quarterly</option>
          <option value="yearly">Yearly</option>
        </select>
      </div>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Number of Repeat Customers",
            },
          },
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
            },
          },
        }}
      />
    </div>
  );
};

export default RepeatCustomersChart;
