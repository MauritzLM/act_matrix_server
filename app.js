const express = require('express');
require('dotenv').config();
const app = express();
const routes = require("./routes/index");

app.use(express.json());
// routes
app.use('/', routes);

module.exports = app;

