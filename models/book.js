// models/book.js
import { DataTypes } from "sequelize";
import {sequelize} from "../sequalize.js";

export const Book = sequelize.define(
    "Book", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull:true,
    },
    genre: {
        type: DataTypes.STRING,
        allowNull:true,
    },
    published_year: {
        type: DataTypes.INTEGER,
        allowNull:true,
    }
    },
    {
    timestamps: false,
    tableName: "books"
    }
)