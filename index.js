import "dotenv/config";
import express from "express";
import { sequelize } from "./sequalize.js";
import {
  Op,
  ForeignKeyConstraintError,
  UniqueConstraintError,
  ValidationError,
} from "sequelize";
import { Book, Author, Member, Loan } from "./models/index.js";

const app = express();
app.use(express.json());

const port = process.env.APP_PORT;

const isValidId = (id) => /^\d+$/.test(String(id));

// Shared error handling for routes that write books
function handleWriteError(err, res) {
  if (err instanceof ForeignKeyConstraintError) {
    return res.status(400).send("Author does not exist");
  }
  if (err instanceof ValidationError) {
    return res.status(400).json({ errors: err.errors.map((e) => e.message) });
  }
  console.error(err);
  res.status(500).send("Internal server error");
}

app.get("/", (req, res) => {
    res.send("Welcome to the Library API!");
});


const allowedSorts = ["id", "title", "genre", "published_year"];

app.get("/books", async (req, res) => {
  const { genre } = req.query;
  const sort = req.query.sort || "id";

  if (!allowedSorts.includes(sort)) {
    return res.status(400).send("Invalid sort parameter");
  }

  // Filter out the books by genre if the query parameter is provided
  const where = {};
  if (genre) where.genre = genre;

  try {
    const books = await Book.findAll({
      where,
      order: [[sort, "ASC"]],
    });

    // If the list of books is empty, return a 404 status code with a message
    if (books.length === 0) {
      return res.status(404).send("No books were found that match your criteria");
    }
    res.json(books);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

// Endpoint to get a specific book by ID
app.get("/books/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    return res.status(400).send("Invalid book ID");
  }
  try {
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).send("Book not found");
    }
    res.json(book);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

app.post("/books", async (req, res) => {
  const { title, genre, published_year, author_id } = req.body;
  if (!title || !genre || !published_year || !author_id) {
    return res.status(400).send("Missing required fields: title, genre, published_year, author_id");
  }
  try {
    const book = await Book.create({ title, genre, published_year, author_id });
    res.status(201).json(book);
  } catch (err) {
    handleWriteError(err, res);
  }
});

// PUT replaces the whole book, so all fields are required
app.put("/books/:id", async (req, res) => {
  const { id } = req.params;
  const { title, genre, published_year, author_id } = req.body;
  if (!isValidId(id)) {
    return res.status(400).send("Invalid book ID");
  }
  if (!title || !genre || !published_year || !author_id) {
    return res.status(400).send("Missing required fields: title, genre, published_year, author_id");
  }
  try {
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).send("Book not found");
    }
    await book.update({ title, genre, published_year, author_id });
    res.json(book);
  } catch (err) {
    handleWriteError(err, res);
  }
});

// PATCH updates only the fields that were sent
app.patch("/books/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    return res.status(400).send("Invalid book ID");
  }

  const updates = {};
  for (const field of ["title", "genre", "published_year", "author_id"]) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }
  if (Object.keys(updates).length === 0) {
    return res.status(400).send("No fields provided for update");
  }

  try {
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).send("Book not found");
    }
    await book.update(updates);
    res.json(book);
  } catch (err) {
    handleWriteError(err, res);
  }
});

