const mongoose = require('mongoose');

function connectToMongoDB() {
  mongoose.Promise = global.Promise;
  mongoose.connect(process.env.MONGODB_URI);
}

module.exports = { connectToMongoDB };
