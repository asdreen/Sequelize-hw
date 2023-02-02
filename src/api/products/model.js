import { DataTypes } from "sequelize";
import sequelize from "../../db.js";
import ReviewModel from "./ReviewModel.js";
import CategoryModel from "../categories/CategoryModel.js";
import ProductCategoryModel from "../junctions/ProductCategoryModel.js";

const ProductModel = sequelize.define("product", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  /*category: {
    type: DataTypes.STRING,
    allowNull: false,
  },*/
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "https://placekitten.com/420/420",
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

ProductModel.hasMany(ReviewModel, {
  foreignKey: { name: "productId" },
});
ReviewModel.belongsTo(ProductModel);

ProductModel.belongsToMany(CategoryModel, {
  through: ProductCategoryModel,
  foreignKey: {
    name: "productId",
    allowNull: false,
  },
});
CategoryModel.belongsToMany(ProductModel, {
  through: ProductCategoryModel,
  foreignKey: {
    name: "categoryId",
    allowNull: false,
  },
});

export default ProductModel;
