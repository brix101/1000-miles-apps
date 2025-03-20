import type { Router } from "express";
import express from "express";

import {
  getAllBrandsHandler,
  getAllBrandsMarketplacesHandler,
} from "@/controllers/brands.controller";
import requireUser from "@/middlewares/require-user";

const router: Router = express.Router();

router.get("/", requireUser, getAllBrandsHandler);
router.get("/marketplaces", requireUser, getAllBrandsMarketplacesHandler);

export default router;
