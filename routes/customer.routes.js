import { Router } from "express";
import {
  getCustomerLifetimeValueByCohorts,
  getGeographicalDistribution,
  getNewCustomersOverTime,
  getRepeatCustomers,
} from "../controllers/customer.controllers.js";

const router = Router();

router.get("/geographical-distribution", getGeographicalDistribution);

router.get("/new-customers", getNewCustomersOverTime);

router.get("/repeat-customers", getRepeatCustomers);
router.get("/value", getCustomerLifetimeValueByCohorts);
export default router;
