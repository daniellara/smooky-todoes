/**
 * Main file that launch the server
 */
const config = require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { todosRouter } = require('./routes/todosRouter');
const { usersRouter } = require('./routes/usersRouter');

config.setEnvConf();

const app = express();
const port = process.env.PORT;

// Configure mongoose
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

// Configure the server
app.use(bodyParser.json());
app.use('/todos', todosRouter);
app.use('/users', usersRouter);

// Launcher the server
app.listen(port);

module.exports = { app };
