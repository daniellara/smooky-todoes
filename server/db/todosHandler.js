const { ObjectID } = require('mongodb');
const { Todo } = require('../models/todo');
const _ = require('lodash');

function findTodos() {
  return new Promise((resolve, reject) => {
    Todo.find().then((todos) => {
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

function saveTodo(todoText) {
  const todo = new Todo({
    text: todoText
  });
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

function findTodo(id) {
  return new Promise((resolve, reject) => {
    if (!ObjectID.isValid(id)) {
      return reject({
        code: 400,
        message: 'ID not valid'
      });
    }
    Todo.findById(id).then((todo) => {
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

function removeTodo(id) {
  return new Promise((resolve, reject) => {
    if (!ObjectID.isValid(id)) {
      return reject({
        code: 400,
        message: 'ID not valid'
      });
    }

    Todo.findByIdAndRemove(id).then((todo) => {
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

function updateTodo(id, body) {
  return new Promise((resolve, reject) => {
    if (!ObjectID.isValid(id)) {
      return reject({
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

    Todo.findByIdAndUpdate(id, { $set: body }, { new: true }).then((todo) => {
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
