import type { Router } from "express";
import express from "express";

import {
  getListingsHandler,
  getListingsProductsHandler,
} from "@/controllers/listing.controller";
import requireUser from "@/middlewares/require-user";

const router: Router = express.Router();

router.get("", requireUser, getListingsHandler);
router.get("/products", requireUser, getListingsProductsHandler);

export default router;
