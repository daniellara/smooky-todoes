/**
 * Mongoose model for User
 */
const mongoose = require('mongoose');

const val = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: value => val.isEmail(value),
      message: '{VALUE} is not defined'
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
  const token = jwt.sign({ _id: user._id.toHexString(), access }, 'abc123');
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
  return user.save().then(() => result);
};

const User = mongoose.model('User', UserSchema);

module.exports = { User };
