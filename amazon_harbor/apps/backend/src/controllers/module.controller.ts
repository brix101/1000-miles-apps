import { getModules } from "@/services/module.service";
import type { NextFunction, Request, Response } from "express";

export const getAllModulesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await getModules();
    return res.json({ data });
  } catch (error) {
    next(error);
  }
};
