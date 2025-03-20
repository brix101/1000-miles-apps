import type { Router } from "express";
import express from "express";

import {
  createUserHandler,
  deleteUserHandler,
  getAllUserHandler,
  getUserHandler,
  updateUserHandler,
} from "@/controllers/user.controller";
import requireUser from "@/middlewares/require-user";

const router: Router = express.Router();

router.get("/", requireUser, getAllUserHandler);
router.get("/:id", requireUser, getUserHandler);
router.post("/", requireUser, createUserHandler);
router.put("/:id", requireUser, updateUserHandler);
router.delete("/:id", requireUser, deleteUserHandler);

export default router;
