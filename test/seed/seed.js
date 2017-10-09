const { ObjectID } = require('mongodb');
const jwt = require('jsonwebtoken');

const config = require('../../server/config/config');

const { Todo } = require('../../server/models/todo');
const { User } = require('../../server/models/user');

const userOneID = new ObjectID();
const userTwoID = new ObjectID();

const users = [
  {
    _id: userOneID,
    email: 'exampleOne@example.com',
    password: 'userOne',
    tokens: [
      {
        access: 'auth',
        token: jwt.sign({ _id: userOneID, access: 'auth' }, config.secretJWT).toString()
      }
    ]
  },
  {
    _id: userTwoID,
    email: 'exampleTwo@example.com',
    password: 'userTwo'
  }
];

const todos = [
  {
    _id: new ObjectID(),
    text: 'First test todo'
  },
  {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333
  }
];

const updatedFirst = {
  text: 'Todo updated from test',
  completed: true
};

const updatedSecond = {
  text: 'Second todo updated from test',
  completed: false
};

function populateTodos(done) {
  Todo.remove({}).then(() => Todo.insertMany(todos)).then(() => done());
}

function populateUsers(done) {
  User.remove({}).then(() => {
    const userOne = new User(users[0]).save();
    const userTwo = new User(users[1]).save();
    return Promise.all([userOne, userTwo]);
  }).then(() => done());
}

module.exports = {
  todos,
  populateTodos,
  users,
  populateUsers,
  updatedFirst,
  updatedSecond
};
