## 1. Understanding the ORM 
1. An ORM translates databse tables into javascript objects where each object attribute is a column of the table

2. An ORM is an "object-relational mapper" that translates databse tables into javascript objects  
The relational part is an index.js file that explains how the tables are connected. For example, as the image below shows, there is a relation between the tables books and authors
![Task-6](/images/relations-1.png)  

While the SQL is more cryptic in describing relations, sequelize uses "common language" to describe the same: **Author.hasMany(Book,..** or **Book.belongsTo(Author,**

3. SQL translations  
Book.findAll() = "SELECT * FROM Books"  
Book.findByPk(3) = "SELECT * FROM Books WHERE Id=3"  

4. In new sequalize()  
- host: sets the host name, "localhost" in our case
- port: sets the port number, normally 5432,  
- dialect: tells Sequelize which kind of SQL database it’s communicating with (there are a couple to choose from some having a slightly different "dialect", like PostgreSQL, MySQL, MariaDB, and others)  
- logging: sets the logging mode, false (if we don't want any), or a function like console.log. true is already deprecated. Some options are:  
// Only the SQL text, without the "Executing (default):" prefix  
logging: (sql) => console.log(sql),  
  
// Log only in development  
logging: process.env.NODE_ENV === "production" ? false : console.log,  
  
// Include how long each query took  
benchmark: true,  
logging: (sql, ms) => console.log(`${sql}  [${ms} ms]`),  

5. **About sequalize.sync()**  
- It compares the models with the database and creates any non-existing tables (quite convenient if you did not create any tables and relations just yet). You call it once at startup, AFTER the models are loaded with **import "./models/index.js"**  
- sequelize.sync({ force: true }) runs DROP TABLE IF EXISTS for every model’s table creating them afterwards again from the model. You get empty tables that exactly match your sequalize code.  
- pretty self-explanatory why not to use the **sequelize.sync({ force: true })** on existing data, unless you want to start over from scratch (automated tests might need a clean database on each run)

