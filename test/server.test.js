/**
 * File that contains unitary test for Todo endpoints
 */
const expect = require('expect');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('../server/server');
const { Todo } = require('../server/models/todo');
const { User } = require('../server/models/user');

const { todos, users, populateUsers, populateTodos, updatedFirst, updatedSecond } = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('Todo endpoints', () => {
  describe('POST /todos', () => {
    it('should create a new todo', (done) => {
      const text = 'Test todo text';

      request(app)
        .post('/todos')
        .send({ text })
        .expect(200)
        .expect((res) => {
          expect(res.body.text).toBe(text);
        })
        .end((err) => {
          if (err) {
            return done(err);
          }

          Todo.find({ text }).then((result) => {
            expect(result.length).toBe(1);
            expect(result[0].text).toBe(text);
            done();
          }).catch(error => done(error));
        });
    });

    it('should not create todo with invalid body data', (done) => {
      request(app)
        .post('/todos')
        .send({})
        .expect(400)
        .end((err) => {
          if (err) {
            return done(err);
          }

          Todo.find().then((result) => {
            expect(result.length).toBe(2);
            done();
          }).catch(error => done(error));
        });
    });
  });

  describe('GET /todos', () => {
    it('should get all todos', (done) => {
      request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
          expect(res.body.todos.length).toBe(2);
        })
        .end(done);
    });
  });

  describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
      request(app)
        .get(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(todos[0].text);
        })
        .end(done);
    });

    it('should return 404 if todo not found', (done) => {
      request(app)
        .get(`/todos/${new ObjectID()}`)
        .expect(404)
        .end(done);
    });

    it('should return 400 if the id is not valid', (done) => {
      request(app)
        .get('/todos/123')
        .expect(400)
        .end(done);
    });
  });

  describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
      request(app)
        .delete(`/todos/${todos[0]._id.toHexString()}`)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo._id).toBe(todos[0]._id.toHexString());
        })
        .end((err) => {
          if (err) {
            return done(err);
          }

          Todo.findById(todos[0]._id.toHexString()).then((todo) => {
            expect(todo).toNotExist();
            done();
          }).catch(error => done(error));
        });
    });

    it('should return 404 if todo not found', (done) => {
      request(app)
        .delete(`/todos/${new ObjectID()}`)
        .expect(404)
        .end(done);
    });

    it('should return 400 if ID is invalid', (done) => {
      request(app)
        .delete('/todos/123')
        .expect(400)
        .end(done);
    });
  });

  describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
      const id = todos[0]._id.toHexString();
      request(app)
        .patch(`/todos/${id}`)
        .send(updatedFirst)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(updatedFirst.text);
          expect(res.body.todo.completed).toBe(true);
          expect(res.body.todo.completedAt).toBeA('number');
        })
        .end(done);
    });

    it('should clear completedAt when todo is not completed', (done) => {
      const id = todos[1]._id.toHexString();
      request(app)
        .patch(`/todos/${id}`)
        .send(updatedSecond)
        .expect(200)
        .expect((res) => {
          expect(res.body.todo.text).toBe(updatedSecond.text);
          expect(res.body.todo.completed).toBe(false);
          expect(res.body.todo.completedAt).toNotExist();
        })
        .end(done);
    });

    it('should return 404 if todo not found', (done) => {
      request(app)
        .patch(`/todos/${new ObjectID()}`)
        .expect(404)
        .end(done);
    });

    it('should return 400 if ID is invalid', (done) => {
      request(app)
        .patch('/todos/123')
        .expect(400)
        .end(done);
    });
  });
});

describe('Users endpoints', () => {
  describe('GET /users/me', () => {
    it('should return user if auth ok', (done) => {
      request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res) => {
          expect(res.body.user._id).toBe(users[0]._id.toHexString());
          expect(res.body.user.email).toBe(users[0].email);
        })
        .end(done);
    });

    it('should return 401 if auth nok', (done) => {
      request(app)
        .get('/users/me')
        .expect(401)
        .expect((res) => {
          expect(res.body).toEqual({ errMessage: 'Unauthorized' });
        })
        .end(done);
    });
  });

  describe('POST /users', () => {
    it('should create a user', (done) => {
      const email = 'example@example.com';
      const password = 'example123';

      request(app)
        .post('/users')
        .send({ email, password })
        .expect(200)
        .expect((res) => {
          expect(res.headers['x-auth']).toExist();
          expect(res.body.user._id).toExist();
          expect(res.body.user.email).toBe(email);
        })
        .end((err) => {
          if (err) {
            return done(err);
          }

          User.findOne({ email }).then((user) => {
            expect(user).toExist();
            expect(user.password).toNotBe(password);
            done();
          });
        });
    });

    it('should return validation error if request is invalid', (done) => {
      const email = 'example.com';
      const password = '123';

      request(app)
        .post('/users')
        .send({ email, password })
        .expect(400)
        .end(done);
    });

    it('should not create user if email in use', (done) => {
      request(app)
        .post('/users')
        .send({ email: users[0].email, password: users[0].password })
        .expect(400)
        .end(done);
    });
  });
});
