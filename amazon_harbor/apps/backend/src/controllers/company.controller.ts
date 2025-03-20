import NotFoundError from "@/middlewares/errors/not-found-error";
import { CreateCompanyDTO, GetCompanyDTO } from "@/schemas/company.schema";
import {
  createCompany,
  getCompanies,
  updateCompany,
} from "@/services/company.service";
import type { NextFunction, Request, Response } from "express";

export const getAllCompaniesHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await getCompanies();
    return res.json({ data });
  } catch (error) {
    next(error);
  }
};

export const createCompanyHandler = async (
  req: Request<{}, {}, CreateCompanyDTO["body"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const company = await createCompany(req.body);

    return res.status(201).send(company);
  } catch (error) {
    next(error);
  }
};

export const updateCompanyHandler = async (
  req: Request<GetCompanyDTO["params"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const company = await updateCompany({ _id: req.params.id }, req.body, {
      new: true,
    });

    if (!company) {
      const error = new NotFoundError("Company not found");
      next(error);
      return;
    }

    return res.send(company);
  } catch (error) {
    next(error);
  }
};
