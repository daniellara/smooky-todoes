/**
 * This file represents the Users controller.
 * It will take care about all actions that the api can perform with the Users
 */
const _ = require('lodash');

const usersService = require('../services/usersService');
const { User } = require('../models/user');

function saveUser(req) {
  const body = _.pick(req.body, ['email', 'password']);
  const user = new User({
    email: body.email,
    password: body.password
  });

  return usersService.saveUser(user);
}

module.exports = {
  saveUser
};