app.delete("/books/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    return res.status(400).send("Invalid book ID");
  }
  try {
    const book = await Book.findByPk(id);
    if (!book) {
      return res.status(404).send("Book not found");
    }
    await book.destroy();
    res.json(book);
  } catch (err) {
    if (err instanceof ForeignKeyConstraintError) {
      return res.status(409).send("Book has loan records and cannot be deleted");
    }
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

app.get("/authors", async (req, res) => {
  try {
    const authors = await Author.findAll();
    res.json(authors);
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

app.get("/authors/:id/books", async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    return res.status(400).send("Invalid author ID");
  }

  try {
    // One query: the author and all their books
    const author = await Author.findByPk(id, { include: Book });

    // Case 1: the author doesn't exist
    if (!author) {
      return res.status(404).send("Author not found");
    }

    // Case 2: the author exists, but has no books
    if (author.Books.length === 0) {
      return res.json({
        message: `Author ${author.name} has no books yet as far as we know.`,
        books: [],
      });
    }

    res.json(
      author.Books.map((b) => ({
        id: b.id,
        title: b.title,
        genre: b.genre,
        published_year: b.published_year,
        author_name: author.name,
      }))
    );
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

app.post("/authors", async (req, res) => {
  const { name } = req.body;
  try {
    const author = await Author.create({ name });
    res.status(201).json(author);
  } catch (err) {
    if (err instanceof ValidationError) {
      return res.status(400).json({ errors: err.errors.map((e) => e.message) });
    }
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

// UniqueConstraintError extends ValidationError, so it must be checked first
function handleMemberWriteError(err, res) {
  if (err instanceof UniqueConstraintError) {
    return res.status(409).send("A member with that email already exists");
  }
  if (err instanceof ValidationError) {
    return res.status(400).json({ errors: err.errors.map((e) => e.message) });
  }
  serverError(err, res);
}

app.post("/members", async (req, res) => {
  const { name, address, phone, email } = req.body;
  try {
    const member = await Member.create({ name, address, phone, email });
    res.status(201).json(member);
  } catch (err) {
    handleMemberWriteError(err, res);
  }
});

const allowedMemberSorts = ["id", "name", "email"];

app.get("/members", async (req, res) => {
  const { name } = req.query;
  const sort = req.query.sort || "id";
  if (!allowedMemberSorts.includes(sort)) {
    return res.status(400).send("Invalid sort parameter");
  }

  const where = {};
  if (name) where.name = { [Op.iLike]: `%${name}%` };

  try {
    const members = await Member.findAll({ where, order: [[sort, "ASC"]] });
    res.json(members);
  } catch (err) {
    serverError(err, res);
  }
});

app.get("/members/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    return res.status(400).send("Invalid member ID");
  }
  try {
    const member = await Member.findByPk(id);
    if (!member) {
      return res.status(404).send("Member not found");
    }
    res.json(member);
  } catch (err) {
    serverError(err, res);
  }
});

// PUT replaces the whole member: name and email required, the rest becomes null if missing
app.put("/members/:id", async (req, res) => {
  const { id } = req.params;
  const { name, address, phone, email } = req.body;
  if (!isValidId(id)) {
    return res.status(400).send("Invalid member ID");
  }
  if (!name || !email) {
    return res.status(400).send("Missing required fields: name, email");
  }
  try {
    const member = await Member.findByPk(id);
    if (!member) {
      return res.status(404).send("Member not found");
    }
    await member.update({ name, address: address ?? null, phone: phone ?? null, email });
    res.json(member);
  } catch (err) {
    handleMemberWriteError(err, res);
  }
});

app.patch("/members/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    return res.status(400).send("Invalid member ID");
  }

  const updates = {};
  for (const field of ["name", "address", "phone", "email"]) {
    if (req.body[field] !== undefined) updates[field] = req.body[field];
  }
  if (Object.keys(updates).length === 0) {
    return res.status(400).send("No fields provided for update");
  }

  try {
    const member = await Member.findByPk(id);
    if (!member) {
      return res.status(404).send("Member not found");
    }
    await member.update(updates);
    res.json(member);
  } catch (err) {
    handleMemberWriteError(err, res);
  }
});

app.delete("/members/:id", async (req, res) => {
  const { id } = req.params;
  if (!isValidId(id)) {
    return res.status(400).send("Invalid member ID");
  }
  try {
    const member = await Member.findByPk(id);
    if (!member) {
      return res.status(404).send("Member not found");
    }
    await member.destroy();
    res.json(member);
  } catch (err) {
    if (err instanceof ForeignKeyConstraintError) {
      return res.status(409).send("Member has loan records and cannot be deleted");
    }
    serverError(err, res);
  }
});

try {
  await sequelize.authenticate();
  console.log("Connected to PostgreSQL");
} catch (err) {
  console.error("Database connection failed:", err);
  process.exit(1);
}

app.listen(port, (err) => {
  if (err) {
    console.error("Could not start server:", err);
    process.exit(1);
  }
  console.log(`Server is running on port ${port}...`);
});