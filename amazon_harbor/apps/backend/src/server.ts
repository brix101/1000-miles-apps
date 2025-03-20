import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import http from "http";
import morgan from "morgan";

import deserializeUser from "@/middlewares/deserialize-user";
import errorCatcher from "@/middlewares/error-catcher";
import routes from "@/routes";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import utc from "dayjs/plugin/utc";
import weekday from "dayjs/plugin/weekday";

dayjs.extend(utc);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);
dayjs.extend(quarterOfYear);
dayjs.extend(weekday);

export const createServer = () => {
  const app = express();

  app.use(
    cors({
      origin: ["http://localhost:5173", "http://1000miles.info"],
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(deserializeUser);
  app.use(morgan("dev"));

  app.use("/api", routes);

  app.use(errorCatcher);

  const server = http.createServer(app);

  return server;
};
