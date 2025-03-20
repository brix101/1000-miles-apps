import NotFoundError from "@/middlewares/errors/not-found-error";
import type { CreateUserDTO, GetUserDTO } from "@/schemas/user.schema";
import {
  createUser,
  deleteUser,
  findUser,
  getUsers,
  updateUser,
} from "@/services/user.service";
import type { NextFunction, Request, Response } from "express";
import { omit } from "lodash";

export const getAllUserHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await getUsers();
    return res.json({ data });
  } catch (error) {
    next(error);
  }
};

export const getUserHandler = async (
  req: Request<GetUserDTO["params"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;

    const user = await findUser({ _id: id });

    if (!user) {
      const error = new NotFoundError("User not found");
      next(error);
      return;
    }

    const omitedUser = omit(
      user.toJSON(),
      "password",
      "permission_id",
      "role_id"
    );
    return res.send(omitedUser);
  } catch (error) {
    next(error);
  }
};

export const createUserHandler = async (
  req: Request<{}, {}, CreateUserDTO["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const body = req.body;

    const user = await createUser({
      ...body,
      password: body.password,
    });

    return res.status(201).send(user);
  } catch (error) {
    next(error);
  }
};

export const updateUserHandler = async (
  req: Request<GetUserDTO["params"]>,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const update = req.body;

  const user = await findUser({ _id: id });

  if (!user) {
    const error = new NotFoundError("User not found");
    next(error);
    return;
  }

  try {
    if (update.password === "") {
      delete update.password;
    }

    const updatedUser = await updateUser({ _id: id }, update, {
      new: true,
      populate: "allowedModules",
    });

    return res.send(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const deleteUserHandler = async (
  req: Request<GetUserDTO["params"]>,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const user = await findUser({ _id: id });

  if (!user) {
    const error = new NotFoundError("User not found");
    next(error);
    return;
  }

  try {
    await deleteUser({ _id: id });
    return res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
