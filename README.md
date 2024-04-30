# API for ACT matrix app

A backend for my ACT matrix tool. Built using expressjs and postgresql.
[express-validator](https://express-validator.github.io/docs) is used to validate and sanitize form data.
[sanitize-html](https://www.npmjs.com/package/sanitize-html) is used to sanitize html from the text editor.
[node-postgress](https://node-postgres.com/) is used for all database operations. 
Hosted on [railway](https://railway.app/)


## Routes and controllers

- create new matrix
- update specific matrix
- update matrix title
- get one matrix
- get all matrices of user
- delete matrix

## authentication

Authentication is done using Auth0. An auth function checking JWT runs on all protected routes.


