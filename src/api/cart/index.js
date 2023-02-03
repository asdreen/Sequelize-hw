import express from "express";
import createHttpError from "http-errors";
import CartModel from "./CartModel.js";

const localEndpoint = `${process.env.LOCAL_URL}${process.env.PORT}/carts`;

const cartRouter = express.Router();

cartRouter.post("/", async (req, res, next) => {
  try {
    const { id } = await CartModel.create(req.body);
    res.status(201).send({ message: `Added a new cart.`, id });
  } catch (error) {
    if (error.errors && error.errors[0].type === "Validation error") {
      res.status(400).send({ message: `Fields are required` });
    }
    next(error);
  }
});

cartRouter.get("/", async (req, res, next) => {
  try {
    const foundCarts = await CartModel.findAll();
    res.status(200).send(foundCarts);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

cartRouter.get("/:cartId", async (req, res, next) => {
  try {
    const foundCart = await CartModel.findByPk(req.params.cartId, {
      attributes: req.query.attributes ? req.query.attributes.split(",") : {},
    });
    if (foundCart) {
      res.status(200).send(foundCart);
    } else {
      next(createHttpError(404, "Cart Not Found"));
    }
  } catch (error) {
    next(error);
  }
});

cartRouter.put("/:cartId", async (req, res, next) => {
  try {
    const [numUpdated, updatedCart] = await CartModel.update(req.body, {
      where: { id: req.params.cartId },
      returning: true,
    });
    if (numUpdated === 1) {
      res.status(200).send(updatedCart[0]);
    } else {
      next(createHttpError(404, "Cart Not Found"));
    }
  } catch (error) {
    next(error);
  }
});

cartRouter.delete("/:cartId", async (req, res, next) => {
  try {
    const deleted = await CartModel.destroy({
      where: { id: req.params.cartId },
    });
    if (deleted === 1) {
      res.status(204).send({ message: "Cart has been deleted." });
    } else {
      next(createHttpError(404, "Cart not found."));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default cartRouter;
