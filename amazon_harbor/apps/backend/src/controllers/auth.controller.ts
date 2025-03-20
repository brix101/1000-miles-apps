import { REFRESH_COOKIE_NAME } from "@/constant/constant";
import BadRequestError from "@/middlewares/errors/bad-request-error";
import type { AuthenticateDTO } from "@/schemas/auth.schema";
import { reIssueAccessToken } from "@/services/auth.service";
import { findUser, validatePassword } from "@/services/user.service";
import type { NextFunction, Request, Response } from "express";
import { get, omit } from "lodash";

export async function authenticateHandler(
  req: Request<{}, {}, AuthenticateDTO["body"]>,
  res: Response,
  next: NextFunction
) {
  try {
    // Validate the user's password
    const user = await validatePassword(req.body);

    if (!user || (user && !user.active)) {
      const error = new BadRequestError("Invalid Email or Password");
      next(error);
      return;
    }

    const accessToken = user.getAccessToken();
    const refreshToken = user.getRefreshToken();
    const omitedUser = omit(user.toJSON(), "password");

    // return access & refresh tokens
    res.cookie(REFRESH_COOKIE_NAME, refreshToken, {
      httpOnly: true,
    });

    return res.send({ user: omitedUser, accessToken });
  } catch (error) {
    next(error);
  }
}

export async function getCurrentUserHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const localUser = res.locals.user;

    if (!localUser) return res.send();

    const userId = localUser.sub;
    const user = await findUser({ _id: userId });

    const omitedUser = omit(
      user?.toJSON(),
      "password",
      "permission_id",
      "role_id"
    );

    return res.send(omitedUser);
  } catch (error) {
    next(error);
  }
}

export async function getRefreshTokenHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const refreshToken = get(req, `cookies.${REFRESH_COOKIE_NAME}`);

    if (refreshToken) {
      const { user, accessToken } = await reIssueAccessToken(refreshToken);
      if (accessToken) {
        const omitedUser = omit(
          user.toJSON(),
          "password",
          "permission_id",
          "role_id"
        );

        return res.send({ user: omitedUser, accessToken });
      }
    }

    return res.send();
  } catch (error) {
    next(error);
  }
}

export async function signOutHandler(req: Request, res: Response) {
  res.cookie(REFRESH_COOKIE_NAME, "", {
    httpOnly: true,
    expires: new Date(0),
  });

  return res.send();
}
