import logger from "@repo/logger";
import mongoose from "mongoose";

import { env } from "@/env";

async function connect() {
  try {
    const res = await mongoose.connect(env.DATABASE_URL, {
      dbName: env.DATABASE_NAME,
    });
    logger.info(
      `Mongodb connection established on ${res.connection.name} at ${res.connection.host}`
    );
  } catch (error) {
    logger.error("Could not connect to db");
    logger.error(error);
    process.exit(1);
  }
}

export default connect;
