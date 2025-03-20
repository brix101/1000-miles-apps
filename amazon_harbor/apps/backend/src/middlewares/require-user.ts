import type { NextFunction, Request, Response } from "express";

const requireUser = (req: Request, res: Response, next: NextFunction) => {
  const user = res.locals.user;

  if (!user) {
    return res.sendStatus(401);
  }

  next();
};

export default requireUser;
