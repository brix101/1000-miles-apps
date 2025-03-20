import type { Request, Response, Router } from "express";
import express from "express";

import authRoutes from "@/routes/auth.route";
import brandRoutes from "@/routes/brand.route";
import campaignRoutes from "@/routes/campaign.route";
import categoryRoutes from "@/routes/category.route";
import companyRoutes from "@/routes/company.route";
import listingRoutes from "@/routes/listing.route";
import marketplaceRoutes from "@/routes/marketplace.route";
import moduleRoutes from "@/routes/module.route";
import procurementRoutes from "@/routes/procurement.route";
import productRoutes from "@/routes/product.route";
import reportRoutes from "@/routes/report.route";
import returnRoutes from "@/routes/return.route";
import saleRoutes from "@/routes/sale.route";
import shipmentRoutes from "@/routes/shipment.route";
import userRoutes from "@/routes/user.route";

const router: Router = express.Router();

router.get("/ping", (_req: Request, res: Response) => {
  res.status(200).send(".");
});
router.use("/auth", authRoutes);
router.use("/brands", brandRoutes);
router.use("/campaigns", campaignRoutes);
router.use("/categories", categoryRoutes);
router.use("/companies", companyRoutes);
router.use("/listings", listingRoutes);
router.use("/marketplaces", marketplaceRoutes);
router.use("/modules", moduleRoutes);
router.use("/procurements", procurementRoutes);
router.use("/products", productRoutes);
router.use("/reports", reportRoutes);
router.use("/returns", returnRoutes);
router.use("/sales", saleRoutes);
router.use("/shipments", shipmentRoutes);
router.use("/users", userRoutes);

export default router;
