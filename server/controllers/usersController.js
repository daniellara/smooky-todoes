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

  return user.signUp();
}

module.exports = {
  signUpUser
};
