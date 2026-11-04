// models/author.js
import { DataTypes } from "sequelize";
import { sequelize } from "../sequalize.js";

export const Author = sequelize.define(
  "Author",
  {
    id: { 
        type: DataTypes.INTEGER, 
        primaryKey: true, 
        autoIncrement: true },
    name: { 
        type: DataTypes.STRING(50), 
        allowNull: false },
  },
  { timestamps: false,
    tableName: "authors" }
);