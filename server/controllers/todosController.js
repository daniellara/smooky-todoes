const _ = require('lodash');
const { ObjectID } = require('mongodb');

const todosService = require('../services/todosService');

const { Todo } = require('../models/todo');

function getTodos() {
  return todosService.findTodos();
}

function saveTodo(text) {
  const todo = new Todo({
    text
  });
  return todosService.saveTodo(todo);
}

function getTodo(id) {
  if (!ObjectID.isValid(id)) {
    return Promise.reject({
      code: 400,
      message: 'ID not valid'
    });
  }
  return todosService.findTodo(id);
}

function removeTodo(id) {
  if (!ObjectID.isValid(id)) {
    return Promise.reject({
      code: 400,
      message: 'ID not valid'
    });
  }
  return todosService.removeTodo(id);
}

function updateTodo(req) {
  const id = req.params.id;
  const body = _.pick(req.body, ['text', 'completed']);
  if (!ObjectID.isValid(id)) {
    return Promise.reject({
      code: 400,
      message: 'ID not valid'
    });
  }
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = false;
    body.completedAt = null;
  }
  return todosService.updateTodo(id, body);
}

module.exports = {
  getTodos,
  saveTodo,
  getTodo,
  removeTodo,
  updateTodo
};
