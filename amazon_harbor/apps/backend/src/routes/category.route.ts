import type { Router } from "express";
import express from "express";

import { getCategorySummariesHandler } from "@/controllers/category.controller";

const router: Router = express.Router();

router.get("/summaries", getCategorySummariesHandler);

export default router;
