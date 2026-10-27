// models/index.js
//Explains relationships
import { Author } from "./author.js";
import { Book } from "./book.js";

Author.hasMany(Book, { foreignKey: "author_id", onDelete: "RESTRICT" });
Book.belongsTo(Author, { foreignKey: "author_id" });

export { Author, Book };