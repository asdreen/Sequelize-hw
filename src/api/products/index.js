import express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import ProductModel from "./model.js";

const productRouter = express.Router();

productRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await ProductModel.create(req.body);
    res.status(201).send({ message: "Added", id });
  } catch (error) {
    next(error);
  }
});

productRouter.get("/", async (req, res, next) => {
  try {
    const query = {};
    if (req.query.name) query.name = { [Op.iLike]: `%${req.query.name}%` };
    if (req.query.price) query.price = { [Op.between]: `${req.query.price}` };
    if (req.query.category)
      query.category = { [Op.iLike]: `%${req.query.category}%` };
    const foundProducts = await ProductModel.findAll({
      where: { ...query },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });
    res.status(200).send(foundProducts);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

productRouter.get("/:productId", async (req, res, next) => {
  try {
    const product = await ProductModel.findByPk(req.params.productId, {
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (product) {
      res.send(product);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productRouter.put("/:productId", async (req, res, next) => {
  try {
    const [numberOfUpdatedRows, updatedProducts] = await ProductModel.update(
      req.body,
      {
        where: { id: req.params.productId },
        returning: true,
      }
    );
    if (numberOfUpdatedRows === 1) {
      res.send(updatedProducts[0]);
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

productRouter.delete("/:productId", async (req, res, next) => {
  try {
    const numberOfDeletedRows = await ProductModel.destroy({
      where: { id: req.params.productId },
    });
    if (numberOfDeletedRows === 1) {
      res.status(204).send();
    } else {
      next(
        createHttpError(
          404,
          `Product with id ${req.params.productId} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});

export default productRouter;
