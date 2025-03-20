import type { Router } from "express";
import express from "express";

import {
  getMarketplaceParticipationsHandler,
  getMarketplacesHandler,
} from "@/controllers/marketplace.controller";
import requireUser from "@/middlewares/require-user";

const router: Router = express.Router();

router.get("/participations", requireUser, getMarketplaceParticipationsHandler);
router.get("/", requireUser, getMarketplacesHandler);

export default router;
