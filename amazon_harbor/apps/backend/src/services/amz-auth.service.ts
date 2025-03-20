import logger from "@repo/logger";
import type { AxiosResponse } from "axios";
import axios from "axios";

interface AccessTokenParams {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
}

/**
 * Function to refresh the access token
 * @param params - Object containing clientId, clientSecret, and refreshToken
 * @returns The refreshed access token
 */
export async function refreshAcessToken(
  params: AccessTokenParams
): Promise<TokenResponse> {
  // Destructure parameters
  const { clientId, clientSecret, refreshToken } = params;

  try {
    // Send a POST request to the API to refresh the access token
    const response: AxiosResponse<TokenResponse> = await axios.post(
      "https://api.amazon.com/auth/o2/token", // API endpoint
      {
        // Request payload
        grant_type: "refresh_token",
        client_id: clientId,
        client_secret: clientSecret,
        refresh_token: refreshToken,
      }
    );

    // Extract the new access token from the response
    // Return the new access token
    return response.data;
  } catch (error) {
    logger.error(error, "Error getting access token");
    throw error; // Rethrow the error to be caught by the caller
  }
}
