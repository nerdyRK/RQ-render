import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";

const TotalSalesChart = () => {
  const [salesData, setSalesData] = useState([]);
  const [interval, setInterval] = useState("monthly"); // Default interval

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/sales/total-over-time?interval=${interval}`
        );
        setSalesData(response.data);
      } catch (error) {
        console.error("Error fetching sales data:", error);
      }
    };

    fetchData();
  }, [interval]);

  const handleIntervalChange = (event) => {
    setInterval(event.target.value);
  };

  const chartData = {
    labels: salesData.map((item) => item._id), // Dates or periods
    datasets: [
      {
        label: "Total Sales",
        data: salesData.map((item) => item.totalSales), // Sales totals
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
      },
    ],
  };

  return (
    <div className="md:w-11/12 mx-auto">
      <h3 className="text-2xl font-bold">Total Sales Over Time</h3>
      <select
        className="my-4 border border-black cursor-pointer"
        onChange={handleIntervalChange}
        value={interval}
      >
        <option value="daily">Daily</option>
        <option value="monthly">Monthly</option>
        <option value="quarterly">Quarterly</option>
        <option value="yearly">Yearly</option>
      </select>
      <Line data={chartData} />
    </div>
  );
};

export default TotalSalesChart;
