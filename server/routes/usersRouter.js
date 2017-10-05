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


usersRouter.use('/me', authenticate);

usersRouter.route('/me')
  .get((req, res) => {
    res.send(req.user);
  });

module.exports = { usersRouter };
