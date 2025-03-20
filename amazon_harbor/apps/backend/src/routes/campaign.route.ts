import type { Router } from "express";
import express from "express";

import { getCampaignsHandler } from "@/controllers/campaign.controller";

const router: Router = express.Router();

router.get("/", getCampaignsHandler);

export default router;
