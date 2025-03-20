import {
  getShipmentItems,
  getShipmentStatusItems,
} from "@/services/amz-shipment.service";
import type { NextFunction, Request, Response } from "express";

export const getAllShipmentsHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const status = (req.query.status as string | undefined)?.toUpperCase();
    const sellerSku = req.query.sellerSku as string | undefined;

    const shipmentItems = await getShipmentItems(status);

    const items = shipmentItems.filter((item) => {
      return sellerSku === undefined || item.SellerSKUs.includes(sellerSku);
    });

    return res.json({ items });
  } catch (error) {
    next(error);
  }
};

export const getShipmentStatuses = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const items = await getShipmentStatusItems();

    return res.json({ items });
  } catch (error) {
    next(error);
  }
};
