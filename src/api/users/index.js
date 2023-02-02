import express from "express";
import createHttpError from "http-errors";
import { Op } from "sequelize";
import UserModel from "./UserModel.js";

const localEndpoint = `${process.env.LOCAL_URL}${process.env.PORT}/users`;

const userRouter = express.Router();

userRouter.post("/", async (req, res, next) => {
  try {
    console.log(req.headers.origin, "POST new user at:", new Date());
    const { id } = await UserModel.create(req.body);
    res.status(201).send({ message: `Added a new user.`, id });
  } catch (error) {
    if (error.errors && error.errors[0].type === "Validation error") {
      res.status(400).send({
        message: `Fields are required`,
      });
    }
    next(error);
  }
});

userRouter.get("/", async (req, res, next) => {
  try {
    console.log(req.headers.origin, "GET users at:", new Date());
    const query = {};
    if (req.query.firstName)
      query.firstName = { [Op.iLike]: `%${req.query.firstName}%` };
    if (req.query.lastName)
      query.lastName = { [Op.iLike]: `%${req.query.lastName}%` };
    if (req.query.country)
      query.country = { [Op.iLike]: `%${req.query.country}%` };
    if (req.query.email) query.email = { [Op.iLike]: `%${req.query.email}%` };
    if (req.query.age) query.age = { [Op.between]: req.query.age.split(",") };
    if (req.query.username)
      query.username = { [Op.iLike]: `%${req.query.username}%` };
    const foundUsers = await UserModel.findAll({
      where: { ...query },
      attributes: req.query.attributes ? req.query.attributes.split(",") : {},
    });
    res.status(200).send(foundUsers);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

userRouter.get("/:userId", async (req, res, next) => {
  try {
    console.log(req.headers.origin, "GET user by id at:", new Date());
    const foundUser = await UserModel.findByPk(req.params.userId, {
      attributes: req.query.attributes ? req.query.attributes.split(",") : {},
    });
    if (foundUser) {
      res.status(200).send(foundUser);
    } else {
      next(createHttpError(404, "User Not Found"));
    }
  } catch (error) {
    next(error);
  }
});

userRouter.put("/:userId", async (req, res, next) => {
  try {
    console.log(req.headers.origin, "PUT user at:", new Date());
    const [numUpdated, updatedUser] = await UserModel.update(req.body, {
      where: { id: req.params.userId },
      returning: true,
    });
    if (numUpdated === 1) {
      res.status(200).send(updatedUser[0]);
    } else {
      next(createHttpError(404, "User Not Found"));
    }
  } catch (error) {
    next(error);
  }
});

userRouter.delete("/:userId", async (req, res, next) => {
  try {
    console.log(req.headers.origin, "DELETE user at:", new Date());
    const deleted = await UserModel.destroy({
      where: { id: req.params.userId },
    });
    if (deleted === 1) {
      res.status(204).send({ message: "User has been deleted." });
    } else {
      next(createHttpError(404, "User not found."));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

export default userRouter;
