import type { Request, Response, Router } from "express";
import express from "express";

import {
  getInventoryReportHandler,
  getSalesReportHandler,
} from "@/controllers/report.controller";
import dailyInventoryUpdateJob from "@/cron/daily-inventory-update-job";

const router: Router = express.Router();

router.get("/sales", getSalesReportHandler);
router.get("/inventory", getInventoryReportHandler);
router.get("/zulu-update", async (_req: Request, res: Response) => {
  await dailyInventoryUpdateJob();
  res.status(200).send(".");
});

export default router;
