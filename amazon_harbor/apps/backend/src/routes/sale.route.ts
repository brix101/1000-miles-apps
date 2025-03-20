import type { Router } from "express";
import express from "express";

import {
  getSaleAndTrafficHandler,
  getSalesAndTrafficByProductHandler,
} from "@/controllers/sale-and-traffic.controller";
import {
  getOrderMetricsHandler,
  getSalesByProductHandler,
} from "@/controllers/sale.controller";
import requireUser from "@/middlewares/require-user";

const router: Router = express.Router();

router.get("/orderMetrics", requireUser, getOrderMetricsHandler);
router.get("/salesByProducts", requireUser, getSalesByProductHandler);
router.get("/sale-and-traffic", requireUser, getSaleAndTrafficHandler);
router.get(
  "/sale-and-traffic-by-product",
  requireUser,
  getSalesAndTrafficByProductHandler
);

export default router;
