import type { Router } from "express";
import express from "express";

import {
  getAllShipmentsHandler,
  getShipmentStatuses,
} from "@/controllers/shipment.controller";
import requireUser from "@/middlewares/require-user";

const router: Router = express.Router();

router.get("/", requireUser, getAllShipmentsHandler);
router.get("/statuses", requireUser, getShipmentStatuses);

export default router;
