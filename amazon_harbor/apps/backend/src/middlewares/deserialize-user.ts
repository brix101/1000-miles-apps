import { REFRESH_COOKIE_NAME } from "@/constant/constant";
import { reIssueAccessToken } from "@/services/auth.service";
import { verifyJwt } from "@/utils/jwt.util";
import type { NextFunction, Request, Response } from "express";
import { get } from "lodash";

const deserializeUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const accessToken = get(req, "headers.authorization", "").replace(
    /^Bearer\s/,
    ""
  );

  const refreshToken = get(req, `cookies.${REFRESH_COOKIE_NAME}`);

  if (!accessToken) {
    next();
    return;
  }

  const { decoded, expired } = verifyJwt(
    accessToken,
    "ACCESS_TOKEN_PUBLIC_KEY"
  );

  if (decoded) {
    res.locals.user = decoded;
    next();
    return;
  }

  if (expired && refreshToken) {
    const { user, accessToken: newAccessToken } =
      await reIssueAccessToken(refreshToken);

    if (newAccessToken) {
      res.setHeader("x-access-token", newAccessToken);
      res.locals.user = user;
    }
    next();
    return;
  }

  next();
};

export default deserializeUser;
