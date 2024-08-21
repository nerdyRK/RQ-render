import React from "react";
import TotalSalesChart from "./components/TotalSalesChart";
import RepeatCustomersChart from "./components/RepeatCustomersChart";
import Map from "./components/Map";
import NewCustomersChart from "./components/NewCustomersChart";
import SalesGrowthBarChart from "./components/SalesGrowthBarChart";

const App = () => {
  return (
    <div className="text-center">
      <h1 className="text-3xl font-bold my-4">Shopify Data Visualization</h1>

      <div
        className="border-b border-black pb-14"
        style={{ marginBottom: "50px" }}
      >
        <TotalSalesChart />
      </div>
      <div className="md:w-11/12 mx-auto border-b border-black pb-14">
        <h3 className="text-2xl font-bold my-4">Sales Growth Rate Over Time</h3>
        <SalesGrowthBarChart />
      </div>
      <div className="border-b border-black pb-14">
        <NewCustomersChart />
      </div>
      <div className="md:w-11/12 mx-auto my-6">
        <h3 className="text-2xl font-bold my-4">
          Geographical Distribution of Customers
        </h3>
        <Map />
      </div>
    </div>
  );
};

export default App;
