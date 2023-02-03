import { DataTypes } from "sequelize";
import sequelize from "../../db.js";
import ReviewModel from "../products/ReviewModel.js";
import CartModel from "../cart/CartModel.js";

const UserModel = sequelize.define("user", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING(2),
    allowNull: false,
  },
});

UserModel.hasMany(ReviewModel, {
  foreignKey: "userId",
});
ReviewModel.belongsTo(UserModel);

UserModel.hasMany(CartModel, {
  foreignKey: "cartId",
});
CartModel.belongsTo(UserModel);

export default UserModel;
