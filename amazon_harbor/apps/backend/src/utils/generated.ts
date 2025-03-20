import dailyBrandUpdateJob from "@/cron/daily-brand-update-job";
import dailyMarketplaceUpdateJob from "@/cron/daily-marketplace-update-job";
import BrandModel from "@/models/brand.model";
import CompanyModel from "@/models/company.model";
import MarketplaceModel from "@/models/marketplace.model";
import ModuleModel from "@/models/module.model";
import UserModel from "@/models/user.model";
import logger from "@repo/logger";

export const seed = async () => {
  const marketplaceCount = await MarketplaceModel.countDocuments();
  if (marketplaceCount <= 0) {
    await dailyMarketplaceUpdateJob();
  }

  const brandCount = await BrandModel.countDocuments();
  if (brandCount <= 0) {
    await dailyBrandUpdateJob();
  }

  const moduleCount = await ModuleModel.countDocuments();

  if (moduleCount <= 0) {
    await ModuleModel.insertMany([
      { name: "Listings" },
      { name: "Procurement" },
      { name: "Sales" },
      { name: "Advertising" },
    ]);
    logger.info("Module seeded");
  }

  const companyCount = await CompanyModel.countDocuments();

  if (companyCount <= 0) {
    await CompanyModel.insertMany([
      { name: "1000 Miles" },
      { name: "Merchwise" },
    ]);
    logger.info("Company seeded");
  }

  const userCount = await UserModel.countDocuments();

  if (userCount <= 0) {
    const modulesData = await ModuleModel.find().lean();
    await UserModel.create({
      name: "John doe",
      email: "john.doe@example.com",
      password: "Password",
      isSuperAdmin: true,
      allowedModules: modulesData,
    });
    logger.info("User Seeded seeded");
  }
};
