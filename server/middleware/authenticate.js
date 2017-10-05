const { User } = require('../models/user');

function authenticate(req, res, next) {
  const token = req.header('x-auth');

  User.findByToken(token)
    .then((user) => {
      if (!user) {
        return Promise.reject();
      }
      req.user = user;
      req.token = token;
      next();
    })
    .catch(() => {
      res.status(401).send({
        errMessage: 'Unauthorized'
      });
    });
}

module.exports = {
  authenticate
};
