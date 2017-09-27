/**
 * Users route file
 */

const express = require('express');

const usersRouter = express.Router();
const usersController = require('../controllers/usersController');

usersRouter.route('/')
  .post((req, res) => {
    usersController.signUpUser(req)
      .then((result) => {
        res.header('x-auth', result.token).send({ user: result.user });
      })
      .catch((err) => {
        res.status(err.code).send({ message: err.errObj });
      });
  });

module.exports = { usersRouter };
