/**
 * Users route file
 */

const express = require('express');

const usersRouter = express.Router();
const usersController = require('../controllers/usersController');

const { authenticate } = require('../middleware/authenticate');

usersRouter.route('/')
  .post((req, res) => {
    usersController.signUpUser(req)
      .then((result) => {
        res.header('x-auth', result.token).send({ user: result.user });
      })
      .catch((err) => {
        res.status(err.code).send({ errMessage: err.message });
      });
  });

usersRouter.route('/me')
  .get(authenticate, (req, res) => {
    res.send({ user: req.user });
  });

usersRouter.route('/login')
  .post((req, res) => {
    usersController.loginUser(req)
      .then((result) => {
        res.header('x-auth', result.token).send({ user: result.user });
      })
      .catch((err) => {
        res.status(400).send({ errMessage: err.message });
      });
  });

usersRouter.route('/me/token')
  .delete(authenticate, (req, res) => {
    usersController.logoutUser(req)
      .then((result) => {
        res.status(200).send(result);
      })
      .catch((err) => {
        res.status(400).send({ errMessage: err });
      });
  });

module.exports = { usersRouter };
