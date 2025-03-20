import BadRequestError from "@/middlewares/errors/bad-request-error";
import { getADSReport } from "@/services/amz-report-ads.service";
import type { NextFunction, Request, Response } from "express";

export const getCampaignsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const interval = req.query.interval as string; // Use the query parameter or default to 'USA'
    const status = req.query.status as string | undefined; // Use the query parameter or default to 'USA'

    if (!interval) {
      const error = new BadRequestError("Interval parameter is missing.");
      next(error);
      return;
    }

    const adsReports = await getADSReport(interval);

    const items = adsReports.filter((item) => {
      if (!status) {
        return true;
      } else if (status === "Active") {
        return item.campaignStatus === "ENABLED";
      }
      return item.campaignStatus !== "ENABLED";
    });

    return res.json({ items });
  } catch (error) {
    next(error);
  }
};
