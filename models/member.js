// models/member.js
import { DataTypes } from "sequelize";
import { sequelize } from "../sequalize.js";

export const Member = sequelize.define(
  "Member",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(50), allowNull: false, validate: { notEmpty: true } },
    address: { type: DataTypes.STRING(100), allowNull: true },
    phone: { type: DataTypes.STRING(20), allowNull: true },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
  },
  { timestamps: false, tableName: "members" }
);