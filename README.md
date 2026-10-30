# Task 1 - Done
See ANSWERS.md

# Task 2
- sequalize.js created and imported in index.js
- Function for testing the database connection added to index.js, **just before the app.listen()**
- Test was successfully performed  
![Task-3-1](/images/db-comm-ok.png)  

# Task 3
- CRUD routes for books and authors have been rewritten for sequalize. Examples:  
**Get all books**
Route: GET
URL:http://localhost:3000/books
![Task-3-2](/images/books-get-all.png)  

**Get all authors**
Route: GET
URL:http://localhost:3000/authors
![Task-3-3](/images/authors-get-all.png)  

**Get all members**
Route: GET
URL:http://localhost:3000/members
![Task-3-4](/images/members-get-all.png)  

**Get member by id**
Route: GET
URL:http://localhost:3000/members/5
![Task-3-5](/images/members-get-by-id.png)  

**Get member by wrong id**
Route: GET
URL:http://localhost:3000/members/5
![Task-3-6](/images/members-get-by-id-err.png)  

**Create new member (unique email required)**
Route: POST
URL:http://localhost:3000/members
![Task-6-7](/images/members-create.png)  

**Create duplicate members won't work**
Route: POST
URL:http://localhost:3000/members
![Task-6-8](/images/members-create-err.png)  

**Update member**
Route: PUT
URL:http://localhost:3000/members/id
![Task-6-9](/images/members-update.png)  

**Delete member**
Route: PUT
URL:http://localhost:3000/members/id
![Task-6-10](/images/members-delete.png)  


more screnshots to come...maybe...getting boring now...