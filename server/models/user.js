/**
 * Mongoose model for User
 */
const mongoose = require('mongoose');
const val = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

const config = require('../config/config');

const SALT_ROUNDS = 12;

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: value => val.isEmail(value),
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true
    },
    token: {
      type: String,
      required: true
    }
  }]
});

function _generateAuthToken(user, access) {
  const token = jwt.sign({ _id: user._id.toHexString(), access }, config.secretJWT);
  user.tokens.push({ access, token });
  return token;
}

UserSchema.methods.toJSON = function () {
  const user = this;
  const userObject = user.toObject();
  return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.signUp = function () {
  const user = this;
  const token = _generateAuthToken(user, 'auth');
  const result = { user, token };
  return user.save()
    .then(() => Promise.resolve(result))
    .catch(err => Promise.reject(err));
};

UserSchema.methods.removeToken = function (token) {
  const user = this;

  return user.update({
    $pull: {
      tokens: {
        token
      }
    }
  });
};

UserSchema.statics.findByToken = function (token) {
  const User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, config.secretJWT);
  } catch (err) {
    return Promise.reject();
  }

  return User.findOne({
    _id: decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth'
  });
};

UserSchema.statics.findByCredentials = function (email, password) {
  const User = this;

  return User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject('The user does not exist.');
      }
      return bcrypt.compare(password, user.password)
        .then((res) => {
          if (res) {
            const token = _generateAuthToken(user, 'auth');
            return user.save()
              .then(() => Promise.resolve({ user, token }))
              .catch(err => Promise.reject(err));
          }
          return Promise.reject('Wrong password.');
        });
    })
    .catch(err => Promise.reject({ message: err }));
};

UserSchema.pre('save', function (next) {
  const user = this;

  if (user.isModified('password')) {
    bcrypt.hash(user.password, SALT_ROUNDS)
      .then((hash) => {
        user.password = hash;
        next();
      });
  } else {
    next();
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };
