import { DataTypes } from "sequelize";
import sequelize from "../../db.js";

const ReviewModel = sequelize.define("review", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  rate: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default ReviewModel;
