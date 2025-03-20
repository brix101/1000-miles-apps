import type { Router } from "express";
import express from "express";

import { getProcurementsProductsHandler } from "@/controllers/procurement.controller";
import requireUser from "@/middlewares/require-user";

const router: Router = express.Router();

router.get("/products", requireUser, getProcurementsProductsHandler);

export default router;
