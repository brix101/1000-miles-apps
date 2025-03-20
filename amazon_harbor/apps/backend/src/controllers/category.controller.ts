import { getCategorySummary } from "@/services/zulu-category.service";
import type { NextFunction, Request, Response } from "express";

export const getCategorySummariesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const marketplaceId = (req.query.marketplace as string) || "ATVPDKIKX0DER"; // Use the query parameter or default to 'USA'

    const items = await getCategorySummary(marketplaceId);

    return res.json({ items });
  } catch (error) {
    next(error);
  }
};
