/**
 * Main config file
 */

// Get the environment to use
const env = process.env.NODE_ENV || 'development';

// Set some properties depending the environment
if (env === 'development') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp';
} else if (env === 'test') {
  process.env.PORT = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest';
}
