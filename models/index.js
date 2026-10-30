// models/index.js
import { Author } from "./author.js";
import { Book } from "./book.js";
import { Member } from "./member.js";
import { Loan } from "./loan.js";

Author.hasMany(Book, { foreignKey: "author_id", onDelete: "RESTRICT" });
Book.belongsTo(Author, { foreignKey: "author_id" });

Member.hasMany(Loan, { foreignKey: "member_id", onDelete: "RESTRICT" });
Loan.belongsTo(Member, { foreignKey: "member_id" });
Book.hasMany(Loan, { foreignKey: "book_id", onDelete: "RESTRICT" });
Loan.belongsTo(Book, { foreignKey: "book_id" });

// Optional shortcut for the M:N link (the routes below don't need it)
Member.belongsToMany(Book, { through: Loan, foreignKey: "member_id", otherKey: "book_id" });
Book.belongsToMany(Member, { through: Loan, foreignKey: "book_id", otherKey: "member_id" });

export { Author, Book, Member, Loan };