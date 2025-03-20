import type { Router } from "express";
import express from "express";

import {
  authenticateHandler,
  getCurrentUserHandler,
  getRefreshTokenHandler,
  signOutHandler,
} from "@/controllers/auth.controller";
import requireUser from "@/middlewares/require-user";
import validateResource from "@/middlewares/validate-resource";
import { authenticateSchema } from "@/schemas/auth.schema";

const router: Router = express.Router();

router.post("/", validateResource(authenticateSchema), authenticateHandler);
router.get("/whoami", getCurrentUserHandler);
router.post("/refresh", getRefreshTokenHandler);
router.post("/sign-out", requireUser, signOutHandler);

export default router;
