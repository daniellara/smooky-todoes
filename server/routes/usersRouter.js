/**
 * Users route file
 */

const express = require('express');

const usersRouter = express.Router();
const usersController = require('../controllers/usersController');

usersRouter.route('/')
  .post((req, res) => {
    usersController.saveUser(req)
      .then((value) => {
        res.send({ users: value.data });
      })
      .catch((err) => {
        res.status(err.code).send({ message: err.errObj });
      });
  });

module.exports = { usersRouter };
