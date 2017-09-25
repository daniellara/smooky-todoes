require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { todosRouter } = require('./routes/todosRouter.js');

const app = express();
const port = process.env.PORT;

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI);

app.use(bodyParser.json());
app.use('/todos', todosRouter);

app.listen(port);

module.exports = { app };
