// models/loan.js
import { DataTypes } from "sequelize";
import { sequelize } from "../sequalize.js";

export const Loan = sequelize.define(
  "Loan",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    loaned_at: { type: DataTypes.DATEONLY, allowNull: false },
    due_date: { type: DataTypes.DATEONLY, allowNull: false },
    returned_at: { type: DataTypes.DATEONLY, allowNull: true },
  },
  { timestamps: false, tableName: "loans" }
);