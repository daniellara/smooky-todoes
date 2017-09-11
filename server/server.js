const
  express = require('express'),
  bodyParser = require('body-parser');

const
  {mongoose} = require('./db/mongoose'),
  dbHandler = require('./db/dbHandler');

let app = express();
let port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.route('/todos')
  .get((req, res) => {
    dbHandler.findTodos().then((value) => {
      res.send({
        todos: value.data
      });
    }).catch((err) => {
      console.error('There was an error fetching the todos.', err);
      res.status(err.code).send({message: err.message});
    });
  })
  .post((req, res) => {
    dbHandler.saveTodo(req.body.text).then((value) => {
      res.send(value.data);
    }).catch((err) => {
      console.error('There was an error saving the todo.', err);
      res.status(err.code).send({message: err.message});
    });
  });

app.route('/todos/:id')
  .get((req, res) => {
    dbHandler.findTodo(req.params.id).then((value) => {
      res.send({
        todo: value.data
      });
    }).catch((err) => {
      console.error('There was an error fetching the todo.', err);
      res.status(err.code).send({message: err.message});
    });
  })
  .delete((req, res) => {
    dbHandler.removeTodo(req.params.id).then((value) => {
      res.send({
        todo: value.data
      });
    }).catch((err) => {
      console.error('There was an error removing the todo', err);
      res.status(err.code).send({message: err.message});
    });
  })

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
