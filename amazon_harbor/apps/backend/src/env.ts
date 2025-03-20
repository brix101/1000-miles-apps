import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  /*
   * Serverside Environment variables, not available on the client.
   * Will throw if you access these variables on the client.
   */
  server: {
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    PORT: z.coerce.number().default(5000),
    DATABASE_URL: z.string().url(),
    DATABASE_NAME: z.string(),

    AUTH_REFRESH_TOKEN: z.string(),
    LWA_APP_ID: z.string(),
    LWA_CLIENT_SECRET: z.string(),

    ADS_REDIRECT_URI: z.string(),
    ADS_REFRESH_TOKEN: z.string(),
    ADS_CLIENT_ID: z.string(),
    ADS_CLIENT_SECRET: z.string(),

    ACCESS_TOKEN_PRIVATE_KEY: z.string(),
    ACCESS_TOKEN_PUBLIC_KEY: z.string(),
    REFRESH_PRIVATE_KEY: z.string(),
    REFRESH_PUBLIC_KEY: z.string(),

    ZULU_LIVE: z.string(),
    ZULU_LOGIN: z.string(),
    ZULU_PASSWORD: z.string(),
    ZULU_DB: z.string(),
  },
  /*
   * Due to how Next.js bundles environment variables on Edge and Client,
   * we need to manually destructure them to make sure all are included in bundle.
   *
   * 💡 You'll get type errors if not all variables from `server` & `client` are included here.
   */
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    DATABASE_NAME: process.env.DATABASE_NAME,

    AUTH_REFRESH_TOKEN: process.env.AUTH_REFRESH_TOKEN,
    LWA_APP_ID: process.env.LWA_APP_ID,
    LWA_CLIENT_SECRET: process.env.LWA_CLIENT_SECRET,

    ADS_REDIRECT_URI: process.env.ADS_REDIRECT_URI,
    ADS_REFRESH_TOKEN: process.env.ADS_REFRESH_TOKEN,
    ADS_CLIENT_ID: process.env.ADS_CLIENT_ID,
    ADS_CLIENT_SECRET: process.env.ADS_CLIENT_SECRET,

    ACCESS_TOKEN_PRIVATE_KEY: process.env.ACCESS_TOKEN_PRIVATE_KEY,
    ACCESS_TOKEN_PUBLIC_KEY: process.env.ACCESS_TOKEN_PUBLIC_KEY,
    REFRESH_PRIVATE_KEY: process.env.REFRESH_PRIVATE_KEY,
    REFRESH_PUBLIC_KEY: process.env.REFRESH_PUBLIC_KEY,

    ZULU_LIVE: process.env.ZULU_LIVE,
    ZULU_LOGIN: process.env.ZULU_LOGIN,
    ZULU_PASSWORD: process.env.ZULU_PASSWORD,
    ZULU_DB: process.env.ZULU_DB,
  },
});
