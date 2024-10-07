const express = require('express');
require('dotenv').config();
const app = express();
const routes = require("./routes/index");
const cors = require('cors');
const bodyParser = require('body-parser');

// https://act-matrix.vercel.app for production
 const corsOptions = {
     origin: ['http://localhost:5173', 'https://act-matrix.vercel.app'],
     optionsSuccessStatus: 200
 }

app.use(cors(corsOptions));

// Enable the use of request body parsing middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}))

// app.use(express.json());

// routes
app.use('/', routes);

module.exports = app;

