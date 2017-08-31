const {ObjectID} = require('mongodb');

const
  {Todo} = require('../models/todo'),
  {User} = require('../models/user');

function findTodos() {
  return new Promise((resolve, reject) => {
    Todo.find().then((todos) => {
      resolve({
        data: todos
      })
    }).catch((err) => {
      console.error('An error happened in findTodos.', err);
      reject({
        code: 400,
        message: 'Cannot find todos'
      })
    })
  });
};

function saveTodo(todoText) {
  let todo = new Todo({
    text: todoText
  });
  return new Promise((resolve, reject) => {
    todo.save().then((doc) => {
      resolve({
        data: doc
      });
    }).catch((err) => {
      console.error('An error happened in saveTodo.', err);
      reject({
        code: 400,
        message: 'Cannot save the todo'
      })
    });
  });
};

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
      resolve({
        data: todo
      });
    }).catch((err) => {
      console.error('An error happened in findTodo.', err);
      reject({
        code: 400,
        message: 'An error happened fetching the todo'
      });
    })
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
      resolve({
        data: todo
      })
    }).catch((err) => {
      reject({
        code: 400,
        message: 'An error happened removing the todo'
      })
    });
  });
}

module.exports = {
  findTodos,
  saveTodo,
  findTodo,
  removeTodo
}
