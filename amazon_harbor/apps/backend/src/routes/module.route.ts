import type { Router } from "express";
import express from "express";

import { getAllModulesHandler } from "@/controllers/module.controller";
import requireUser from "@/middlewares/require-user";

const router: Router = express.Router();

router.get("/", requireUser, getAllModulesHandler);

export default router;
