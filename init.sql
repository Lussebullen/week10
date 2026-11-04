CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(50),
    genre VARCHAR(50),
    published_year INT
);


CREATE TABLE authors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

-- on delete cascade means that if a book is deleted, the corresponding author_id in the authors table will also be deleted.
-- This is useful for maintaining referential integrity between the two tables.
-- But the relationship is a 1-to-many relationship, where one author can have many books, but each book can only have one author. 
-- So the foreign key will be created in the books table using the ALTER TABLE statement below. 
ALTER TABLE books ADD COLUMN author_id INT REFERENCES authors(id) ON DELETE RESTRICT;

-- Random starting data for books table (WITHOUT authors relationship). The rest will be added through the API.
-- NOTE: Only run this prior to exercise 6.
INSERT INTO books (title, genre, published_year) VALUES
('1984', 'Dystopian Fiction', 1948),
('Animal Farm', 'Political Satire', 1945),
('Brave New World', 'Dystopian Fiction', 1932),
('The Great Gatsby', 'American Literature', 1925),
('To Kill a Mockingbird', 'Fiction', 1960),
('Pride and Prejudice', 'Romance', 1813),
('The Catcher in the Rye', 'Fiction', 1951),
('The Hobbit', 'Fantasy', 1937),
('Fahrenheit 451', 'Dystopian Fiction', 1953),
('Moby Dick', 'Adventure Fiction', 1851);

-- For exercise 6 we will add some authors to the authors table, and then update the books table to include the author_id for each book.
-- I also added an "Unknown" author to the authors table, so that we can use that as a default author for any books that don't have an author yet.
INSERT INTO authors (name) VALUES
('Unknown'),
('George Orwell'),
('Aldous Huxley'),
('F. Scott Fitzgerald'),
('Harper Lee'),
('Jane Austen'),
('J.D. Salinger'),
('J.R.R. Tolkien'),
('Ray Bradbury'),
('Herman Melville');

UPDATE books SET author_id = 2 WHERE title IN ('1984', 'Animal Farm');
UPDATE books SET author_id = 3 WHERE title = 'Brave New World';
UPDATE books SET author_id = 4 WHERE title = 'The Great Gatsby';
UPDATE books SET author_id = 5 WHERE title = 'To Kill a Mockingbird';
UPDATE books SET author_id = 6 WHERE title = 'Pride and Prejudice';
UPDATE books SET author_id = 7 WHERE title = 'The Catcher in the Rye';
UPDATE books SET author_id = 8 WHERE title = 'The Hobbit';
UPDATE books SET author_id = 9 WHERE title = 'Fahrenheit 451';
UPDATE books SET author_id = 10 WHERE title = 'Moby Dick';

CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    address VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100) NOT NULL UNIQUE
);

-- having id as PK lets the same member loan a book several times, which a composite key of (member_id and book_id) won't allow
CREATE TABLE loans (
    id SERIAL PRIMARY KEY,
    member_id INT NOT NULL REFERENCES members(id) ON DELETE RESTRICT,
    book_id INT NOT NULL REFERENCES books(id) ON DELETE RESTRICT,
    loaned_at DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    returned_at DATE,
    CHECK (due_date >= loaned_at)
);

-- Seeding
INSERT INTO members (name, address, phone, email) VALUES
('Anna Lindqvist',    'Kungsgatan 14, 411 19 Göteborg',      '070-174 0101', 'anna.lindqvist@example.com'),
('Erik Johansson',    'Linnégatan 32, 413 04 Göteborg',      '070-174 0102', 'erik.johansson@example.com'),
('Maria Svensson',    'Vasagatan 21, 411 37 Göteborg',       '070-174 0103', 'maria.svensson@example.com'),
('Johan Karlsson',    'Olivedalsgatan 5, 413 09 Göteborg',   '070-174 0104', 'johan.karlsson@example.com'),
('Sara Nilsson',      'Fjärde Långgatan 18, 413 11 Göteborg','070-174 0105', 'sara.nilsson@example.com'),
('Oskar Andersson',   'Skanstorget 3, 413 18 Göteborg',      '070-174 0106', 'oskar.andersson@example.com'),
('Emma Eriksson',     'Mölndalsvägen 40, 412 63 Göteborg',   '070-174 0107', 'emma.eriksson@example.com'),
('Lars Persson',      'Redbergsvägen 22, 416 65 Göteborg',   '070-174 0108', 'lars.persson@example.com'),
('Karin Olsson',      'Bergsgatan 9, 414 52 Göteborg',       '070-174 0109', 'karin.olsson@example.com'),
('Mikael Larsson',    'Tredje Långgatan 27, 413 03 Göteborg','070-174 0110', 'mikael.larsson@example.com'),
('Sofia Gustafsson',  'Haga Nygata 11, 411 22 Göteborg',     '070-174 0111', 'sofia.gustafsson@example.com'),
('Anders Pettersson', 'Allégatan 6, 411 31 Göteborg',        '070-174 0112', 'anders.pettersson@example.com'),
('Lena Bergström',    'Chalmersgatan 15, 412 58 Göteborg',   '070-174 0113', 'lena.bergstrom@example.com'),
('Henrik Magnusson',  'Kyrkogatan 4, 411 15 Göteborg',       '070-174 0114', 'henrik.magnusson@example.com'),
('Ida Forsberg',      'Järntorget 7, 413 04 Göteborg',       '070-174 0115', 'ida.forsberg@example.com');

INSERT INTO loans (member_id, book_id, loaned_at, due_date, returned_at) VALUES
-- returned loans (some returned late)
(4,  1,  '2026-07-01', '2026-07-29', '2026-07-25'),
(6,  2,  '2026-07-05', '2026-08-02', '2026-08-04'),
(8,  3,  '2026-07-12', '2026-08-09', '2026-08-01'),
(10, 9,  '2026-07-15', '2026-08-12', '2026-08-10'),
(12, 10, '2026-07-20', '2026-08-17', '2026-08-17'),
(14, 1,  '2026-08-01', '2026-08-29', '2026-08-20'),
(15, 3,  '2026-08-03', '2026-08-31', '2026-09-05'),
(2,  4,  '2026-08-06', '2026-09-03', '2026-08-30'),
(5,  5,  '2026-08-10', '2026-09-07', '2026-09-01'),
(1,  6,  '2026-08-14', '2026-09-11', '2026-09-09'),
(3,  7,  '2026-08-18', '2026-09-15', '2026-09-12'),
(7,  8,  '2026-08-22', '2026-09-19', '2026-09-23'),
(9,  9,  '2026-08-25', '2026-09-22', '2026-09-20'),
(11, 10, '2026-09-01', '2026-09-29', '2026-09-27'),
(13, 4,  '2026-09-05', '2026-10-03', '2026-10-01'),
(4,  5,  '2026-09-12', '2026-10-10', '2026-10-07'),
(6,  9,  '2026-09-28', '2026-10-26', '2026-10-20'),
-- open loans (returned_at is NULL), the first two are overdue
(1,  1,  '2026-09-10', '2026-10-08', NULL),
(3,  2,  '2026-09-18', '2026-10-16', NULL),
(5,  3,  '2026-10-02', '2026-10-30', NULL),
(7,  4,  '2026-10-08', '2026-11-05', NULL),
(9,  5,  '2026-10-14', '2026-11-11', NULL),
(11, 6,  '2026-10-19', '2026-11-16', NULL),
(13, 7,  '2026-10-22', '2026-11-19', NULL),
(2,  8,  '2026-10-26', '2026-11-23', NULL);