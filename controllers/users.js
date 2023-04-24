const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const {
  noUserResponse, conflictResponse, invalidUserResponse, wrongDataResponseUser,
} = require('../utils/responses');
const { DEV_JWT_SECRET } = require('../utils/config');

const { NODE_ENV, JWT_SECRET } = process.env;

const getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError(noUserResponse);
    })
    .then((user) => {
      res.send({ email: user.email, name: user.name });
    })
    .catch((err) => {
      if (err.name === 'CastError') next(new BadRequestError(invalidUserResponse));
      else next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        const err = new Error(conflictResponse);
        err.statusCode = 409;
        throw err;
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then(() => {
      res.status(201).send({ name, email });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') next(new BadRequestError(wrongDataResponseUser));
      else next(err);
    });
};

const login = (req, res, next) => {
  const { password, email } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : DEV_JWT_SECRET,
        { expiresIn: '7d' },
      );

      res.send({ token });
    })
    .catch(next);
};

module.exports = { getUserMe, login, createUser };
