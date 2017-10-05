/**
 * This file represents the Users controller.
 * It will take care about all actions that the api can perform with the Users
 */
const _ = require('lodash');

const { User } = require('../models/user');

function signUpUser(req) {
  const body = _.pick(req.body, ['email', 'password']);
  const user = new User({
    email: body.email,
    password: body.password
  });

  return user.signUp()
    .then(value => Promise.resolve(value))
    .catch((err) => {
      if (err.code === 11000) {
        return Promise.reject({
          code: 400,
          message: 'User already in use'
        });
      } else if (err.errors.email) {
        return Promise.reject({
          code: 400,
          message: err.errors.email.message
        });
      }
      return Promise.reject({
        code: 500,
        message: 'Unexpected error'
      });
    });
}

module.exports = {
  signUpUser
};
