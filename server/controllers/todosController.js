/**
 * This file represents the todoController.
 * It will take care about all actions that the api can perform with the todos
 */
const _ = require('lodash');
const { ObjectID } = require('mongodb');

const todosService = require('../services/todosService');

const { Todo } = require('../models/todo');

/**
 * TodoController method for get all the todos.
 * Just a call to the todoService
 *
 * @method getTodos
 * @return {Promise} Promise for getting the todos
 */
function getTodos(req) {
  return todosService.findTodos(req);
}

/**
 * TodoController method for save a todo.
 * Build the new todo and call to the todoService to save it
 *
 * @method saveTodo
 * @param {String} text Text of the new todo
 * @return {Promise} Promise for save a todo
 */
function saveTodo(req) {
  const todo = new Todo({
    text: req.body.text,
    _creator: req.user._id
  });
  return todosService.saveTodo(todo);
}

/**
 * TodoController method for get a todo.
 * Call the todoService with an id to retrieve a todo
 *
 * @method getTodo
 * @param {String} id The id of the todo to search
 * @return {Promise} Promise for get a todo
 */
function getTodo(req) {
  if (!ObjectID.isValid(req.params.id)) {
    return Promise.reject({
      code: 400,
      message: 'ID not valid'
    });
  }
  return todosService.findTodo(req.params.id, req.user._id);
}

/**
 * TodoController method for remove a todo.
 * Call the todoService with an id to retrieve a todo
 *
 * @method removeTodo
 * @param {String} id The id of the todo to remove
 * @return {Promise} Promise for remove a todo
 */
function removeTodo(req) {
  if (!ObjectID.isValid(req.params.id)) {
    return Promise.reject({
      code: 400,
      message: 'ID not valid'
    });
  }
  return todosService.removeTodo(req.params.id, req.user._id);
}

/**
 * TodoController method for update a todo.
 * Call the todoService with an id to update a todo
 *
 * @method updateTodo
 * @param {Object} req Request with the info for update a todo
 * @return {Promise} Promise for update a todo
 */
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
  return todosService.updateTodo(id, req.user._id, body);
}

module.exports = {
  getTodos,
  saveTodo,
  getTodo,
  removeTodo,
  updateTodo
};
