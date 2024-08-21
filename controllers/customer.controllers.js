import { db } from "../db.js";
import { cityCoordinates } from "../utils/cityCoordinates.js";

export const getGeographicalDistribution = async (req, res) => {
  try {
    const customerCollection = db.collection("shopifyCustomers");

    // Aggregate data by city and count the number of customers in each city
    const locationData = await customerCollection
      .aggregate([
        {
          $group: {
            _id: "$default_address.city", // Grouping by city name
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0, // Hide the _id field
            city: "$_id", // Rename _id to city
            count: 1,
          },
        },
      ])
      .toArray();

    // Add coordinates to each city
    const locationDataWithCoordinates = locationData.map((entry) => {
      const coordinates = cityCoordinates[entry.city] || [0, 0]; // Default to [0, 0] if city not found
      return { ...entry, coordinates };
    });

    res.status(200).json(locationDataWithCoordinates);
  } catch (error) {
    console.error("Error retrieving customer location data:", error);
    res.status(500).send("Internal Server Error");
  }
};

// Helper function to get the start and end of a year
const getStartOfYear = (year) =>
  new Date(`${year}-01-01T00:00:00Z`).toISOString();
const getEndOfYear = (year) =>
  new Date(`${year + 1}-01-01T00:00:00Z`).toISOString();

export const getNewCustomersOverTime = async (req, res) => {
  try {
    const customerCollection = db.collection("shopifyCustomers");

    // Define the time range for aggregation
    const startYear = 2020;
    const endYear = 2021;

    const aggregationPipeline = [
      {
        $match: {
          created_at: {
            $gte: getStartOfYear(startYear),
            $lt: getEndOfYear(endYear),
          },
        },
      },
      {
        $addFields: {
          created_at_date: { $dateFromString: { dateString: "$created_at" } }, // Convert string to date
        },
      },
      {
        $project: {
          year: { $year: "$created_at_date" }, // Extract year from created_at_date
          month: { $month: "$created_at_date" }, // Extract month from created_at_date
        },
      },
      {
        $group: {
          _id: { year: "$year", month: "$month" }, // Group by year and month
          count: { $sum: 1 }, // Count customers
        },
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }, // Sort by year and month
      },
    ];

    const newCustomersData = await customerCollection
      .aggregate(aggregationPipeline)
      .toArray();

    res.status(200).json(newCustomersData);
  } catch (error) {
    console.error("Error retrieving new customers data:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const getRepeatCustomers = async (req, res) => {
  const { period } = req.query; // 'daily', 'monthly', 'quarterly', 'yearly'

  try {
    const orderCollection = db.collection("shopifyOrders");

    // Define the period format for grouping
    const dateFormat =
      period === "daily"
        ? "%Y-%m-%d"
        : period === "monthly"
        ? "%Y-%m"
        : period === "quarterly"
        ? "%Y-Q%q"
        : "%Y";

    // Pipeline to aggregate repeat customers
    const pipeline = [
      {
        $addFields: {
          created_at_date: {
            $dateFromString: {
              dateString: "$created_at",
            },
          },
        },
      },
      {
        $group: {
          _id: {
            customerId: "$customer_id",
            period: {
              $dateToString: {
                format: dateFormat,
                date: "$created_at_date",
              },
            },
          },
          count: { $sum: 1 },
        },
      },
      {
        $match: {
          count: { $gt: 1 }, // Filter for customers with more than one purchase
        },
      },
      {
        $group: {
          _id: "$_id.period",
          repeatCustomers: { $sum: 1 }, // Count repeat customers for each period
        },
      },
      {
        $sort: { _id: 1 }, // Sort by period
      },
    ];

    const repeatCustomerData = await orderCollection
      .aggregate(pipeline)
      .toArray();
    res.status(200).json(repeatCustomerData);
  } catch (error) {
    console.error("Error retrieving repeat customers data:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const getCustomerLifetimeValueByCohorts = async (req, res) => {
  try {
    const orderCollection = db.collection("shopifyOrders");

    // Pipeline to calculate the first purchase month for each customer
    const pipeline = [
      {
        $group: {
          _id: "$customer_id",
          firstPurchase: { $min: "$created_at_date" },
          totalValue: { $sum: "$total_price" },
        },
      },
      {
        $project: {
          _id: 0,
          cohort: {
            $dateToString: { format: "%Y-%m", date: "$firstPurchase" },
          },
          totalValue: 1,
        },
      },
      {
        $group: {
          _id: "$cohort",
          lifetimeValue: { $sum: "$totalValue" },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by cohort
      },
    ];

    const ltvByCohort = await orderCollection.aggregate(pipeline).toArray();
    res.status(200).json(ltvByCohort);
  } catch (error) {
    console.error(
      "Error retrieving customer lifetime value by cohorts:",
      error
    );
    res.status(500).send("Internal Server Error");
  }
};
