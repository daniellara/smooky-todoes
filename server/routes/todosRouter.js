const express = require('express');

const todosRouter = express.Router();
const dbHandler = require('../db/todosHandler');
const _ = require('lodash');

todosRouter.route('/')
  .get((req, res) => {
    dbHandler.findTodos().then((value) => {
      res.send({
        todos: value.data,
      });
    }).catch((err) => {
      res.status(err.code).send({ message: err.errObj });
    });
  })
  .post((req, res) => {
    dbHandler.saveTodo(req.body.text).then((value) => {
      res.send(value.data);
    }).catch((err) => {
      res.status(err.code).send({ message: err.errObj });
    });
  });

todosRouter.route('/:id')
  .get((req, res) => {
    dbHandler.findTodo(req.params.id).then((value) => {
      res.send({
        todo: value.data,
      });
    }).catch((err) => {
      res.status(err.code).send({ message: err.message });
    });
  })
  .delete((req, res) => {
    dbHandler.removeTodo(req.params.id).then((value) => {
      res.send({
        todo: value.data,
      });
    }).catch((err) => {
      res.status(err.code).send({ message: err.message });
    });
  })
  .patch((req, res) => {
    const id = req.params.id;
    const body = _.pick(req.body, ['text', 'completed']);
    dbHandler.updateTodo(id, body).then((value) => {
      res.send({
        todo: value.data,
      });
    }).catch((err) => {
      res.status(err.code).send({ message: err.message });
    });
  });

module.exports = { todosRouter };
