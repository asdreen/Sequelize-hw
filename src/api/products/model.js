import { DataTypes } from "sequelize";
import sequelize from "../../db.js";

const ProductModel = sequelize.define("product", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  image: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "https://placekitten.com/420/420",
    validate: {
      isUrl: true,
    },
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

export default ProductModel;
