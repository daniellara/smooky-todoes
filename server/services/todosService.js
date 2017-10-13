// Service layer for the Todos.
const { Todo } = require('../models/todo');

/**
 * Retrieve all the Todos from the DB
 *
 * @method findTodos
 * @return {Promise} If no error it will return an array of Todos
 */
function findTodos(req) {
  return new Promise((resolve, reject) => {
    Todo.find({
      _creator: req.user._id
    }).then((todos) => {
      resolve({
        data: todos
      });
    }).catch((err) => {
      reject({
        code: 400,
        message: 'Cannot find todos',
        errObj: err
      });
    });
  });
}

/**
 * Save a Todo in the DB
 *
 * @param {Object} todo To save in the DB
 * @return {Promise} If no error it will return the Todo saved
 */
function saveTodo(todo) {
  return new Promise((resolve, reject) => {
    todo.save().then((doc) => {
      resolve({
        data: doc
      });
    }).catch((err) => {
      reject({
        code: 400,
        message: 'Cannot save the todo',
        errObj: err
      });
    });
  });
}

/**
 * Retrieve a Todo from the DB
 *
 * @param {String} id Of the Todo that will be searched
 * @return {Promise} It no error it will return the Todo
 */
function findTodo(todoId, userId) {
  return new Promise((resolve, reject) => {
    Todo.findOne(
      { _id: todoId,
        _creator: userId })
      .then((todo) => {
        if (!todo) {
          return reject({
            code: 404,
            message: 'ID not found'
          });
        }
        return resolve({
          data: todo
        });
      }).catch(err => reject({
        code: 400,
        message: 'An error happened fetching the todo',
        errObj: err
      }));
  });
}

/**
 * Remove a Todo from the DB
 *
 * @param {String} id Of the Todo that will be deleted
 * @return {Promise} If no error it will return the Todo deleted
 */
function removeTodo(todoId, userId) {
  return new Promise((resolve, reject) => {
    Todo.findOneAndRemove(
      { _id: todoId,
        _creator: userId
      }).then((todo) => {
      if (!todo) {
        return reject({
          code: 404,
          message: 'ID not found'
        });
      }
      return resolve({
        data: todo
      });
    }).catch(err => reject({
      code: 400,
      message: 'An error happened removing the todo',
      errObj: err
    }));
  });
}

/**
 * Update a Todo from the DB
 *
 * @param {String} id Of the Todo that will be updated
 * @param {String} body The new body of the todo
 * @return {Promise} If no error it will return the Todo updated
 */
function updateTodo(todoId, userId, body) {
  return new Promise((resolve, reject) => {
    Todo.findOneAndUpdate({ _id: todoId, _creator: userId },
      { $set: body }, { new: true }).then((todo) => {
      if (!todo) {
        return reject({
          code: 404,
          message: 'ID not found'
        });
      }
      return resolve({
        data: todo
      });
    }).catch(err => reject({
      code: 400,
      message: 'An error happened removing the todo',
      errObj: err
    }));
  });
}

module.exports = {
  findTodos,
  saveTodo,
  findTodo,
  removeTodo,
  updateTodo
};
