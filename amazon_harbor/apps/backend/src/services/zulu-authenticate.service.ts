import { env } from "@/env";
import logger from "@repo/logger";
import axios from "axios";

interface Params {
  login: string;
  password: string;
  db: string;
}

export async function zuluAuthenticate(params: Params) {
  try {
    logger.info("Authenticating with Zulu");
    const response = await axios.post(
      env.ZULU_LIVE + "/web/session/authenticate",
      {
        params: params,
      }
    );
    logger.info("Authenticated with Zulu");
    return response.data.result.session_id;
  } catch (error) {
    logger.error(error, "Error getting access token");
    throw error; // Rethrow the error to be caught by the caller
  }
}
