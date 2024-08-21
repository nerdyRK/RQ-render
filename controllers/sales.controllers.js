import { db } from "../db.js";

export const getTotalSalesOverTime = async (req, res) => {
  try {
    const { interval } = req.query;
    let dateFormat;
    switch (interval) {
      case "daily":
        dateFormat = "%Y-%m-%d";
        break;
      case "monthly":
        dateFormat = "%Y-%m";
        break;
      case "quarterly":
        dateFormat = {
          $concat: [
            { $toString: { $year: "$created_at" } }, // Convert year to string
            "-Q",
            {
              $toString: { $ceil: { $divide: [{ $month: "$created_at" }, 3] } },
            },
          ],
        };
        break;
      case "yearly":
        dateFormat = "%Y";
        break;
      default:
        return res.status(400).send("Invalid interval");
    }

    const pipeline = [
      {
        $match: {
          created_at: { $exists: true },
          "total_price_set.shop_money.amount": { $exists: true, $ne: null },
        },
      },
      {
        $project: {
          total_price_numeric: {
            $toDouble: "$total_price_set.shop_money.amount",
          },
          created_at: {
            $dateFromString: { dateString: "$created_at" },
          },
        },
      },
      {
        $group: {
          _id:
            interval === "quarterly"
              ? dateFormat
              : { $dateToString: { format: dateFormat, date: "$created_at" } },
          totalSales: { $sum: "$total_price_numeric" },
        },
      },
      { $sort: { _id: 1 } },
    ];

    const data = await db
      .collection("shopifyOrders")
      .aggregate(pipeline)
      .toArray();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error during aggregation:", error);
    res.status(500).send("Internal Server Error");
  }
};

export const getSalesGrowthRateOverTime = async (req, res) => {
  try {
    const ordersCollection = db.collection("shopifyOrders");

    const salesData = await ordersCollection
      .aggregate([
        {
          $addFields: {
            created_at_date: { $toDate: "$created_at" }, // Convert created_at to date
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$created_at_date" },
              month: { $month: "$created_at_date" },
            },
            totalSales: { $sum: { $toDouble: "$total_price" } }, // Summing up sales for each period
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } }, // Sort by date
      ])
      .toArray();

    const growthRateData = salesData.map((current, index) => {
      if (index === 0) {
        return { ...current, growthRate: null }; // No growth rate for the first period
      }

      const previous = salesData[index - 1];
      const growthRate =
        ((current.totalSales - previous.totalSales) / previous.totalSales) *
        100;

      return { ...current, growthRate };
    });

    res.status(200).json(growthRateData);
  } catch (error) {
    console.error("Error calculating sales growth rate:", error);
    res.status(500).send("Internal Server Error");
  }
};
