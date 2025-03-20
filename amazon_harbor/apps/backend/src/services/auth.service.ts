import { verifyJwt } from "@/utils/jwt.util";
import { get } from "lodash";
import { findUser } from "./user.service";

/**
 * Reissues an access token using the provided refresh token.
 * @param refreshToken - The refresh token used to reissue the access token.
 * @returns An object containing user information and a new access token, or null values if the refresh token is invalid or the user is inactive.
 */
export async function reIssueAccessToken(refreshToken: string) {
  const { decoded } = verifyJwt(refreshToken, "REFRESH_PUBLIC_KEY");

  if (!decoded) {
    return { user: null, sub: null, accessToken: null };
  }

  const user = await findUser({ _id: get(decoded, "sub") });

  if (!user || !user.active) {
    return { user: null, sub: null, accessToken: null };
  }

  const accessToken = user.getAccessToken();

  return { user, accessToken };
}
