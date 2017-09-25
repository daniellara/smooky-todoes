/**
 * Main file that launch the server
 */
require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { todosRouter } = require('./routes/todosRouter.js');

const app = express();
const port = process.env.PORT;

// Configure mongoose
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

// Configure the server
app.use(bodyParser.json());
app.use('/todos', todosRouter);

// Launcher the server
app.listen(port);

module.exports = { app };
