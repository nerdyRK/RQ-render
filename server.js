import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { connectDB, db } from "./db.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
const app = express();

import salesRoutes from "./routes/sales.routes.js";
import customerRoutes from "./routes/customer.routes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
app.use(express.static(path.join(__dirname, "dist")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use("/api/sales", salesRoutes);
app.use("/api/customers", customerRoutes);

connectDB().then(() => {
  app.listen(process.env.PORT || 5000, () => {
    console.log("Server is running on port 5000");
  });
});

app.get("/products", async (req, res) => {
  try {
    const collection = db.collection("shopifyOrders");

    const data = await collection.find({}).toArray();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error retrieving data:", error);
    res.status(500).send("Internal Server Error");
  }
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});
