require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('./db/mongoose');
const { router } = require('./routes/router.js');

const app = express();
const port = process.env.PORT;

mongoose.connectToMongoDB();

app.use(bodyParser.json());
app.use('/', router);

app.listen(port);

module.exports = { app };
