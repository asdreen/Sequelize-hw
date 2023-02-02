import express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import CategoryModel from "../categories/CategoryModel.js";
import ProductModel from "./model.js";
import ReviewModel from "./ReviewModel.js";
import UserModel from "../users/UserModel.js";

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
    if (req.query.price) query.price = { [Op.eq]: parseInt(req.query.price) };
    if (req.query.category)
      query.category = { [Op.iLike]: `%${req.query.category}%` };
    const foundProducts = await ProductModel.findAll({
      include: [
        { model: ReviewModel, attributes: ["comment", "rate"] },
        {
          model: CategoryModel,
          attributes: ["name"],
          through: { attributes: [] },
        },
      ],
      where: { ...query },
      //  attributes: { exclude: ["createdAt", "updatedAt"] },
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

//-----------------------------reviews---------------------------------

productRouter.post("/reviews/:productId", async (req, res, next) => {
  try {
    console.log(req.headers.origin, "POST review at:", new Date());
    const { id } = await ReviewModel.create({
      ...req.body,
      productId: req.params.productId,
    });
    res.status(201).send({ message: `Added a new review.`, id });
  } catch (error) {
    if (error.errors && error.errors[0].type === "Validation error") {
      res.status(400).send({
        message: `Fields are required `,
      });
    }
    next(error);
  }
});

productRouter.get("/reviews/:productId", async (req, res, next) => {
  try {
    console.log(req.headers.origin, "Get all reviews at:", new Date());
    const query = {};
    if (req.query.comment)
      query.comment = { [Op.iLike]: `%${req.query.comment}%` };
    if (req.query.rate)
      query.rate = { [Op.between]: req.query.rate.split(",") };
    const foundReviews = await ReviewModel.findAll({
      where: { ...query, productId: req.params.productId },
      include: { model: UserModel, attributes: ["firstName", "lastName"] },
      attributes: req.query.attributes ? req.query.attributes.split(",") : {},
    });
    if (foundReviews) {
      res.status(200).send(foundReviews);
    } else {
      createHttpError(404, "Reviews not found.");
    }
  } catch (error) {
    next(error);
  }
});
productRouter.get("/review/:reviewId", async (req, res, next) => {
  try {
    console.log(req.headers.origin, "Get review at:", new Date());
    const foundReview = await ReviewModel.findAll({
      where: { id: req.params.reviewId },
      attributes: req.query.attributes ? req.query.attributes.split(",") : {},
    });
    if (foundReview) {
      res.status(200).send(foundReview);
    } else {
      createHttpError(404, "Review not found.");
    }
  } catch (error) {
    next(error);
  }
});

productRouter.put("/reviews/:reviewId", async (req, res, next) => {
  try {
    console.log(req.headers.origin, "PUT review at:", new Date());
    const [numUpdated, updatedReviews] = await ReviewModel.update(req.body, {
      where: { id: req.params.reviewId },
      returning: true,
    });
    if (numUpdated === 1) {
      res.status(200).send(updatedReviews[0]);
    } else {
      next(createHttpError(404, "Review Not Found"));
    }
  } catch (error) {
    if (error.errors && error.errors[0].type === "Validation error") {
      res.status(400).send({
        message: `Fields are required`,
      });
    }
    next(error);
  }
});
productRouter.delete("/reviews/:reviewId", async (req, res, next) => {
  try {
    console.log(req.headers.origin, "Delete review at:", new Date());
    const deleted = await ReviewModel.destroy({
      where: { id: req.params.reviewId },
    });
    if (deleted === 1) {
      res.status(204).send({ message: "Review has been deleted." });
    } else {
      next(createHttpError(404, "Review not found."));
    }
  } catch (error) {
    next(error);
  }
});

export default productRouter;
