import NotFoundError from "@/middlewares/errors/not-found-error";
import type { GetProductDTO } from "@/schemas/project.schema";
import { findProduct, updateProduct } from "@/services/product.service";
import type { NextFunction, Request, Response } from "express";

export const getProductHandler = async (
  req: Request<GetProductDTO["params"]>,
  res: Response,
  next: NextFunction
) => {
  try {
    const asin = req.params.asin;
    const product = await findProduct({ asin });

    if (!product) {
      res.send(null);
    }

    return res.send(product);
  } catch (error) {
    next(error);
  }
};

export const updateProductHandler = async (
  req: Request<GetProductDTO["params"]>,
  res: Response,
  next: NextFunction
) => {
  const asin = req.params.asin;
  const update = req.body;

  const product = await findProduct({ asin });

  if (!product) {
    const error = new NotFoundError("Product not found");
    next(error);
    return;
  }

  try {
    const updatedProduct = await updateProduct({ asin }, update, { new: true });

    return res.send(updatedProduct);
  } catch (error) {
    next(error);
  }
};
