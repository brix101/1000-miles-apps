import type { Router } from "express";
import express from "express";

import { getReturnsHandler } from "@/controllers/returns.controller";
import requireUser from "@/middlewares/require-user";

const router: Router = express.Router();

router.get("/metrics", requireUser, getReturnsHandler);

export default router;
