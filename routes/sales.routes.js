import { Router } from "express";
import {
  getSalesGrowthRateOverTime,
  getTotalSalesOverTime,
} from "../controllers/sales.controllers.js";

const router = Router();

router.get("/total-over-time", getTotalSalesOverTime);
router.get("/growth-rate", getSalesGrowthRateOverTime);

export default router;
