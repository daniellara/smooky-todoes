/**
 * Todos routes file
 */
const express = require('express');

const todosRouter = express.Router();
const todosController = require('../controllers/todosController');

const { authenticate } = require('../middleware/authenticate');

/**
 * GET  /todos -> retrieve all Todos
 * POST /todos -> insert a Todo in the DB
 */
todosRouter.route('/')
  .get(authenticate, (req, res) => {
    todosController.getTodos(req)
      .then((value) => {
        res.send({ todos: value.data });
      })
      .catch((err) => {
        res.status(err.code).send({ message: err.errObj });
      });
  })
  .post(authenticate, (req, res) => {
    todosController.saveTodo(req)
      .then((value) => {
        res.send(value.data);
      })
      .catch((err) => {
        res.status(err.code).send({ message: err.errObj });
      });
  });

/**
 * GET    /todos/:id -> retrieve the Todo that matchs with the id
 * DELETE /todos/:id -> delete the Todo that matchs with the id
 * PATCH  /todos/:id -> update the Todo that matchs with the id
 */
todosRouter.route('/:id')
  .get((req, res) => {
    todosController.getTodo(req.params.id)
      .then((value) => {
        res.send({ todo: value.data });
      })
      .catch((err) => {
        res.status(err.code).send({ message: err.message });
      });
  })
  .delete((req, res) => {
    todosController.removeTodo(req.params.id)
      .then((value) => {
        res.send({ todo: value.data });
      })
      .catch((err) => {
        res.status(err.code).send({ message: err.message });
      });
  })
  .patch((req, res) => {
    todosController.updateTodo(req)
      .then((value) => {
        res.send({ todo: value.data });
      })
      .catch((err) => {
        res.status(err.code).send({ message: err.message });
      });
  });

module.exports = { todosRouter };
