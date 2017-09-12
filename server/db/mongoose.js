const mongoose = require('mongoose');

function connectToMongoDB() {
  mongoose.Promise = global.Promise;
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');
}

module.exports = { connectToMongoDB };
