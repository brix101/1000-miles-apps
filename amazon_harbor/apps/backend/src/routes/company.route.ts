import type { Router } from "express";
import express from "express";

import {
  createCompanyHandler,
  getAllCompaniesHandler,
  updateCompanyHandler,
} from "@/controllers/company.controller";
import requireUser from "@/middlewares/require-user";

const router: Router = express.Router();

router.get("/", requireUser, getAllCompaniesHandler);
router.post("/", requireUser, createCompanyHandler);
router.put("/:id", requireUser, updateCompanyHandler);

export default router;
