import initializeCron from "@/cron";
import { env } from "@/env";
import { createServer } from "@/server";
import connect from "@/utils/connect";
import { seed } from "@/utils/generated";
import logger from "@repo/logger";

const port = env.PORT;
const server = createServer();

const app = server.listen(port, async (): Promise<void> => {
  await connect();
  await seed();
  initializeCron();
  logger.info(`Backend running on port ${port}`);
});

process.on("SIGTERM", () => {
  logger.info("SIGTERM signal received.");
  logger.info("Closing http server.");
  app.close((err) => {
    logger.info("Http server closed.");
    process.exit(err ? 1 : 0);
  });
});
