import type { Router } from "express";
import express from "express";

import {
  getProductHandler,
  updateProductHandler,
} from "@/controllers/product.controller";
import requireUser from "@/middlewares/require-user";

const router: Router = express.Router();

router.get("/:asin", getProductHandler);
router.put("/:asin", requireUser, updateProductHandler);

export default router;
